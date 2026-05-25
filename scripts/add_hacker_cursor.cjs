const fs = require('fs');
let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

const cursorCSS = `
/* --- Hacker Cursor --- */
.hacker-cursor {
  display: inline-block;
  width: 0.6em;
  height: 1.2em;
  background-color: #94ffc5;
  color: #94ffc5;
  vertical-align: text-bottom;
  animation: blinkCursor 1s step-end infinite;
  margin-left: 4px;
}
@keyframes blinkCursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

css += "\n" + cursorCSS;
fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
