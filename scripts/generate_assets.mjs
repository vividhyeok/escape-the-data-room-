#!/usr/bin/env node
/**
 * generate_assets.mjs — DALL-E 3 / gpt-image-1 asset generator
 *
 * Usage:
 *   node scripts/generate_assets.mjs              # generate all missing
 *   node scripts/generate_assets.mjs --force      # regenerate everything
 *   node scripts/generate_assets.mjs --only=bg    # backgrounds only
 *   node scripts/generate_assets.mjs --only=obj   # objects only
 *   node scripts/generate_assets.mjs --dry-run    # list what would be generated
 *   node scripts/generate_assets.mjs --room=1     # only room-1 assets
 *
 * Requires OPENAI_API_KEY in .env (copy from .env.example)
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ── load .env ──────────────────────────────────────────────────────
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error("❌  OPENAI_API_KEY not found in .env");
  process.exit(1);
}

// ── CLI flags ──────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FORCE       = args.includes("--force");
const DRY_RUN     = args.includes("--dry-run");
const DO_BACKUP   = args.includes("--backup");
const ONLY_BG     = args.some((a) => a === "--only=bg");
const ONLY_OBJ    = args.some((a) => a === "--only=obj");
const ROOM_FILTER = (args.find((a) => a.startsWith("--room=")) ?? "").replace("--room=", "");

// ── backup existing images ─────────────────────────────────────────
if (DO_BACKUP) {
  const imgRoot = path.join(ROOT, "public/assets/images");
  const backupRoot = path.join(ROOT, "public/assets/images/_backup");
  if (!fs.existsSync(backupRoot)) fs.mkdirSync(backupRoot, { recursive: true });
  let backed = 0;
  function backupDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "_backup") {
        backupDir(full);
      } else if (entry.isFile() && /\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
        const rel = path.relative(imgRoot, full);
        const dest = path.join(backupRoot, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(full, dest);
        backed++;
      }
    }
  }
  backupDir(imgRoot);
  console.log(`🗂  Backed up ${backed} existing images → public/assets/images/_backup/`);
}

// ── common style fragments ─────────────────────────────────────────
// Segment images are 1536×1024 each; three are stitched into a 4608×1024 panorama.
// Each segment is a NORMAL flat interior view — NOT fisheye, NOT spherical.
// Adjacent segments share matching floor, ceiling, lighting, color palette and wall materials.
const BG_STYLE =
  "Orthogonal flat 2D plane view of a single wall directly facing the camera, perfectly straight. NO wall corners visible within the image, NO floor corners visible. The image must look like a flat texture tile of a wall. Semi-realistic 3D escape room game art, stylized but grounded, muted cinematic lighting, large empty wall surfaces for overlaid interactive objects. No text, no letters, no numbers, no UI, no people, no characters, no logos, no watermark.";

const OBJ_STYLE =
  "Single object only, perfectly flat orthographic front view, absolutely no perspective skew, completely transparent background, centered, clear silhouette, game asset sprite, no cast shadow, no text, no labels, no numbers, no UI, no people, no logos, no watermark.";

const BG_NEG =
  "Avoid clutter, tiny props, readable text, signs, letters, numbers, humans, characters, posters with writing, monitors with text, realistic photo noise, horror gore, excessive darkness, heavy fog, complex cables everywhere, busy shelves, UI panels.";

// ── asset list ─────────────────────────────────────────────────────
// type: "pano" → 1 panoramic image (1792×1024) per room
// type: "obj"  → 1024×1024 transparent sprite

/** @type {Array<{type:"bg", output:string, segments:[{output:string,prompt:string},{output:string,prompt:string},{output:string,prompt:string}]}|{type:"obj",output:string,prompt:string}>} */

const ASSETS = [
  { type: "pano", output: "public/assets/images/backgrounds/room-0/pano.png", prompt: "A seamless wide panoramic interior view of a warm amber plaster study room. Bare wooden floorboards, low dark wooden cabinets and bookshelves along the walls, a wooden exit door on one side. The room curves seamlessly, semi-realistic 3D escape room game art, stylized but grounded, muted cinematic lighting, large empty wall surfaces for overlaid interactive objects. No text, no UI, no people." },
  { type: "pano", output: "public/assets/images/backgrounds/room-1/pano.png", prompt: "A seamless wide panoramic interior view of a dark teal concrete signal room. Bare teal-painted floor, empty monitor brackets, a narrow exit door on one side, faint cyan grid patterns on the main wall. The room curves seamlessly, semi-realistic 3D escape room game art, stylized but grounded, muted cinematic lighting, large empty wall surfaces. No text, no UI, no people." },
  { type: "pano", output: "public/assets/images/backgrounds/room-2/pano.png", prompt: "A seamless wide panoramic interior view of a muted sage-green archive room. Concrete floor, tall metal filing cabinets, empty cork-board surfaces, a plain metal door on one side. The room curves seamlessly, semi-realistic 3D escape room game art, stylized but grounded, muted cinematic lighting, large empty wall surfaces. No text, no UI, no people." },
  { type: "pano", output: "public/assets/images/backgrounds/room-3/pano.png", prompt: "A seamless wide panoramic interior view of a deep indigo-purple control room. Concrete floor with faint yellow safety stripes, underside of a staircase soffit, dense instrument panels without text, a heavy steel exit hatch on one side. The room curves seamlessly, semi-realistic 3D escape room game art, stylized but grounded, muted cinematic lighting, large empty wall surfaces. No text, no UI, no people." }
];

