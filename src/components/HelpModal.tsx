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
      item("변수 할당 (=)", 'x = 10\nname = "Alice"', "데이터를 저장하는 상자 만들기", "variable", "assign"),
      item("print()", 'print("hello")\nprint(x, name)', "화면에 결과 보여주기", "print", "output"),
      item("# 주석", "# 이 줄은 컴퓨터가 무시해요", "코드에 메모 남기기", "comment"),
      item("type()", "type(42)", "이 데이터가 숫자인지 문자인지 확인", "type"),
    ],
  },
  {
    id: "conversion",
    title: "형 변환",
    icon: "⇄",
    items: [
      item("int()", 'int("42")  # 42', "문자를 정수(숫자)로 바꾸기", "int", "convert"),
      item("str()", "str(42)    # '42'", "숫자를 문자로 바꾸기", "str", "convert"),
      item("list()", 'list("abc")  # ["a", "b", "c"]', "리스트(목록)로 바꾸기", "list", "convert"),
    ],
  },
  {
    id: "string",
    title: "문자열 (글자)",
    icon: "Aa",
    items: [
      item("인덱싱 [ ]", 's = "hello"\ns[0]   # "h"', "특정 위치의 한 글자만 쏙 뽑기 (0부터 시작)", "string", "index"),
      item("슬라이싱 [ : ]", 's = "hello"\ns[1:4]  # "ell"', "원하는 구간만큼 글자 자르기", "string", "slice"),
      item("len()", 'len("hello")  # 5', "글자가 총 몇 개인지 길이 재기", "len", "string"),
      item(".split()", '"a b c".split()  # ["a","b","c"]', "띄어쓰기 기준으로 글자 쪼개기 (단어 나누기)", "split", "string"),
      item(".replace()", '"hello".replace("l","r")  # "herro"', "특정 글자를 다른 글자로 바꾸기", "replace", "string"),
    ],
  },
  {
    id: "list",
    title: "리스트 (목록)",
    icon: "[ ]",
    items: [
      item("리스트 만들기", 'nums = [1, 2, 3]', "여러 데이터를 한 줄로 세우기", "list", "create"),
      item("인덱싱 [ ]", "nums = [10, 20, 30]\nnums[0]   # 10", "N번째 데이터 꺼내기 (0부터 시작)", "list", "index"),
      item(".append()", "nums = [1, 2]\nnums.append(3)", "리스트 맨 끝에 데이터 하나 추가하기", "append", "list"),
      item("len()", "len([1, 2, 3])  # 3", "리스트에 데이터가 몇 개 있는지 세기", "len", "list"),
      item(".count()", "[1, 2, 2, 3].count(2)  # 2", "특정 데이터가 몇 개나 들어있는지 세기", "count", "list"),
      item(".sort()", "nums = [3, 1, 2]\nnums.sort()  # [1, 2, 3]", "데이터를 순서대로 예쁘게 정렬하기", "sort", "list"),
    ],
  },
  {
    id: "dict",
    title: "딕셔너리 (사전)",
    icon: "{ }",
    items: [
      item("딕셔너리 만들기", 'd = {"cat": 2, "dog": 1}', "이름표(키)와 데이터(값)를 짝지어 저장하기", "dict", "create"),
      item("값 접근", 'd["cat"]  # 2', "이름표로 데이터 꺼내기", "dict", "access"),
      item("키 확인 (in)", '"cat" in d  # True', "이런 이름표가 존재하는지 확인하기", "in", "dict"),
      item("값 추가·수정", 'd["bird"] = 3', "새로운 이름표와 데이터 추가하기", "dict", "add", "update"),
    ],
  },
  {
    id: "condition",
    title: "조건문",
    icon: "if",
    items: [
      item("if / else", "if x > 10:\n    print('크다')\nelse:\n    print('작다')", "만약 ~라면 A를, 아니면 B를 실행하기", "if", "else", "condition"),
      item("비교 연산자", "x == y   # 같다\nx != y   # 다르다\nx >= y   # 크거나 같다", "두 데이터 비교하기", "comparison", "operator"),
      item("논리 연산자", "x > 0 and x < 10\nx < 0 or x > 10", "조건 2개를 동시에 따지기 (그리고, 또는)", "and", "or", "logical"),
      item("% 나머지 연산", "n % 2 == 0  # 짝수", "나눈 나머지 구하기 (짝수/홀수 판별에 유용)", "modulo", "percent"),
    ],
  },
  {
    id: "loop",
    title: "반복문",
    icon: "∞",
    items: [
      item("for 반복문", "for item in [1, 2, 3]:\n    print(item)", "리스트 안의 데이터 개수만큼 코드 반복하기", "for", "loop"),
      item("range()", "for i in range(5):\n    print(i)", "원하는 횟수만큼 (0부터 4까지) 반복하기", "range", "for", "loop"),
      item("break / continue", "break     # 반복문 탈출\ncontinue  # 이번 회차만 건너뜀", "반복문 강제 종료하거나 건너뛰기", "break", "continue", "loop"),
    ],
  },
  {
    id: "builtin",
    title: "핵심 내장 함수",
    icon: "⌁",
    items: [
      item("sum()", "sum([1, 2, 3])  # 6", "데이터를 모두 더하기", "sum", "builtin"),
      item("max() / min()", "max([3, 1, 4])  # 4\nmin([3, 1, 4])  # 1", "가장 큰 값(Max) 또는 작은 값(Min) 찾기", "min", "max", "builtin"),
      item("sorted()", "sorted([3, 1, 2])  # [1, 2, 3]", "정렬된 새로운 리스트 만들기", "sorted", "builtin"),
    ],
  }
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
