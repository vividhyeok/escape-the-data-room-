import { loadPyodide, type PyodideInterface } from "pyodide";

let pyodideReady: Promise<PyodideInterface> | null = null;

function getPyodide(): Promise<PyodideInterface> {
  if (!pyodideReady) {
    pyodideReady = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/",
    });
  }
  return pyodideReady;
}

self.onmessage = async (event: MessageEvent<{ id: number; code: string }>) => {
  const { id, code } = event.data;

  try {
    const py = await getPyodide();

    let stdout = "";
    let stderr = "";

    py.setStdout({ batched: (s: string) => { stdout += s + "\n"; } });
    py.setStderr({ batched: (s: string) => { stderr += s + "\n"; } });

    await py.runPythonAsync(code);

    self.postMessage({ id, success: true, stdout: stdout.trim(), stderr: "" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    self.postMessage({ id, success: false, stdout: "", stderr: msg });
  }
};
