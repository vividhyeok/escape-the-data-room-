const fs = require('fs');

let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

css = css.replace(/body \{\s*cursor: crosshair;\s*\}/g, 'body { cursor: default; }');
css = css.replace(/button, a, select, input\[type="button"\], input\[type="submit"\] \{\s*cursor: cell;\s*\}/g, 'button, a, select, input[type="button"], input[type="submit"] { cursor: pointer; }');
css = css.replace(/\.title-btn \{\s*cursor: cell;\s*\}/g, '.title-btn { cursor: pointer; }');

// Remove display: none from keyframes just in case
css = css.replace(/100% \{ transform: translateY\(-100%\); display: none; \}/g, '100% { transform: translateY(-100%); }');
css = css.replace(/100% \{ transform: translateY\(100%\); display: none; \}/g, '100% { transform: translateY(100%); }');

fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
