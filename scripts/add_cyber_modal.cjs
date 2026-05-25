const fs = require('fs');
let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

const cyberCSS = `
/* --- Cyber Modal Overhaul --- */
.cyber-modal-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  animation: crtBoot 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.cyber-modal {
  width: 80%;
  max-width: 800px;
  background: rgba(10, 15, 12, 0.95);
  border: 1px solid #94ffc5;
  box-shadow: 0 0 20px rgba(148, 255, 197, 0.2), inset 0 0 15px rgba(148, 255, 197, 0.1);
  color: #94ffc5;
  font-family: monospace;
  position: relative;
  overflow: hidden;
}

/* Internal Scanlines for modals */
.cyber-modal::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
  z-index: 10;
}

.cyber-modal-header {
  background: #94ffc5;
  color: #000;
  padding: 8px 16px;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cyber-modal-close {
  background: transparent;
  border: none;
  color: #000;
  font-size: 1.5rem;
  cursor: pointer;
  font-weight: bold;
}
.cyber-modal-close:hover {
  color: #ff003c;
}

.cyber-modal-content {
  padding: 30px;
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.cyber-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cyber-list-item {
  border-bottom: 1px dashed rgba(148, 255, 197, 0.3);
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.cyber-list-item:hover {
  background: rgba(148, 255, 197, 0.05);
}
.cyber-item-id {
  font-size: 0.8rem;
  opacity: 0.7;
}
.cyber-item-title {
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
}
.cyber-item-desc {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.4;
}

/* Hardware switch styles for settings */
.cyber-btn-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.cyber-switch-btn {
  background: transparent;
  border: 1px solid #94ffc5;
  color: #94ffc5;
  padding: 8px 15px;
  font-family: monospace;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.1s;
}
.cyber-switch-btn:hover {
  background: rgba(148, 255, 197, 0.2);
}
.cyber-switch-btn.active {
  background: #94ffc5;
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 10px #94ffc5;
}

.cyber-credits-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle, #0a1f12 0%, #000000 100%);
}
.cyber-credits-scroll {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #94ffc5;
  font-family: monospace;
  text-shadow: 0 0 5px #94ffc5;
  animation: cyberScrollUp 15s linear forwards;
}
@keyframes cyberScrollUp {
  0% { transform: translateY(100vh); opacity: 0; }
  10% { opacity: 1; }
  90% { transform: translateY(-50vh); opacity: 1; }
  100% { transform: translateY(-50vh); opacity: 1; }
}
`;

css += "\n" + cyberCSS;
fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