// Append objects to ASSETS
ASSETS.push(...[
  { type: "obj", output: "public/assets/images/objects/room-0/crt-tv.png", prompt: `Old small CRT television used as a tutorial clue object, slightly chunky silhouette, dark glass screen with faint green glow but no visible text or numbers, retro study room mood, readable clickable game sprite. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-0/desk-terminal.png", prompt: `Compact desk terminal computer for a beginner Python lab escape room, small keyboard, dark blank screen with subtle cyan glow, retro-modern style, clean silhouette, no visible text. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-0/mini-ox-card.png", prompt: `Worn physical paper card resting flat, slightly curled edges, faded printed circles and crosses in two columns (signal marks), aged yellowed paper with subtle texture and a tiny torn corner, escape room prop, tangible real object not a graphic. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-0/name-tags-bundle.png", prompt: `A bundle of blank name tags tied with a small band, several cards overlapping, no readable writing, educational data clue object, warm study room colors. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-0/pattern-tile-box.png", prompt: `Small open box containing simple geometric tiles, triangle square circle shapes as abstract icons without labels, tutorial pattern clue object, warm muted colors. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-0/bookshelf-note.png", prompt: `Small folded note sticking out of a book, blank paper surface with no readable text, warm mysterious tutorial clue object. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/shared/door-keypad.png", prompt: `Wall mounted escape room keypad device with a dark blank display and simple unmarked button grid, no visible digits or letters, sturdy sci-fi classroom style, amber indicator light. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-1/word-billboard.png", prompt: `Large electronic word billboard object for a signal room, blank segmented display panels with cyan glow, no readable words or letters, a five-slot indicator shape suggested without symbols, clean clickable sprite. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-1/ox-monitor.png", prompt: `Signal monitor object showing abstract rows of small glowing dots and blocks, no actual letters or numbers, dark teal casing, classroom-safe sci-fi style, strong rectangular silhouette. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-1/number-panel.png", prompt: `Electronic number panel clue object with many blank glowing tile cells, no readable digits, cyan and amber lights, clean sci-fi signal room style, strong clickable shape. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-1/name-card-board.png", prompt: `Wall board with many blank name cards pinned in rows, no readable names, muted paper cards on dark board, signal room clue object, clear rectangular silhouette. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-1/radio-signal-device.png", prompt: `Small hidden radio signal device, compact receiver with dial, antenna, faint violet glow, looks optional and mysterious, no station numbers or labels. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-1/noise-strip.png", prompt: `Thin glowing strip device with alternating abstract blocks, hidden signal clue, slim horizontal shape, violet and amber glow, no readable characters or numbers. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-2/file-cabinet.png", prompt: `Archive file cabinet clue object, slightly open drawers with blank folders visible, muted green-gray metal, no labels or text, readable silhouette for a records room escape game. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-2/broken-name-tags.png", prompt: `Scattered blank name tags and ID cards with torn corners, no readable text, muted paper and plastic material, data cleaning clue object. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-2/score-board.png", prompt: `Blank score board or record board with two clean columns implied by empty panels, no readable text or numbers, archive room style, muted green and amber accent lights. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-2/timeline-board.png", prompt: `Timeline board clue object with a horizontal line and blank event cards, no readable text, no numbers, muted archive room colors, strong rectangular silhouette. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-2/access-log-table.png", prompt: `Hidden access log table object, small metal clipboard or tablet with blank rows, faint green glow, no readable text, optional clue feeling. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-2/archive-note.png", prompt: `Small hidden archive note tucked into a folder, blank paper with folded edge, warm amber glow, optional clue object, no readable writing. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-3/dangerous-stair-marker.png", prompt: `Ominous stair entrance marker for an optional challenge, dark metal stair sign shape without text, violet rim light, classroom-safe mysterious mood. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-3/switch-panel.png", prompt: `Control room switch panel with six unmarked toggle switches, no labels or numbers, dark metal casing, amber warning lights, clear interactive game sprite. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-3/logic-gate-board.png", prompt: `Abstract logic gate board object with simple glowing circuit lines and blank nodes, no actual symbols, no text, dark blue-violet control room style, rectangular clear silhouette. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-3/candidate-codes-board.png", prompt: `Candidate code board with blank small code tiles, no readable digits, dark console board, cyan and orange glow, optional challenge game asset. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-3/experiment-console.png", prompt: `Experiment console device for validating candidate codes, compact lab console with SOLID OPAQUE BLACK blank screen (DO NOT make the screen transparent) and a few unmarked buttons, violet-blue glow, no text or numbers. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-3/warning-lamp-board.png", prompt: `Warning lamp board with several colored indicator lights, no labels, no text, dark metal backing, looks like a hidden optional control clue. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-3/candidate-dial.png", prompt: `Mechanical candidate dial device, circular selector with blank tick marks, no readable numbers, violet and amber lighting, optional challenge clue. ${OBJ_STYLE}` },
  { type: "obj", output: "public/assets/images/objects/room-3/finish-console.png", prompt: `Small finish console for ending the optional challenge, dark panel with a glowing safe exit indicator, no text, no labels, no numbers, game-like but not scary. ${OBJ_STYLE}` }
]);


// ── helpers ────────────────────────────────────────────────────────
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    ensureDir(dest);
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callOpenAI(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: "api.openai.com",
        path: "/v1/images/generations",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) reject(new Error(parsed.error.message));
            else resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── stitch 3 segment images into one wide panorama ─────────────────

// ── main ───────────────────────────────────────────────────────────
// Expand assets for generation tracking
/** @type {Array<{type:"pano"|"obj", output:string, prompt:string}>} */
const flatAssets = [];
for (const asset of ASSETS) {
  flatAssets.push(asset);
}

const filtered = flatAssets.filter((a) => {
  if (ONLY_BG && a.type !== "seg") return false;
  if (ONLY_OBJ && a.type !== "obj") return false;
  if (ROOM_FILTER) {
    const rMatch = a.output.match(/room-(\d)/);
    if (!rMatch || rMatch[1] !== ROOM_FILTER) return false;
  }
  return true;
});

const todo = FORCE ? filtered : filtered.filter((a) => !fs.existsSync(path.join(ROOT, a.output)));

// Which bg panoramas need stitching after generation?
const panoCount = todo.filter((a) => a.type === "pano").length;
const objCount = todo.filter((a) => a.type === "obj").length;

console.log(`\n📦  Escape the Data Room — Asset Generator`);
console.log(`    Panoramas: ${panoCount}  |  Objects: ${objCount}  `);
if (FORCE) console.log("    ⚠️  --force: regenerating all");
if (DRY_RUN) {
  console.log("\n── Dry run ──");
  for (const a of todo) console.log(`  [${a.type}] ${a.output}`);
  console.log();
  process.exit(0);
}
if (todo.length === 0) {
  console.log("    ✅  All assets ready. Use --force to regenerate.\n");
  process.exit(0);
}

// Cost estimate: only pano + obj images cost money
const estimatedUSD = panoCount * 0.08 + objCount * 0.04;
console.log(`\n    💰  Estimated cost: ~$${estimatedUSD.toFixed(2)} USD`);
console.log(`       (${panoCount} panos × ~$0.08 + ${objCount} objects × ~$0.04)\n`);

let done = 0;
let failed = 0;

for (let i = 0; i < todo.length; i++) {
  const asset  = todo[i];
  const outAbs = path.join(ROOT, asset.output);
  const label  = asset.output.replace("public/", "");
  const isPano = asset.type === "pano";

  process.stdout.write(`  [${i + 1}/${todo.length}] ${label} … `);

  try {
    const payload = {
      model: "gpt-image-1",
      prompt: asset.prompt,
      n: 1,
      size: isPano ? "1536x1024" : "1024x1024",
      quality: "medium",
      ...(isPano ? {} : { background: "transparent" }),
    };

    const result = await callOpenAI(payload);

    if (result.data?.[0]?.b64_json) {
      ensureDir(outAbs);
      fs.writeFileSync(outAbs, Buffer.from(result.data[0].b64_json, "base64"));
    } else if (result.data?.[0]?.url) {
      await downloadFile(result.data[0].url, outAbs);
    } else {
      throw new Error(`No image data in response: ${JSON.stringify(result).slice(0, 200)}`);
    }

    console.log("✅");
    done++;
    await sleep(6500);
  } catch (err) {
    console.log(`❌  ${err.message}`);
    failed++;
    await sleep(2000);
  }
}


console.log(`\n── Done ──`);
console.log(`  Generated: ${done}  |  Failed: ${failed}`);
if (failed > 0) console.log("  Re-run without --force to retry only failed assets.\n");
else console.log("  All assets ready. Run `npm run dev` to see them in game.\n");
