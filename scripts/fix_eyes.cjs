const fs = require('fs');

let css = fs.readFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', 'utf8');

css = css.replace(/\.eye-lid \{([\s\S]*?)\}/, (match, inner) => {
  if (!inner.includes('pointer-events')) {
    return `.eye-lid {${inner}  pointer-events: none;\n}`;
  }
  return match;
});

// Change 4s to 2.5s for the animation
css = css.replace(/animation: blinkTop 4s ease-in-out forwards;/g, 'animation: blinkTop 2.5s ease-in-out forwards;');
css = css.replace(/animation: blinkBottom 4s ease-in-out forwards;/g, 'animation: blinkBottom 2.5s ease-in-out forwards;');

fs.writeFileSync('c:/Users/user/Desktop/ETDR/src/styles/global.css', css, 'utf8');
