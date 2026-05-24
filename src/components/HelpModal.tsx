import { useState } from "react";
import { GameWindow } from "./GameWindow";

type HelpModalProps = {
  onClose: () => void;
};

type RefItem = {
  keyword: string;
  code: string;
  desc: string;
  tags: string[];
};

type RefCategory = {
  id: string;
  title: string;
  icon: string;
  items: RefItem[];
};

function item(keyword: string, code: string, desc: string, ...tags: string[]): RefItem {
  return { keyword, code, desc, tags };
}

const REFERENCE: RefCategory[] = [
  {
    id: "basics",
    title: "기본 문법",
    icon: "◉",
    items: [
      item("변수 할당", 'x = 10\nname = "Alice"', "변수에 값 저장하기", "variable", "assign"),
      item("print()", 'print("hello")\nprint(x, name)\nprint(a, b, sep=", ")', "값 출력하기", "print", "output"),
      item("# 주석", "# 이 줄은 실행되지 않는다", "코드 설명 달기", "comment"),
      item("type()", "type(42)    # <class 'int'>\ntype('hi')  # <class 'str'>", "자료형 확인하기", "type"),
    ],
  },
  {
    id: "conversion",
    title: "형 변환",
    icon: "⇄",
    items: [
      item("int()", 'int("42")  # 42\nint(3.9)   # 3', "문자열·실수를 정수로 변환", "int", "convert"),
      item("str()", "str(42)    # '42'\nstr(3.14)  # '3.14'", "숫자를 문자열로 변환", "str", "convert"),
      item("float()", 'float("3.14")  # 3.14\nfloat(5)       # 5.0', "문자열·정수를 실수로 변환", "float", "convert"),
      item("bool()", "bool(0)   # False\nbool(1)   # True\nbool('')  # False", "참/거짓으로 변환", "bool", "convert"),
      item("list()", 'list("abc")     # ["a","b","c"]\nlist(range(3))  # [0,1,2]\nlist({1,2,3})   # 순서 불일정', "다른 자료형을 리스트로 변환", "list", "convert"),
    ],
  },
  {
    id: "string",
    title: "문자열",
    icon: "Aa",
    items: [
      item("인덱싱", 's = "hello"\ns[0]   # "h"\ns[-1]  # "o"', "특정 위치의 문자 가져오기", "string", "index"),
      item("슬라이싱", 's = "hello"\ns[1:4]  # "ell"\ns[:3]   # "hel"\ns[2:]   # "llo"', "문자열 일부 자르기", "string", "slice"),
      item("len()", 'len("hello")  # 5', "문자열 길이 구하기", "len", "string"),
      item(".split()", '"a b c".split()     # ["a","b","c"]\n"1,2,3".split(",")  # ["1","2","3"]', "구분자 기준으로 문자열 나누기", "split", "string"),
      item(".join()", '", ".join(["a","b","c"])  # "a, b, c"', "리스트 원소를 문자열로 합치기", "join", "string"),
      item(".strip()", '"  hi  ".strip()       # "hi"\n"xxhixx".strip("x")  # "hi"', "앞뒤 공백·문자 제거하기", "strip", "string"),
      item(".upper() / .lower()", '"hello".upper()  # "HELLO"\n"HELLO".lower()  # "hello"', "대소문자 변환하기", "upper", "lower", "string"),
      item(".replace()", '"hello".replace("l","r")  # "herro"', "특정 문자열을 다른 값으로 교체하기", "replace", "string"),
      item(".count()", '"banana".count("a")  # 3', "특정 문자·부분 문자열 개수 세기", "count", "string"),
      item(".startswith() / .endswith()", '"hello".startswith("he")  # True\n"hello".endswith("lo")   # True', "특정 문자로 시작·끝나는지 확인하기", "startswith", "endswith", "string"),
      item(".find()", '"hello".find("ll")  # 2\n"hello".find("x")   # -1', "부분 문자열 위치 찾기 (없으면 -1)", "find", "string"),
      item("in / not in", '"ll" in "hello"    # True\n"x" not in "hi"  # True', "문자열 포함 여부 확인하기", "in", "not in", "string"),
      item("f-string", 'name = "Alice"\nf"Hello, {name}!"  # "Hello, Alice!"\nf"x={x:.2f}"  # 소수점 2자리', "변수를 문자열 안에 삽입하기", "fstring", "format", "string"),
      item(".splitlines()", '"a\\nb\\nc".splitlines()  # ["a","b","c"]', "줄바꿈 기준으로 문자열 나누기", "splitlines", "string"),
      item(".strip().splitlines()", 'data.strip().splitlines()\n# 앞뒤 빈 줄 제거 후 줄 분리', "여러 줄 데이터 파싱의 표준 패턴", "strip", "splitlines", "string"),
    ],
  },
  {
    id: "list",
    title: "리스트",
    icon: "[ ]",
    items: [
      item("리스트 생성", 'nums = [1, 2, 3]\nnames = ["Alice", "Bob"]\nempty = []', "리스트 만들기", "list", "create"),
      item("인덱싱", "nums = [10, 20, 30]\nnums[0]   # 10\nnums[-1]  # 30 (마지막)", "특정 위치의 값 가져오기", "list", "index"),
      item("슬라이싱", "nums = [1,2,3,4,5]\nnums[1:3]  # [2, 3]\nnums[:2]   # [1, 2]\nnums[2:]   # [3, 4, 5]", "리스트 일부 가져오기", "list", "slice"),
      item(".append()", "nums = [1, 2]\nnums.append(3)  # [1, 2, 3]", "리스트 끝에 값 추가하기", "append", "list"),
      item(".extend()", "nums = [1, 2]\nnums.extend([3, 4])  # [1, 2, 3, 4]", "리스트에 다른 리스트 이어붙이기", "extend", "list"),
      item(".remove()", "nums = [1, 2, 3, 2]\nnums.remove(2)  # [1, 3, 2] (첫 번째만)", "특정 값을 리스트에서 제거하기", "remove", "list"),
      item(".pop()", "nums = [1, 2, 3]\nnums.pop()     # 3 반환, 리스트는 [1,2]\nnums.pop(0)    # 1 반환, 리스트는 [2]", "특정 위치의 값을 꺼내어 반환하기", "pop", "list"),
      item("len()", "len([1, 2, 3])  # 3", "리스트 길이 구하기", "len", "list"),
      item(".sort()", "nums = [3, 1, 2]\nnums.sort()               # [1, 2, 3]\nnums.sort(reverse=True)  # [3, 2, 1]", "리스트를 제자리에서 정렬하기 (원본 변경)", "sort", "list"),
      item("sorted()", "sorted([3, 1, 2])               # [1, 2, 3]\nsorted([3, 1], reverse=True)  # [3, 1]", "정렬된 새 리스트 반환하기 (원본 유지)", "sorted", "list"),
      item(".reverse()", "nums = [1, 2, 3]\nnums.reverse()  # [3, 2, 1]", "리스트를 제자리에서 뒤집기", "reverse", "list"),
      item(".count()", "[1, 2, 2, 3].count(2)  # 2", "특정 값이 리스트에 몇 번 나오는지 세기", "count", "list"),
      item(".index()", "[10, 20, 30].index(20)  # 1", "특정 값의 위치(인덱스) 찾기", "index", "list"),
      item("in 연산자", "3 in [1, 2, 3]     # True\n5 not in [1, 2]  # True", "리스트에 특정 값이 있는지 확인하기", "in", "list"),
    ],
  },
  {
    id: "dict",
    title: "딕셔너리",
    icon: "{ }",
    items: [
      item("딕셔너리 생성", 'd = {"a": 1, "b": 2}\nd2 = dict(x=1, y=2)', "키-값 쌍으로 데이터 저장하기", "dict", "create"),
      item("값 접근", 'd = {"name": "Alice"}\nd["name"]  # "Alice"', "키로 값 가져오기", "dict", "access"),
      item(".get()", 'd = {"a": 1}\nd.get("a")       # 1\nd.get("z", 0)   # 0 (기본값)', "키로 값 가져오기 (없으면 기본값 반환)", "get", "dict"),
      item("키 확인 (in)", '"a" in {"a": 1}  # True\n"z" not in {"a": 1}  # True', "키가 딕셔너리에 있는지 확인하기", "in", "dict"),
      item(".keys() / .values()", 'd = {"a":1,"b":2}\nlist(d.keys())    # ["a","b"]\nlist(d.values())  # [1, 2]', "모든 키·값 목록 가져오기", "keys", "values", "dict"),
      item(".items()", 'd = {"a":1,"b":2}\nfor k, v in d.items():\n    print(k, v)', "키-값 쌍을 함께 순회하기", "items", "dict"),
      item("값 추가·수정", 'd = {}\nd["x"] = 10  # 추가\nd["x"] = 20  # 덮어쓰기', "키-값 쌍 추가 또는 수정하기", "dict", "add", "update"),
    ],
  },
  {
    id: "set",
    title: "집합",
    icon: "∅",
    items: [
      item("집합 생성", 's = {1, 2, 3}\ns2 = set([1, 1, 2])  # {1, 2}', "중복 없는 값 모음 만들기", "set", "create"),
      item("중복 제거", 'names = ["A","B","A","C"]\nunique = set(names)  # {"A","B","C"}\ncount = len(unique)  # 3', "리스트에서 중복 값 제거하기", "set", "unique", "duplicate"),
      item(".add() / .remove()", "s = {1, 2}\ns.add(3)     # {1, 2, 3}\ns.remove(1)  # {2, 3}", "집합에 값 추가·제거하기", "add", "remove", "set"),
      item("in 연산자", "3 in {1, 2, 3}  # True", "집합에 특정 값이 있는지 확인하기", "in", "set"),
      item("집합 연산", "{1,2,3} & {2,3,4}  # {2, 3}  교집합\n{1,2} | {2,3}    # {1,2,3}  합집합\n{1,2,3} - {2}    # {1, 3}  차집합", "교집합(&), 합집합(|), 차집합(-)", "set", "union", "intersection", "difference"),
    ],
  },
  {
    id: "condition",
    title: "조건문",
    icon: "if",
    items: [
      item("if / elif / else", "if x > 10:\n    print('크다')\nelif x > 5:\n    print('중간')\nelse:\n    print('작다')", "조건에 따라 다른 코드 실행하기", "if", "elif", "else", "condition"),
      item("비교 연산자", "x == y   # 같다\nx != y   # 다르다\nx > y    # 크다\nx < y    # 작다\nx >= y   # 크거나 같다\nx <= y   # 작거나 같다", "두 값 비교하기", "comparison", "operator"),
      item("논리 연산자", "x > 0 and x < 10  # 둘 다 참\nx < 0 or x > 10  # 하나라도 참\nnot (x == 0)     # 참이면 거짓", "조건 여러 개를 결합하기", "and", "or", "not", "logical"),
      item("in / not in", "'a' in 'abc'     # True\n3 not in [1,2]  # True\n'x' in {'x':1}  # True", "포함 여부 확인하기", "in", "not in", "condition"),
      item("% 나머지 연산", "n % 2 == 0  # 짝수\nn % 2 == 1  # 홀수\nn % 3 == 0  # 3의 배수\nn % 10      # 마지막 자리 수", "나머지 연산으로 배수·짝홀 판별하기", "modulo", "even", "odd", "percent"),
      item("비트 연산자", "a & b   # AND (둘 다 1이면 1)\na | b   # OR (하나라도 1이면 1)\na ^ b   # XOR (다를 때만 1)", "비트 단위 AND/OR/XOR", "bit", "and", "or", "xor"),
    ],
  },
  {
    id: "loop",
    title: "반복문",
    icon: "∞",
    items: [
      item("for 반복문", "for item in [1, 2, 3]:\n    print(item)", "리스트의 각 원소를 순서대로 처리하기", "for", "loop"),
      item("range()", "for i in range(5):         # 0,1,2,3,4\nfor i in range(1, 6):      # 1,2,3,4,5\nfor i in range(0, 10, 2):  # 0,2,4,6,8", "지정 범위 반복하기 (시작, 끝, 간격)", "range", "for", "loop"),
      item("while 반복문", "i = 0\nwhile i < 5:\n    print(i)\n    i += 1", "조건이 참인 동안 반복하기", "while", "loop"),
      item("break / continue", "for i in range(10):\n    if i == 5:\n        break     # 반복 완전 종료\n    if i % 2 == 0:\n        continue  # 이번 회차 건너뜀\n    print(i)", "반복 중단 또는 현재 회차 건너뛰기", "break", "continue", "loop"),
      item("enumerate()", "for i, v in enumerate(['a','b','c']):\n    print(i, v)  # 0 a, 1 b, 2 c", "인덱스와 값을 함께 순회하기", "enumerate", "loop"),
      item("zip()", "names = ['Alice', 'Bob']\nscores = [90, 80]\nfor n, s in zip(names, scores):\n    print(n, s)", "두 리스트를 동시에 순회하기", "zip", "loop"),
      item("중첩 반복문", "for i in range(3):\n    for j in range(3):\n        print(i, j)", "반복문 안에 반복문 중첩하기", "nested", "loop"),
      item("리스트 컴프리헨션", "nums = [1,2,3,4,5]\nevens = [x for x in nums if x%2==0]\nsquares = [x**2 for x in range(5)]", "반복·조건을 한 줄로 리스트 만들기", "list comprehension", "loop"),
    ],
  },
  {
    id: "function",
    title: "함수",
    icon: "ƒ",
    items: [
      item("함수 정의 (def)", "def greet(name):\n    return 'Hello, ' + name\n\nresult = greet('Alice')  # 'Hello, Alice'", "재사용 가능한 코드 블록 만들기", "def", "function"),
      item("return", "def add(a, b):\n    return a + b\n\nresult = add(3, 4)  # 7", "함수의 결과값 반환하기", "return", "function"),
      item("기본값 매개변수", "def power(base, exp=2):\n    return base ** exp\n\npower(3)     # 9\npower(2, 3)  # 8", "호출 시 생략 가능한 매개변수 설정하기", "default", "parameter", "function"),
      item("여러 값 반환", "def min_max(nums):\n    return min(nums), max(nums)\n\nlo, hi = min_max([3,1,4])\nprint(lo, hi)  # 1 4", "튜플로 여러 값 한 번에 반환하기", "return", "tuple", "function"),
    ],
  },
  {
    id: "builtin",
    title: "내장 함수",
    icon: "⌁",
    items: [
      item("sum()", "sum([1, 2, 3, 4])           # 10\nsum(x**2 for x in range(4)) # 14", "숫자 모음의 합계 구하기", "sum", "builtin"),
      item("min() / max()", "min([3, 1, 4, 1])  # 1\nmax([3, 1, 4])    # 4\nmin(3, 1, 4)      # 1", "최솟값·최댓값 찾기", "min", "max", "builtin"),
      item("abs()", "abs(-5)   # 5\nabs(3.7)  # 3.7", "절댓값 구하기", "abs", "builtin"),
      item("sorted()", "sorted([3,1,2])               # [1,2,3]\nsorted([3,1,2], reverse=True) # [3,2,1]\nsorted(['b','a'])             # ['a','b']", "정렬된 새 리스트 반환하기", "sorted", "builtin"),
      item("reversed()", "list(reversed([1,2,3]))  # [3,2,1]", "순서가 뒤집힌 반복자 반환하기", "reversed", "builtin"),
      item("enumerate()", "list(enumerate(['a','b']))  # [(0,'a'),(1,'b')]", "인덱스와 값 쌍 만들기", "enumerate", "builtin"),
      item("zip()", "list(zip([1,2],[3,4]))  # [(1,3),(2,4)]", "여러 리스트를 묶어 쌍으로 만들기", "zip", "builtin"),
      item("range()", "list(range(5))        # [0,1,2,3,4]\nlist(range(2,6))      # [2,3,4,5]\nlist(range(0,10,2))   # [0,2,4,6,8]", "숫자 범위 생성하기", "range", "builtin"),
      item("len()", "len([1,2,3])    # 3\nlen('hello')   # 5\nlen({'a':1})   # 1", "길이·개수 구하기", "len", "builtin"),
      item("print() 옵션", 'print(a, b, sep=", ")   # 구분자 지정\nprint("end", end="")   # 줄바꿈 없이\nprint(f"{x:.2f}")     # 소수점 2자리', "출력 형식 조정하기", "print", "sep", "end", "format"),
      item("any() / all()", "any([False, True, False])  # True\nall([True, True, True])    # True\nall([True, False])         # False", "하나라도·모두 참인지 확인하기", "any", "all", "builtin"),
      item("round()", "round(3.14159, 2)  # 3.14\nround(2.5)         # 2 (Python 반올림)", "반올림하기", "round", "builtin"),
    ],
  },
  {
    id: "operators",
    title: "연산자",
    icon: "±",
    items: [
      item("산술 연산자", "3 + 4    # 7\n10 - 3   # 7\n3 * 4    # 12\n10 / 3   # 3.333...\n10 // 3  # 3  (몫)\n10 % 3   # 1  (나머지)\n2 ** 3   # 8  (거듭제곱)", "사칙연산 및 나머지·거듭제곱", "arithmetic", "operator"),
      item("복합 대입 연산자", "x += 5    # x = x + 5\nx -= 2    # x = x - 2\nx *= 3    # x = x * 3\nx //= 2   # x = x // 2\nx **= 2   # x = x ** 2", "계산 결과를 바로 변수에 저장하기", "compound", "operator"),
    ],
  },
  {
    id: "tuple",
    title: "튜플",
    icon: "( )",
    items: [
      item("튜플 생성", "t = (1, 2, 3)\nt2 = 1, 2, 3   # 괄호 생략 가능", "변경 불가능한 순서 모음 만들기", "tuple", "create"),
      item("튜플 언패킹", "a, b = (1, 2)\nx, y, z = (10, 20, 30)\nfirst, *rest = (1, 2, 3, 4)  # rest=[2,3,4]", "튜플의 값을 여러 변수로 한 번에 받기", "tuple", "unpack"),
      item("인덱싱", "t = (10, 20, 30)\nt[0]   # 10\nt[-1]  # 30", "특정 위치의 값 가져오기", "tuple", "index"),
    ],
  },
];

