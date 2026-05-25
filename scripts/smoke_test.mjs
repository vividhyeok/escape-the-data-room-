import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { createServer } from "vite";

const storageKey = "escape-the-data-room:v1";
const rootDir = process.cwd();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findBrowserPath() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);

  const browserPath = candidates.find((candidate) => existsSync(candidate));
  if (!browserPath) {
    throw new Error("Chrome or Edge executable was not found.");
  }

  return browserPath;
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        if (typeof address === "object" && address?.port) {
          resolve(address.port);
        } else {
          reject(new Error("Could not allocate a free port."));
        }
      });
    });
    server.on("error", reject);
  });
}

async function fetchJson(url, timeoutMs = 10_000) {
  const started = Date.now();
  let lastError;

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      lastError = error;
    }
    await delay(120);
  }

  throw lastError ?? new Error(`Timed out fetching ${url}`);
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.handlers = new Map();

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));

      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result ?? {});
        }
        return;
      }

      if (message.method && this.handlers.has(message.method)) {
        for (const handler of this.handlers.get(message.method)) {
          handler(message.params ?? {});
        }
      }
    });
  }

  static connect(url) {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url);
      socket.addEventListener("open", () => resolve(new CdpClient(socket)));
      socket.addEventListener("error", () => reject(new Error("CDP WebSocket connection failed.")));
    });
  }

  on(method, handler) {
    const handlers = this.handlers.get(method) ?? [];
    handlers.push(handler);
    this.handlers.set(method, handlers);
  }

  waitForEvent(method, timeoutMs = 10_000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs);
      const handler = (params) => {
        clearTimeout(timeout);
        resolve(params);
      };
      this.on(method, handler);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const payload = JSON.stringify({ id, method, params });

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(payload);
    });
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression) {
  const response = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text ?? "Runtime evaluation failed.");
  }

  return response.result?.value;
}

async function waitFor(client, expression, label, timeoutMs = 7_000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      if (await evaluate(client, `Boolean(${expression})`)) {
        console.log(`PASS ${label}`);
        return;
      }
    } catch {
      // The page may be between navigations.
    }
    await delay(120);
  }

  let bodyText = "";
  try {
    bodyText = await evaluate(client, "document.body.innerText.slice(0, 800)");
  } catch {
    bodyText = "Unable to read body text.";
  }
  throw new Error(`Timed out: ${label}. Body excerpt: ${bodyText}`);
}

async function clickText(client, text, selector = "button") {
  const clicked = await evaluate(
    client,
    `(() => {
      const nodes = Array.from(document.querySelectorAll(${JSON.stringify(selector)}));
      const target = nodes.find((node) => node.textContent.includes(${JSON.stringify(text)}));
      if (!target) return false;
      target.click();
      return true;
    })()`,
  );

  if (!clicked) {
    throw new Error(`Could not click text: ${text}`);
  }
}

async function clickSelector(client, selector) {
  const clicked = await evaluate(
    client,
    `(() => {
      const target = document.querySelector(${JSON.stringify(selector)});
      if (!target) return false;
      target.click();
      return true;
    })()`,
  );

  if (!clicked) {
    throw new Error(`Could not click selector: ${selector}`);
  }
}

async function visibleHotspotLabels(client) {
  return await evaluate(
    client,
    `Array.from(document.querySelectorAll(".hotspot .hotspot-label")).map((node) => node.textContent.trim())`,
  );
}

async function checkVisibleHotspots(client, expectedLabels, label) {
  await waitFor(
    client,
    `${JSON.stringify(expectedLabels)}.every((label) => Array.from(document.querySelectorAll(".hotspot .hotspot-label")).some((node) => node.textContent.trim() === label))`,
    label,
  );

  const labels = await visibleHotspotLabels(client);
  if (labels.length !== expectedLabels.length) {
    throw new Error(`${label}: expected ${expectedLabels.length} hotspots, got ${labels.length} (${labels.join(", ")})`);
  }
}

async function fillSelector(client, selector, value) {
  const filled = await evaluate(
    client,
    `(() => {
      const target = document.querySelector(${JSON.stringify(selector)});
      if (!target) return false;
      const prototype = target instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(prototype, "value").set;
      setter.call(target, ${JSON.stringify(value)});
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    })()`,
  );

  if (!filled) {
    throw new Error(`Could not fill selector: ${selector}`);
  }
}

