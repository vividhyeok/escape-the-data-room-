import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
const envPath = path.join(__dirname, '../.env');
let OPENAI_API_KEY = '';
try {
  const envData = await fs.readFile(envPath, 'utf8');
  const match = envData.match(/OPENAI_API_KEY=(.*)/);
  if (match) OPENAI_API_KEY = match[1].trim();
} catch (e) {
  console.error("Could not read .env file.");
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY not found in .env");
  process.exit(1);
}

// Extract puzzles from puzzles.ts
const puzzlesTsPath = path.join(__dirname, '../src/data/puzzles.ts');
const puzzlesData = await fs.readFile(puzzlesTsPath, 'utf8');

const puzzles = [];
const regex = /id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?situationText:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(puzzlesData)) !== null) {
  puzzles.push({ id: match[1], title: match[2], text: match[3] });
}

console.log(`Found ${puzzles.length} puzzles.`);

const ASSETS_DIR = path.join(__dirname, '../public/assets/puzzles');
await fs.mkdir(ASSETS_DIR, { recursive: true });

async function generateImage(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "dall-e-2",
      prompt: "Game asset illustration, pixel art style, retro cyber aesthetic, no text. Topic: " + prompt,
      n: 1,
      size: "512x512"
    });

    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const json = JSON.parse(body);
          resolve(json.data[0].url);
        } else {
          reject(new Error(`API Error: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Failed to download'));
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function run() {
  for (const puzzle of puzzles) {
    const destPath = path.join(ASSETS_DIR, `${puzzle.id}.png`);
    try {
      await fs.access(destPath);
      console.log(`[SKIP] ${puzzle.id} already exists.`);
      continue;
    } catch (e) {
      // file does not exist, proceed
    }

    console.log(`[GEN] Generating image for ${puzzle.id}...`);
    try {
      const url = await generateImage(`Python concept: ${puzzle.title}. ${puzzle.text}`);
      const buffer = await downloadImage(url);
      await fs.writeFile(destPath, buffer);
      console.log(`[OK] Saved ${puzzle.id}.png`);
    } catch (err) {
      console.error(`[FAIL] Error generating ${puzzle.id}:`, err.message);
    }
  }
}

run().then(() => console.log('Done.')).catch(console.error);
