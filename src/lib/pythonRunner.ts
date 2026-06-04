export type PythonExecutionResult = {
  stdout: string;
  stderr?: string;
  success: boolean;
};

export interface PythonRunner {
  run(code: string, context?: Record<string, unknown>): Promise<PythonExecutionResult>;
}

type WorkerMessage = {
  id: number;
  success: boolean;
  stdout: string;
  stderr: string;
};

class PyodideRunner implements PythonRunner {
  private worker: Worker | null = null;
  private pending = new Map<number, (result: PythonExecutionResult) => void>();
  private nextId = 0;

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(
        new URL("./pyodideWorker.ts", import.meta.url),
        { type: "module" }
      );
      this.worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const { id, success, stdout, stderr } = event.data;
        const resolve = this.pending.get(id);
        if (resolve) {
          this.pending.delete(id);
          resolve({ success, stdout, stderr: stderr || undefined });
        }
      };
    }
    return this.worker;
  }

  run(code: string, context?: Record<string, unknown>): Promise<PythonExecutionResult> {
    if (!code.trim()) {
      return Promise.resolve({ stdout: "", stderr: "코드를 입력해 주세요.", success: false });
    }

    return new Promise((resolve) => {
      const id = this.nextId++;
      this.pending.set(id, resolve);
      this.getWorker().postMessage({ id, code, context });
    });
  }
}

export const pythonRunner: PythonRunner = new PyodideRunner();
