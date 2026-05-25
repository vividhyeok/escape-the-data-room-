const fs = require('fs');
let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

const responsiveCSS = `
/* --- Layout & Responsive Fixes --- */
/* Ensure GameWindow has a stable minimum and maximum size for PC */
.game-window {
  min-width: 800px !important;
  min-height: 550px !important;
  width: 75vw !important;
  height: 80vh !important;
  max-width: 1400px !important;
  max-height: 900px !important;
}

/* Fix input placeholder cutoff */
.inspect-footer .answer-row .unlock-input {
  width: 250px !important;
  letter-spacing: 0.1em !important;
  font-size: 1.1rem !important;
}

/* Ensure modal content fits */
.inspect-surface {
  flex: 1 1 auto;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Make font sizes more legible on varying screens */
.situation-text {
  font-size: clamp(1rem, 1.5vw, 1.2rem) !important;
  line-height: 1.5;
}
`;

css += "\n" + responsiveCSS;
fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