async function run() {
  const server = await createServer({
    root: rootDir,
    logLevel: "error",
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: false,
    },
  });

  let browser;
  let client;
  const profileDir = await fs.mkdtemp(path.join(os.tmpdir(), "etdr-smoke-"));

  try {
    await server.listen();
    const appUrl = server.resolvedUrls?.local?.[0] ?? "http://127.0.0.1:5173/";
    const debugPort = await getFreePort();
    const browserPath = findBrowserPath();

    browser = spawn(browserPath, [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-features=RendererCodeIntegrity",
      "--no-first-run",
      "--no-default-browser-check",
      "--remote-allow-origins=*",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profileDir}`,
      "about:blank",
    ]);

    browser.on("exit", (code) => {
      if (code && code !== 0) {
        console.error(`Browser exited with code ${code}`);
      }
    });

    await fetchJson(`http://127.0.0.1:${debugPort}/json/version`);
    const targets = await fetchJson(`http://127.0.0.1:${debugPort}/json/list`);
    const pageTarget = targets.find((target) => target.type === "page");
    if (!pageTarget?.webSocketDebuggerUrl) {
      throw new Error("No debuggable page target was found.");
    }

    client = await CdpClient.connect(pageTarget.webSocketDebuggerUrl);
    const browserErrors = [];
    client.on("Runtime.exceptionThrown", (params) => {
      browserErrors.push(params.exceptionDetails?.text ?? "Runtime exception");
    });
    client.on("Log.entryAdded", (params) => {
      if (params.entry?.level === "error") {
        browserErrors.push(params.entry.text);
      }
    });

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Log.enable");

    const loadPromise = client.waitForEvent("Page.loadEventFired", 10_000);
    await client.send("Page.navigate", { url: appUrl });
    await loadPromise;
    await evaluate(client, "localStorage.clear(); location.reload();");
    await waitFor(client, `document.body.innerText.includes("잠긴 서재")`, "Room 0 loads on fresh start");
    await clickText(client, "R1");
    await waitFor(client, `document.body.innerText.includes("신호실")`, "Room 1 loads");
    await waitFor(client, `document.body.innerText.includes("단어 전광판")`, "Room 1 objects render");

    await clickText(client, "단어 전광판");
    await waitFor(client, `document.body.innerText.includes("단어 전광판")`, "Word Billboard inspect opens");

    await clickText(client, "Open Python Lab");
    await waitFor(client, `document.querySelector(".lab-window")`, "Python Lab opens");
    await waitFor(client, `typeof window.__setCodeEditor === "function"`, "CodeMirror editor ready");
    await evaluate(client, `window.__setCodeEditor("print('smoke draft')\\n# smoke draft")`);
    await waitFor(
      client,
      `localStorage.getItem(${JSON.stringify(storageKey)})?.includes("# smoke draft")`,
      "Code draft auto-saves",
    );

    await clickSelector(client, ".lab-actions .primary-button");
    await waitFor(client, `document.body.innerText.includes("SIXSEVENONENINE")`, "Mock output renders");

    await fillSelector(client, ".inspect-modal .unlock-input", "6719");
    await clickText(client, "Check Code");
    await waitFor(client, `localStorage.getItem(${JSON.stringify(storageKey)})?.includes("Door Code 1번째 조각: 7")`, "Word Billboard door piece collected");

    await clickSelector(client, ".game-window-inspect .window-close");
    await waitFor(client, `!document.querySelector(".inspect-modal")`, "Inspect modal closes");
    await clickSelector(client, ".game-window-python .window-close");
    await waitFor(client, `!document.querySelector(".lab-window")`, "Python Lab closes");

    await clickText(client, "숫자 패널");
    await waitFor(client, `document.body.innerText.includes("숫자 패널")`, "Number Panel inspect opens");
    await fillSelector(client, ".inspect-modal .unlock-input", "4820");
    await clickText(client, "Check Code");
    await waitFor(client, `localStorage.getItem(${JSON.stringify(storageKey)})?.includes("Door Code 3번째 조각: 7")`, "Number Panel door piece collected");
    await clickSelector(client, ".game-window-inspect .window-close");

    await clickText(client, "◀");
    await waitFor(client, `document.body.innerText.includes("OX 모니터")`, "Left view renders OX Monitor");
    await clickText(client, "OX 모니터");
    await waitFor(client, `document.body.innerText.includes("OX 모니터")`, "OX Monitor inspect opens");
    await fillSelector(client, ".inspect-modal .unlock-input", "1937");
    await clickText(client, "Check Code");
    await waitFor(client, `localStorage.getItem(${JSON.stringify(storageKey)})?.includes("Door Code 2번째 조각: 4")`, "OX Monitor door piece collected");
    await clickSelector(client, ".game-window-inspect .window-close");

    await clickText(client, "▶");
    await clickText(client, "▶");
    await waitFor(client, `document.body.innerText.includes("명함 보드")`, "Right view renders Name Card Board");
    await clickText(client, "명함 보드");
    await waitFor(client, `document.body.innerText.includes("명함 보드")`, "Name Card inspect opens");
    await fillSelector(client, ".inspect-modal .unlock-input", "8052");
    await clickText(client, "Check Code");
    await waitFor(client, `localStorage.getItem(${JSON.stringify(storageKey)})?.includes("Door Code 4번째 조각: 9")`, "Name Card door piece collected");
    await clickSelector(client, ".game-window-inspect .window-close");

    await waitFor(client, `document.body.innerText.includes("출입문 키패드")`, "Right view renders Door Keypad");
    await clickText(client, "출입문 키패드");
    await waitFor(client, `document.querySelector(".door-modal")`, "Door keypad opens");
    await fillSelector(client, ".door-modal input", "7479");
    await waitFor(client, `document.querySelector(".door-modal input")?.value === "7479"`, "Door code input updates");
    await waitFor(
      client,
      `localStorage.getItem(${JSON.stringify(storageKey)})?.includes("7479")`,
      "Door attempt auto-saves",
    );
    await clickText(client, "입력");
    await waitFor(client, `document.body.innerText.includes("방 클리어")`, "Room 1 clears");
    await waitFor(client, `document.body.innerText.includes("Missed Hidden Clues")`, "Review shows hidden clue recap");

    await client.send("Page.reload", { ignoreCache: true });
    await waitFor(client, `document.body.innerText.includes("방 클리어")`, "Saved state restores after reload");
    await waitFor(client, `document.querySelector(".review-modal .ghost-button")`, "Review close button ready");
    await clickSelector(client, ".review-modal .ghost-button");
    await waitFor(client, `!document.body.innerText.includes("방 클리어")`, "Review closes");

    const roomExpectations = [
      {
        nav: "R0",
        title: "잠긴 서재",
        center: ["책장 쪽지", "출입문 키패드"],
        left: ["데스크 터미널", "명찰 묶음"],
        right: ["CRT TV", "OX 카드", "패턴 타일 박스"],
      },
      {
        nav: "R1",
        title: "신호실",
        center: ["단어 전광판", "숫자 패널"],
        left: ["OX 모니터", "라디오 장치"],
        right: ["명함 보드", "노이즈 스트립", "출입문 키패드"],
      },
      {
        nav: "R2",
        title: "기록실",
        center: ["점수 보드", "접근 로그"],
        left: ["파일 캐비닛", "손상된 명찰"],
        right: ["타임라인 보드", "아카이브 쪽지", "출입문 키패드"],
      },
      {
        nav: "R3",
        title: "위험한 계단 아래",
        center: ["논리 게이트 보드", "실험 콘솔"],
        left: ["스위치 패널", "경고 램프 보드"],
        right: ["후보 코드 보드", "후보 다이얼", "출입문 키패드"],
      },
      {
        nav: "R4",
        title: "놓친 단서 보관실",
        center: ["Missed Clues Board", "Play Style Summary", "Final Review Console"],
        left: ["Solved Route Board", "Optional Signal Shelf"],
        right: ["Saved Draft Archive", "Final Exit Door"],
      },
    ];

    for (const roomExpectation of roomExpectations) {
      await clickText(client, roomExpectation.nav);
      await waitFor(client, `document.body.innerText.includes(${JSON.stringify(roomExpectation.title)})`, `${roomExpectation.nav} loads`);
      await checkVisibleHotspots(client, roomExpectation.center, `${roomExpectation.nav} center hotspots`);
      await clickText(client, "◀");
      await checkVisibleHotspots(client, roomExpectation.left, `${roomExpectation.nav} left hotspots`);
      await clickText(client, "▶");
      await checkVisibleHotspots(client, roomExpectation.center, `${roomExpectation.nav} center hotspots after return`);
      await clickText(client, "▶");
      await checkVisibleHotspots(client, roomExpectation.right, `${roomExpectation.nav} right hotspots`);
    }

    await clickText(client, "R4");
    await waitFor(client, `document.body.innerText.includes("놓친 단서 보관실")`, "Room 4 review room loads");
    await clickText(client, "Missed Clues Board");
    await waitFor(client, `document.body.innerText.includes("Missed Hidden Clues")`, "Room 4 missed clues window opens");
    await clickSelector(client, ".game-window-review .window-close");
    await waitFor(client, `!document.body.innerText.includes("Missed Hidden Clues")`, "Room 4 missed clues window closes");

    if (browserErrors.length) {
      throw new Error(`Browser errors detected: ${browserErrors.join(" | ")}`);
    }

    console.log("PASS smoke test completed");
  } finally {
    if (client) {
      client.close();
    }
    if (browser && !browser.killed) {
      browser.kill();
      await new Promise((resolve) => {
        browser.once("exit", resolve);
        setTimeout(resolve, 1_500);
      });
    }
    await server.close();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        await fs.rm(profileDir, { recursive: true, force: true });
        break;
      } catch {
        await delay(250);
      }
    }
  }
}

run().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
