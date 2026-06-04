import fs from 'node:fs';

const filePath = 'src/components/InspectModal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add EditorView import
content = content.replace(
  'import { keymap } from "@codemirror/view";',
  'import { keymap, EditorView } from "@codemirror/view";'
);

// 2. Remove setCopyStatus
content = content.replace(
  'const [copyStatus, setCopyStatus] = useState("");',
  ''
);
content = content.replace(
  'setCopyStatus("");',
  ''
);

// 3. Remove copyData function
const copyDataRegex = /async function copyData\(\): Promise<void> \{[\s\S]*?\n  \}\n/g;
content = content.replace(copyDataRegex, '');

// 4. Replace ! CONST UI
const constUiOld = `            {(puzzle.requiredSyntax?.length || puzzle.bannedSyntax?.length) ? (
              <div style={{ marginTop: "10px", padding: "10px", background: "rgba(0,0,0,0.4)", border: "1px dashed var(--neon-cyan)", fontSize: "0.85rem" }}>
                <strong style={{ color: "var(--neon-cyan)" }}>! CONST</strong>
                {puzzle.requiredSyntax && puzzle.requiredSyntax.length > 0 && (
                  <div style={{ marginTop: "4px" }}>+ {puzzle.requiredSyntax.join(", ")}</div>
                )}
                {puzzle.bannedSyntax && puzzle.bannedSyntax.length > 0 && (
                  <div style={{ marginTop: "4px", color: "#ff6b6b" }}>- {puzzle.bannedSyntax.join(", ")}</div>
                )}
              </div>
            ) : null}`;

const constUiNew = `            {(puzzle.requiredSyntax?.length || puzzle.bannedSyntax?.length) ? (
              <div style={{ marginTop: "10px", padding: "10px", background: "rgba(0,0,0,0.4)", borderRadius: "6px", border: "1px solid var(--border-color)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                {puzzle.requiredSyntax && puzzle.requiredSyntax.length > 0 && (
                  <div>
                    <span style={{ color: "var(--neon-cyan)", fontWeight: "bold", marginRight: "6px" }}>✓ 필수 문법:</span>
                    <span>{puzzle.requiredSyntax.join(", ")}</span>
                  </div>
                )}
                {puzzle.bannedSyntax && puzzle.bannedSyntax.length > 0 && (
                  <div>
                    <span style={{ color: "#ff6b6b", fontWeight: "bold", marginRight: "6px" }}>✗ 사용 금지:</span>
                    <span>{puzzle.bannedSyntax.join(", ")}</span>
                  </div>
                )}
              </div>
            ) : null}`;
content = content.replace(constUiOld, constUiNew);

// 5. Replace renderClueSurface function
const renderFuncRegex = /function renderClueSurface\(puzzle: Puzzle, object: RoomObject\): React\.JSX\.Element \{[\s\S]*?^  \n  return \(\n    <div className="clue-surface generic-surface">\n      <span className="surface-object-label">\{object\.title\}<\/span>\n      <pre>\{puzzle\.dataText\}<\/pre>\n    <\/div>\n  \);\n\}/gm;

const renderFuncNew = `function renderClueSurface(puzzle: Puzzle, object: RoomObject): React.JSX.Element {
  if (!puzzle.imageUrl) {
    return (
      <div className="clue-surface default-surface" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--neon-cyan)', fontSize: '1.2rem', marginBottom: '10px' }}>[IMAGE PENDING]</div>
        <pre>{puzzle.dataText}</pre>
      </div>
    );
  }
  
  return (
    <div className="clue-surface image-surface" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'transparent', border: 'none', boxShadow: 'none' }}>
      <img 
        src={puzzle.imageUrl} 
        alt={puzzle.title} 
        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
        draggable={false}
      />
    </div>
  );
}`;
content = content.replace(renderFuncRegex, renderFuncNew);

fs.writeFileSync(filePath, content);
console.log("Replaced successfully!");
