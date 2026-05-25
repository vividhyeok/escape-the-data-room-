const fs = require('fs');
let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

const vfxCSS = `
/* ==========================================================================
   GAME VFX & ANIMATIONS
   ========================================================================== */

/* --- 1. Glitch Hover Effect for Buttons --- */
@keyframes buttonGlitch {
  0% { transform: translate(0); text-shadow: 0 0 10px rgba(148,255,197,0.3); }
  20% { transform: translate(-2px, 1px); text-shadow: 2px 0 #ff00c1, -2px 0 #00fff9; }
  40% { transform: translate(2px, -1px); text-shadow: -2px 0 #ff00c1, 2px 0 #00fff9; }
  60% { transform: translate(-1px, 2px); text-shadow: 2px 0 #ff00c1, -2px 0 #00fff9; }
  80% { transform: translate(1px, -2px); text-shadow: -2px 0 #ff00c1, 2px 0 #00fff9; }
  100% { transform: translate(0); text-shadow: 0 0 20px rgba(148,255,197,0.8); }
}

.title-btn:hover, .nav-chip:hover, .primary-button:hover, .ghost-button:hover {
  animation: buttonGlitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
}

/* --- 2. CRT Boot Entrance for Modals --- */
@keyframes crtBoot {
  0% { transform: scale(1, 0.001) translateY(0); opacity: 0; filter: brightness(3); }
  30% { transform: scale(1, 0.001) translateY(0); opacity: 1; filter: brightness(3); }
  60% { transform: scale(1, 1.1) translateY(0); opacity: 1; filter: brightness(1.5); }
  80% { transform: scale(1, 0.95) translateY(0); opacity: 1; filter: brightness(1); }
  100% { transform: scale(1, 1) translateY(0); opacity: 1; filter: brightness(1); }
}

.modal, .settings-modal, .lab-window, .review-panel, .inspect-modal-container {
  animation: crtBoot 0.35s ease-out forwards;
}

/* --- 3. Object Pulse Glow --- */
@keyframes pulseGlow {
  0% { filter: drop-shadow(0 0 2px rgba(148, 255, 197, 0.3)); transform: scale(1); }
  50% { filter: drop-shadow(0 0 15px rgba(148, 255, 197, 0.8)); transform: scale(1.02); }
  100% { filter: drop-shadow(0 0 2px rgba(148, 255, 197, 0.3)); transform: scale(1); }
}

.hotspot-layer:not(.edit-mode) > div > img {
  animation: pulseGlow 3s infinite ease-in-out;
  transition: filter 0.2s, transform 0.2s;
}

.hotspot-layer:not(.edit-mode) > div:hover > img {
  animation: none;
  filter: drop-shadow(0 0 20px rgba(122, 243, 255, 1)) brightness(1.2);
  transform: scale(1.05);
}

/* --- 4. Cyber Chromatic Aberration for Titles --- */
@keyframes cyberText {
  0% { text-shadow: 2px 0 rgba(255,0,0,0.5), -2px 0 rgba(0,255,255,0.5); }
  50% { text-shadow: -2px 0 rgba(255,0,0,0.5), 2px 0 rgba(0,255,255,0.5); }
  100% { text-shadow: 2px 0 rgba(255,0,0,0.5), -2px 0 rgba(0,255,255,0.5); }
}
.title-block h1, .game-logo {
  animation: cyberText 4s infinite linear;
}

/* --- 5. Scanlines enhancement --- */
.scanlines {
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
  background-size: 100% 4px;
  opacity: 0.8;
  animation: scanlinesMove 10s linear infinite;
}
@keyframes scanlinesMove {
  0% { background-position: 0 0; }
  100% { background-position: 0 400px; }
}
`;

css += "\n" + vfxCSS;
fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
