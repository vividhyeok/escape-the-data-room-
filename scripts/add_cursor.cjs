const fs = require('fs');

const css = `
/* == Game Cursor == */
body {
  cursor: crosshair;
}
button, a, select, input[type="button"], input[type="submit"] {
  cursor: cell;
}
.title-btn {
  cursor: cell;
}
`;
fs.appendFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
