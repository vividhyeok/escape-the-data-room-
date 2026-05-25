import fs from 'fs';

let content = fs.readFileSync('scripts/generate_assets.mjs', 'utf8');

// Replace BG_STYLE
content = content.replace(
  /const BG_STYLE =[\s\S]*?";/,
  'const BG_STYLE =\n  "Orthogonal flat 2D plane view of a single wall directly facing the camera, perfectly straight. NO wall corners visible within the image, NO floor corners visible. The image must look like a flat texture tile of a wall. Semi-realistic 3D escape room game art, stylized but grounded, muted cinematic lighting, large empty wall surfaces for overlaid interactive objects. No text, no letters, no numbers, no UI, no people, no characters, no logos, no watermark.";'
);

// Remove mentions of corners from prompts
content = content.replace(/Right edge of the image begins to show the far back wall turning away \(left corner\)\./g, '');
content = content.replace(/Left edge of the image shows the left corner receding \(left wall turning away\)\./g, '');
content = content.replace(/Right edge shows the right corner receding \(right wall turning away\)\./g, '');
content = content.replace(/Left edge shows the far back wall turning away \(right corner\)\./g, '');
content = content.replace(/Right edge begins to show the back wall turning \(left corner\)\./g, '');
content = content.replace(/Left edge shows left corner \(left wall receding\)\./g, '');
content = content.replace(/Right edge shows right corner \(right wall receding\)\./g, '');
content = content.replace(/Left edge shows back wall turning away \(right corner\)\./g, '');

fs.writeFileSync('scripts/generate_assets.mjs', content, 'utf8');
console.log('Prompts updated successfully.');
