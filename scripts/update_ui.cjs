const fs = require('fs');

let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

// Title Btn
css = css.replace(
  /\.title-btn \{[\s\S]*?\}/,
  `.title-btn {
  background: transparent;
  border: none;
  color: #94ffc5;
  padding: 12px 24px;
  font-size: 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  text-shadow: 0 0 10px rgba(148, 255, 197, 0.3);
  position: relative;
}`
);

css = css.replace(
  /\.title-btn:hover \{[\s\S]*?\}/,
  `.title-btn:hover {
  background: transparent;
  transform: translateX(15px);
  text-shadow: 0 0 20px rgba(148, 255, 197, 0.8);
}
.title-btn::before {
  content: '>';
  position: absolute;
  left: 0;
  opacity: 0;
  transition: all 0.2s ease;
}
.title-btn:hover::before {
  opacity: 1;
  left: 5px;
}`
);

// Settings Content
css = css.replace(
  /\.settings-content \{[\s\S]*?\}/,
  `.settings-content {
  background: rgba(10, 15, 20, 0.9);
  border: none;
  padding: 60px;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 30px;
}`
);

// Dialogue Box
css = css.replace(
  /\.dialogue-box \{[\s\S]*?\}/,
  `.dialogue-box {
  background: rgba(0, 0, 0, 0.75);
  border: none;
  border-radius: 0;
  padding: 30px 40px;
  position: relative;
  min-height: 150px;
  width: 100vw !important;
  max-width: 100vw !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}`
);

// Dialogue Overlay (the overrides at the bottom)
css = css.replace(
  /\.dialogue-overlay \{\s*background: transparent !important;\s*align-items: center !important;\s*padding-bottom: 80px !important;\s*\}/,
  `.dialogue-overlay {
  background: transparent !important;
  align-items: center !important;
  padding-bottom: 0 !important;
}`
);

// Dialogue Text
css = css.replace(
  /\.dialogue-text \{[\s\S]*?\}/,
  `.dialogue-text {
  font-size: 1.8rem;
  line-height: 1.6;
  color: #fff;
  text-shadow: 1px 1px 2px #000;
}`
);

// Dialogue Speaker
css = css.replace(
  /\.dialogue-speaker \{[\s\S]*?\}/,
  `.dialogue-speaker {
  font-weight: bold;
  color: #94ffc5;
  margin-bottom: 12px;
  font-size: 1.4rem;
}`
);

// Dialogue Skip
css = css.replace(
  /\.dialogue-skip \{[\s\S]*?\}/,
  `.dialogue-skip {
  position: absolute;
  top: -40px;
  right: 40px;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1rem;
  cursor: pointer;
}`
);
css = css.replace(
  /\.dialogue-skip:hover \{[\s\S]*?\}/,
  `.dialogue-skip:hover {
  background: transparent;
  color: #fff;
  border: none;
}`
);

// Story Archive
css = css.replace(
  /\.story-archive-content \{[\s\S]*?\}/,
  `.story-archive-content {
  background: rgba(10, 15, 20, 0.95);
  border: none;
  padding: 40px;
  width: 80vw;
  max-width: 900px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #fff;
}`
);

css = css.replace(
  /\.story-log-container \{[\s\S]*?\}/,
  `.story-log-container {
  flex: 1;
  overflow-y: auto;
  background: transparent;
  border: none;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}`
);

fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