function normalize(s: string): string {
  return s.toLowerCase();
}

function matchesSearch(item: RefItem, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  return (
    normalize(item.keyword).includes(q) ||
    normalize(item.code).includes(q) ||
    normalize(item.desc).includes(q) ||
    item.tags.some((tag) => normalize(tag).includes(q))
  );
}

export function HelpModal({ onClose }: HelpModalProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string>("string");

  const isFiltering = query.trim().length > 0;

  function toggleCategory(id: string): void {
    setOpenCategory((prev) => (prev === id ? "" : id));
  }

  return (
    <GameWindow id="python-reference" type="reference" eyebrow="PYTHON REFERENCE" title="문법 참조" onClose={onClose}>
      <div className="help-modal">
        <div className="ref-search-bar">
          <span className="ref-search-icon">⌕</span>
          <input
            aria-label="Search reference"
            className="ref-search-input"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="키워드 검색 (예: split, for, dict…)"
            type="text"
            value={query}
          />
          {query ? (
            <button className="ref-search-clear" onClick={() => setQuery("")} type="button">
              ✕
            </button>
          ) : null}
        </div>

        <div className="ref-categories">
          {REFERENCE.map((cat) => {
            const filtered = isFiltering ? cat.items.filter((it) => matchesSearch(it, query)) : cat.items;
            if (isFiltering && filtered.length === 0) return null;
            const isOpen = isFiltering || openCategory === cat.id;

            return (
              <div className="ref-category" key={cat.id}>
                <button
                  className={`ref-cat-header ${isOpen ? "open" : ""}`}
                  onClick={() => toggleCategory(cat.id)}
                  type="button"
                >
                  <span className="ref-cat-icon">{cat.icon}</span>
                  <span className="ref-cat-title">{cat.title}</span>
                  <span className="ref-cat-count">{filtered.length}</span>
                  {!isFiltering && <span className="ref-cat-chevron">{isOpen ? "▲" : "▼"}</span>}
                </button>

                {isOpen && (
                  <div className="ref-items">
                    {filtered.map((refItem, index) => (
                      <article className="ref-item" key={`${cat.id}-${index}`}>
                        <div className="ref-item-header">
                          <code className="ref-keyword">{refItem.keyword}</code>
                        </div>
                        <pre className="ref-code">{refItem.code}</pre>
                        <p className="ref-desc">{refItem.desc}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </GameWindow>
  );
}
