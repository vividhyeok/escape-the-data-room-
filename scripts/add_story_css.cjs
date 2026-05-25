const fs = require('fs');
let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

const newCSS = `
/* == Story Archive == */
.story-archive-content {
  background: #020508;
  border: 1px solid #1a2f24;
  padding: 40px;
  width: 80vw;
  max-width: 900px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
  color: #fff;
}
.story-log-container {
  flex: 1;
  overflow-y: auto;
  background: rgba(10, 15, 20, 0.8);
  border: 1px solid rgba(148, 255, 197, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  border-radius: 4px;
}
.no-story-msg {
  color: #666;
  text-align: center;
  font-style: italic;
  margin-top: 50px;
}
.story-log-item {
  border-left: 2px solid #94ffc5;
  padding-left: 16px;
}
.story-log-title {
  color: #94ffc5;
  margin-bottom: 12px;
  font-size: 1.3rem;
  border-bottom: 1px dashed rgba(148, 255, 197, 0.3);
  padding-bottom: 6px;
}
.story-log-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.story-log-line {
  line-height: 1.5;
  font-size: 1.1rem;
}
.story-speaker {
  font-weight: bold;
  color: #4da6ff;
}
.story-text {
  color: #ddd;
}
`;

css += "\n" + newCSS;
fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
