const fs = require('fs');
let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

// Remove the bad .game-window block that broke resizing
css = css.replace(/\.game-window\s*\{\s*min-width: 800px !important;[\s\S]*?max-height: 900px !important;\s*\}/, '');

// Append CodeMirror theme
const codeMirrorCSS = `
/* --- CodeMirror Cyber Theme --- */
.cm-tooltip-autocomplete {
  background: rgba(10, 15, 12, 0.95) !important;
  border: 1px solid #94ffc5 !important;
  box-shadow: 0 0 10px rgba(148, 255, 197, 0.3) !important;
  color: #94ffc5 !important;
  font-family: monospace !important;
  border-radius: 4px;
}
.cm-tooltip-autocomplete > ul {
  background: transparent !important;
}
.cm-tooltip-autocomplete > ul > li {
  padding: 5px 10px !important;
  transition: background 0.1s;
}
.cm-tooltip-autocomplete > ul > li[aria-selected="true"] {
  background: #94ffc5 !important;
  color: #000 !important;
  font-weight: bold;
}
.cm-completionDetail {
  color: rgba(148, 255, 197, 0.7) !important;
  font-style: italic;
}
.cm-tooltip-autocomplete > ul > li[aria-selected="true"] .cm-completionDetail {
  color: rgba(0, 0, 0, 0.7) !important;
}
.cm-completionInfo {
  background: rgba(10, 15, 12, 0.95) !important;
  border: 1px solid #94ffc5 !important;
  padding: 10px !important;
  color: #fff !important;
  font-family: 'Pretendard', sans-serif !important;
}
`;

css += "\n" + codeMirrorCSS;
fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
