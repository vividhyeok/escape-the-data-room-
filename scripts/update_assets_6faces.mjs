import fs from "fs";
import path from "path";

let content = fs.readFileSync("scripts/generate_assets.mjs", "utf8");

// Remove panorama stitching entirely since we will use 6 separate faces
content = content.replace(/async function stitchPanorama[\s\S]*?\n\}\n/m, "");
content = content.replace(/\/\/ ── stitch all bg panoramas ──[\s\S]*?\n\}\n/m, "");
content = content.replace(/const bgsThatNeedStitch = new Set\(\);[\s\S]*?const bgCount  = \[\.\.\.bgsThatNeedStitch\]\.length;/m, "const bgCount = 0;");
content = content.replace(/\|  Panoramas to stitch: \$\{bgCount\}/g, "");

// We will manually overwrite the ASSETS array
const newAssets = `
const ASSETS = [
  {
    type: "bg",
    output: "public/assets/images/backgrounds/room-0",
    segments: [
      { output: "public/assets/images/backgrounds/room-0/right.png", prompt: "RIGHT WALL VIEW of a small locked study room. Orthogonal flat 2D plane view of a single wall directly facing the camera, perfectly straight. NO wall corners visible. Warm amber plaster, low dark wooden cabinet. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-0/left.png", prompt: "LEFT WALL VIEW of a small locked study room. Orthogonal flat 2D plane view of a single wall directly facing the camera, perfectly straight. NO wall corners visible. Warm amber plaster, low wooden bookshelf. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-0/top.png", prompt: "CEILING VIEW of a small locked study room. Orthogonal flat 2D plane view directly facing the ceiling. Warm amber plaster ceiling with a single ceiling lamp in the center. NO wall corners visible. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-0/bottom.png", prompt: "FLOOR VIEW of a small locked study room. Orthogonal flat 2D plane view directly facing the floor. Bare wooden floorboards. NO wall corners visible. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-0/front.png", prompt: "FRONT WALL VIEW of a small locked study room. Orthogonal flat 2D plane view directly facing the front wall. Narrow closed wooden door. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-0/back.png", prompt: "BACK WALL VIEW of a small locked study room. Orthogonal flat 2D plane view directly facing the back wall. Warm amber plaster, completely empty wall. " + BG_STYLE }
    ]
  },
  {
    type: "bg",
    output: "public/assets/images/backgrounds/room-1",
    segments: [
      { output: "public/assets/images/backgrounds/room-1/right.png", prompt: "RIGHT WALL VIEW of a signal analysis room. Orthogonal flat 2D plane view of a single wall. Dark teal concrete, narrow exit door. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-1/left.png", prompt: "LEFT WALL VIEW of a signal analysis room. Orthogonal flat 2D plane view of a single wall. Dark teal concrete, empty monitor bracket. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-1/top.png", prompt: "CEILING VIEW of a signal analysis room. Orthogonal flat 2D plane view directly facing the ceiling. Concrete ceiling, dim blue-tinted overhead light. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-1/bottom.png", prompt: "FLOOR VIEW of a signal analysis room. Orthogonal flat 2D plane view directly facing the floor. Bare teal-painted concrete floor. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-1/front.png", prompt: "FRONT WALL VIEW of a signal analysis room. Orthogonal flat 2D plane view directly facing the front wall. Large dark teal wall with faint cyan grid. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-1/back.png", prompt: "BACK WALL VIEW of a signal analysis room. Orthogonal flat 2D plane view directly facing the back wall. Dark teal concrete, completely empty. " + BG_STYLE }
    ]
  },
  {
    type: "bg",
    output: "public/assets/images/backgrounds/room-2",
    segments: [
      { output: "public/assets/images/backgrounds/room-2/right.png", prompt: "RIGHT WALL VIEW of a quiet archive room. Orthogonal flat 2D plane. Muted sage-green, plain metal door. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-2/left.png", prompt: "LEFT WALL VIEW of a quiet archive room. Orthogonal flat 2D plane. Muted sage-green, tall metal filing cabinet. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-2/top.png", prompt: "CEILING VIEW of a quiet archive room. Orthogonal flat 2D plane. Plaster ceiling, fluorescent strip light. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-2/bottom.png", prompt: "FLOOR VIEW of a quiet archive room. Orthogonal flat 2D plane. Concrete floor. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-2/front.png", prompt: "FRONT WALL VIEW of a quiet archive room. Orthogonal flat 2D plane. Empty cork-board surface. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-2/back.png", prompt: "BACK WALL VIEW of a quiet archive room. Orthogonal flat 2D plane. Muted sage-green wall, completely empty. " + BG_STYLE }
    ]
  },
  {
    type: "bg",
    output: "public/assets/images/backgrounds/room-3",
    segments: [
      { output: "public/assets/images/backgrounds/room-3/right.png", prompt: "RIGHT WALL VIEW of a hidden control room. Orthogonal flat 2D plane. Deep indigo-purple, heavy steel exit hatch. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-3/left.png", prompt: "LEFT WALL VIEW of a hidden control room. Orthogonal flat 2D plane. Deep indigo-purple, underside of a staircase soffit. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-3/top.png", prompt: "CEILING VIEW of a hidden control room. Orthogonal flat 2D plane. Concrete ceiling, amber safety light. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-3/bottom.png", prompt: "FLOOR VIEW of a hidden control room. Orthogonal flat 2D plane. Concrete floor with faint yellow safety stripe. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-3/front.png", prompt: "FRONT WALL VIEW of a hidden control room. Orthogonal flat 2D plane. Dense instrument panel, amber warning lights. " + BG_STYLE },
      { output: "public/assets/images/backgrounds/room-3/back.png", prompt: "BACK WALL VIEW of a hidden control room. Orthogonal flat 2D plane. Deep indigo-purple wall, empty. " + BG_STYLE }
    ]
  }
];

// Append objects to ASSETS
ASSETS.push(...[
  { type: "obj", output: "public/assets/images/objects/room-0/crt-tv.png", prompt: \`Old small CRT television used as a tutorial clue object, slightly chunky silhouette, dark glass screen with faint green glow but no visible text or numbers, retro study room mood, readable clickable game sprite. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-0/desk-terminal.png", prompt: \`Compact desk terminal computer for a beginner Python lab escape room, small keyboard, dark blank screen with subtle cyan glow, retro-modern style, clean silhouette, no visible text. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-0/mini-ox-card.png", prompt: \`Worn physical paper card resting flat, slightly curled edges, faded printed circles and crosses in two columns (signal marks), aged yellowed paper with subtle texture and a tiny torn corner, escape room prop, tangible real object not a graphic. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-0/name-tags-bundle.png", prompt: \`A bundle of blank name tags tied with a small band, several cards overlapping, no readable writing, educational data clue object, warm study room colors. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-0/pattern-tile-box.png", prompt: \`Small open box containing simple geometric tiles, triangle square circle shapes as abstract icons without labels, tutorial pattern clue object, warm muted colors. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-0/bookshelf-note.png", prompt: \`Small folded note sticking out of a book, blank paper surface with no readable text, warm mysterious tutorial clue object. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/shared/door-keypad.png", prompt: \`Wall mounted escape room keypad device with a dark blank display and simple unmarked button grid, no visible digits or letters, sturdy sci-fi classroom style, amber indicator light. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-1/word-billboard.png", prompt: \`Large electronic word billboard object for a signal room, blank segmented display panels with cyan glow, no readable words or letters, a five-slot indicator shape suggested without symbols, clean clickable sprite. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-1/ox-monitor.png", prompt: \`Signal monitor object showing abstract rows of small glowing dots and blocks, no actual letters or numbers, dark teal casing, classroom-safe sci-fi style, strong rectangular silhouette. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-1/number-panel.png", prompt: \`Electronic number panel clue object with many blank glowing tile cells, no readable digits, cyan and amber lights, clean sci-fi signal room style, strong clickable shape. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-1/name-card-board.png", prompt: \`Wall board with many blank name cards pinned in rows, no readable names, muted paper cards on dark board, signal room clue object, clear rectangular silhouette. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-1/radio-signal-device.png", prompt: \`Small hidden radio signal device, compact receiver with dial, antenna, faint violet glow, looks optional and mysterious, no station numbers or labels. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-1/noise-strip.png", prompt: \`Thin glowing strip device with alternating abstract blocks, hidden signal clue, slim horizontal shape, violet and amber glow, no readable characters or numbers. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-2/file-cabinet.png", prompt: \`Archive file cabinet clue object, slightly open drawers with blank folders visible, muted green-gray metal, no labels or text, readable silhouette for a records room escape game. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-2/broken-name-tags.png", prompt: \`Scattered blank name tags and ID cards with torn corners, no readable text, muted paper and plastic material, data cleaning clue object. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-2/score-board.png", prompt: \`Blank score board or record board with two clean columns implied by empty panels, no readable text or numbers, archive room style, muted green and amber accent lights. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-2/timeline-board.png", prompt: \`Timeline board clue object with a horizontal line and blank event cards, no readable text, no numbers, muted archive room colors, strong rectangular silhouette. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-2/access-log-table.png", prompt: \`Hidden access log table object, small metal clipboard or tablet with blank rows, faint green glow, no readable text, optional clue feeling. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-2/archive-note.png", prompt: \`Small hidden archive note tucked into a folder, blank paper with folded edge, warm amber glow, optional clue object, no readable writing. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-3/dangerous-stair-marker.png", prompt: \`Ominous stair entrance marker for an optional challenge, dark metal stair sign shape without text, violet rim light, classroom-safe mysterious mood. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-3/switch-panel.png", prompt: \`Control room switch panel with six unmarked toggle switches, no labels or numbers, dark metal casing, amber warning lights, clear interactive game sprite. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-3/logic-gate-board.png", prompt: \`Abstract logic gate board object with simple glowing circuit lines and blank nodes, no actual symbols, no text, dark blue-violet control room style, rectangular clear silhouette. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-3/candidate-codes-board.png", prompt: \`Candidate code board with blank small code tiles, no readable digits, dark console board, cyan and orange glow, optional challenge game asset. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-3/experiment-console.png", prompt: \`Experiment console device for validating candidate codes, compact lab console with blank screen and a few unmarked buttons, violet-blue glow, no text or numbers. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-3/warning-lamp-board.png", prompt: \`Warning lamp board with several colored indicator lights, no labels, no text, dark metal backing, looks like a hidden optional control clue. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-3/candidate-dial.png", prompt: \`Mechanical candidate dial device, circular selector with blank tick marks, no readable numbers, violet and amber lighting, optional challenge clue. \${OBJ_STYLE}\` },
  { type: "obj", output: "public/assets/images/objects/room-3/finish-console.png", prompt: \`Small finish console for ending the optional challenge, dark panel with a glowing safe exit indicator, no text, no labels, no numbers, game-like but not scary. \${OBJ_STYLE}\` }
]);
`;
content = content.replace(/const ASSETS = \[[\s\S]*?\/\/ ── helpers ──/m, newAssets + "\n\n// ── helpers ──");

// Ensure square sizes for 6 faces
content = content.replace(/size: isSeg \? "1536x1024" : "1024x1024",/g, 'size: "1024x1024",');

fs.writeFileSync("scripts/generate_assets.mjs", content, "utf8");
console.log("Updated generate_assets.mjs for 6 faces.");
