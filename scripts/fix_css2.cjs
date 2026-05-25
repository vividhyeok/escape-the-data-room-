const fs = require('fs');

let content = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

// The file got corrupted after lightFlicker.
// We will find `} /*` or `.title-screen {` and cut it there.
const match = content.indexOf('.title-screen {');
if (match > -1) {
  // Backtrack to the comment if possible
  const safeIdx = content.lastIndexOf('}', match);
  if (safeIdx > -1) {
    content = content.slice(0, safeIdx + 1);
  } else {
    content = content.slice(0, match);
  }
}

// Ensure no BOM anywhere
content = content.replace(/\uFEFF/g, '');

const cssEnd = `
/* == Title Screen == */
.title-screen {
  position: absolute;
  inset: 0;
  background: url("/assets/images/title-bg.png") center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10vw;
  z-index: 1000;
}
.title-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.game-logo {
  font-size: 4rem;
  line-height: 1.1;
  color: #fff;
  text-shadow: 0 0 20px rgba(148, 255, 197, 0.5);
  font-family: monospace;
}
.title-menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
}
.title-btn {
  background: rgba(10, 15, 20, 0.8);
  border: 1px solid rgba(148, 255, 197, 0.5);
  color: #94ffc5;
  padding: 12px 24px;
  font-size: 1.2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.title-btn:hover {
  background: rgba(148, 255, 197, 0.2);
  transform: translateX(10px);
}
.settings-modal {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}
.settings-content {
  background: #111;
  border: 1px solid #333;
  padding: 40px;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* == Dialogue Overlay == */
.dialogue-overlay {
  position: absolute;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.dialogue-box {
  background: rgba(10, 15, 20, 0.95);
  border: 1px solid rgba(148, 255, 197, 0.3);
  border-radius: 8px;
  padding: 24px;
  position: relative;
  min-height: 120px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.8);
  animation: fadeIn 0.3s ease;
}
.dialogue-skip {
  position: absolute;
  top: -30px;
  right: 0;
  background: rgba(0,0,0,0.6);
  color: #aaa;
  border: 1px solid #444;
  padding: 4px 12px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}
.dialogue-skip:hover {
  color: #fff;
  border-color: #888;
}
.dialogue-speaker {
  font-weight: bold;
  color: #94ffc5;
  margin-bottom: 8px;
  font-size: 1.1rem;
}
.dialogue-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #fff;
}
.dialogue-prompt {
  position: absolute;
  right: 24px;
  bottom: 20px;
  color: #94ffc5;
  animation: bounce 1s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

/* == Scroll Credits == */
.credits-screen {
  position: absolute;
  inset: 0;
  background: #000;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
  animation: fadeIn 2s ease;
}
.credits-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  animation: scrollUp 15s linear forwards;
}
.credits-scroll.paused {
  animation-play-state: paused;
}
.credits-scroll h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #94ffc5;
}
.credits-scroll p {
  font-size: 1.2rem;
  color: #aaa;
  text-align: center;
}
.credits-btn-container {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 9002;
}
@keyframes scrollUp {
  0% { transform: translateY(100vh); }
  100% { transform: translateY(-50%); }
}
.credits-skip {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid #555;
  padding: 8px 16px;
  cursor: pointer;
  z-index: 9001;
}
.credits-skip:hover {
  background: rgba(255,255,255,0.2);
}

.dialogue-overlay {
  background: transparent !important;
  align-items: center !important;
  padding-bottom: 80px !important;
}
.dialogue-box {
  width: 800px !important;
  max-width: 90vw !important;
}
.keypad-display input {
  width: 300px !important;
  min-width: 200px !important;
}

/* == Title Effects == */
.crt-glitch::before {
  content: ' ';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.25) 50%
  );
  background-size: 100% 4px;
  z-index: 100;
  pointer-events: none;
  animation: scanline 10s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(0); }
  100% { transform: translateY(-4px); }
}

.flicker {
  animation: textFlicker 4s linear infinite;
}

@keyframes textFlicker {
  0%   { opacity: 1; text-shadow: 0 0 20px rgba(148, 255, 197, 0.8); }
  10%  { opacity: 0.8; }
  11%  { opacity: 1; }
  12%  { opacity: 0.2; text-shadow: none; }
  13%  { opacity: 1; }
  50%  { opacity: 1; }
  51%  { opacity: 0.4; }
  52%  { opacity: 1; }
  70%  { opacity: 1; }
  71%  { opacity: 0.1; transform: translateX(-2px); }
  72%  { opacity: 1; transform: translateX(0); }
  100% { opacity: 1; }
}

.title-screen.crt-glitch {
  box-shadow: inset 0 0 150px rgba(0,0,0,0.9);
}
`;

content = content + "\n" + cssEnd;

fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', content, 'utf8');
