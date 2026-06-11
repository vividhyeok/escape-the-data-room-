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

self.onmessage = async (event: MessageEvent<{ id: number; code: string; context?: any }>) => {
  const { id, code, context } = event.data;

  try {
    const py = await getPyodide();

    let stdout = "";
    let stderr = "";
    py.setStdout({ batched: (s: string) => { stdout += s + "\n"; } });
    py.setStderr({ batched: (s: string) => { stderr += s + "\n"; } });

    // If context is provided with test cases, we run the evaluation logic
    if (context && context.testCases) {
      const evalScript = `
import ast
import traceback
import json
import io
import contextlib

def evaluate_puzzle(user_code, required_syntax_json, banned_syntax_json, test_cases_json):
    required_syntax = json.loads(required_syntax_json)
    banned_syntax = json.loads(banned_syntax_json)
    test_cases = json.loads(test_cases_json)
    
    try:
        tree = ast.parse(user_code)
    except SyntaxError as e:
        return json.dumps({"success": False, "error": f"문법 오류 (Syntax Error): {e}"})
        
    class NodeVisitor(ast.NodeVisitor):
        def __init__(self):
            self.nodes = []
            self.funcs = []
        def generic_visit(self, node):
            self.nodes.append(type(node).__name__)
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    self.funcs.append(node.func.id)
                elif isinstance(node.func, ast.Attribute):
                    self.funcs.append(node.func.attr)
            super().generic_visit(node)
            
    visitor = NodeVisitor()
    visitor.visit(tree)
    
    for req in required_syntax:
        if req not in visitor.nodes and req not in visitor.funcs:
            return json.dumps({"success": False, "error": f"필수 문법 누락: '{req}' 를 사용해야 합니다."})
            
    for ban in banned_syntax:
        if ban in visitor.nodes or ban in visitor.funcs:
            return json.dumps({"success": False, "error": f"금지된 문법 사용: '{ban}' 은(는) 사용할 수 없습니다."})
            
    for i, tc in enumerate(test_cases):
        input_code = tc.get("inputCode", "")
        expected = tc.get("expectedOutput", None)
        expected_str = str(expected)

        env = {}
        buf = io.StringIO()
        try:
            exec(input_code, env)
            with contextlib.redirect_stdout(buf):
                exec(user_code, env)
        except Exception as e:
            return json.dumps({"success": False, "error": f"실행 에러:\\n{traceback.format_exc()}"})

        out = buf.getvalue().strip()

        # 1순위: print() 출력(stdout)으로 채점
        if out != "":
            if out != expected_str:
                return json.dumps({"success": False, "error": f"출력이 예시와 다릅니다.\\n  입력: {input_code}\\n  기대 출력: {expected_str}\\n  실제 출력: {out}"})
        # 2순위(보조): answer 변수에 저장한 경우도 인정
        elif "answer" in env:
            if env["answer"] != expected:
                return json.dumps({"success": False, "error": f"결과가 예시와 다릅니다. (기대: {expected_str}, 실제: {env['answer']})"})
        else:
            return json.dumps({"success": False, "error": "출력이 없습니다. print() 로 결과를 출력해 주세요."})

    return json.dumps({"success": True, "error": ""})
`;
      await py.runPythonAsync(evalScript);
      const evalFunc = py.globals.get('evaluate_puzzle');
      
      const reqJson = JSON.stringify(context.requiredSyntax || []);
      const banJson = JSON.stringify(context.bannedSyntax || []);
      const testJson = JSON.stringify(context.testCases || []);
      
      const resultStr = evalFunc(code, reqJson, banJson, testJson);
      const result = JSON.parse(resultStr);
      
      if (result.success) {
        self.postMessage({ id, success: true, stdout: stdout.trim(), stderr: "" });
      } else {
        self.postMessage({ id, success: false, stdout: stdout.trim(), stderr: result.error });
      }
    } else {
      // Normal execution without test cases
      await py.runPythonAsync(code);
      self.postMessage({ id, success: true, stdout: stdout.trim(), stderr: "" });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    self.postMessage({ id, success: false, stdout: "", stderr: msg });
  }
};
