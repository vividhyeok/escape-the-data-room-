import { puzzlesById } from "../data/puzzles";

export type PythonExecutionResult = {
  stdout: string;
  stderr?: string;
  success: boolean;
};

export interface PythonRunner {
  run(code: string, context?: Record<string, unknown>): Promise<PythonExecutionResult>;
}

export class MockPythonRunner implements PythonRunner {
  async run(code: string, context?: Record<string, unknown>): Promise<PythonExecutionResult> {
    const puzzleId = typeof context?.puzzleId === "string" ? context.puzzleId : undefined;
    const puzzle = puzzleId ? puzzlesById[puzzleId] : undefined;

    if (!code.trim()) {
      return {
        stdout: "",
        stderr: "No code draft found.",
        success: false,
      };
    }

    return {
      stdout: puzzle?.mockOutput ?? "Mock execution complete.",
      success: true,
    };
  }
}

export const pythonRunner: PythonRunner = new MockPythonRunner();

