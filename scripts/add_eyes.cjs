const fs = require('fs');
let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

const newCSS = `
/* == Eye Opening Effect == */
.eye-lid {
  position: absolute;
  left: 0;
  width: 100vw;
  height: 50vh;
  background: #000;
  z-index: 8000; /* below dialogue overlay but above game */
  transition: transform 4s cubic-bezier(0.77, 0, 0.175, 1);
}
.eye-lid.top {
  top: 0;
  transform: translateY(0);
}
.eye-lid.bottom {
  bottom: 0;
  transform: translateY(0);
}

.eye-lid.top.opening {
  animation: blinkTop 4s ease-in-out forwards;
}
.eye-lid.bottom.opening {
  animation: blinkBottom 4s ease-in-out forwards;
}

@keyframes blinkTop {
  0% { transform: translateY(0); }
  10% { transform: translateY(-10%); }
  25% { transform: translateY(0); }
  45% { transform: translateY(-40%); }
  55% { transform: translateY(-10%); }
  100% { transform: translateY(-100%); display: none; }
}
@keyframes blinkBottom {
  0% { transform: translateY(0); }
  10% { transform: translateY(10%); }
  25% { transform: translateY(0); }
  45% { transform: translateY(40%); }
  55% { transform: translateY(10%); }
  100% { transform: translateY(100%); display: none; }
}
`;

css += "\n" + newCSS;
fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
