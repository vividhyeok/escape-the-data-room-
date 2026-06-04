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
        
        env = {}
        try:
            exec(input_code, env)
            exec(user_code, env)
        except Exception as e:
            return json.dumps({"success": False, "error": f"실행 에러:\\n{traceback.format_exc()}"})
            
        if "answer" not in env:
            return json.dumps({"success": False, "error": "정답 변수 누락: 'answer' 라는 이름의 변수에 최종 결과를 저장해 주세요."})
            
        if env["answer"] != expected:
            return json.dumps({"success": False, "error": f"오답: 'answer' 값이 기대한 결과와 다릅니다. (기대값: {expected}, 실제값: {env['answer']})"})
            
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
