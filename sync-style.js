import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const src = join(__dirname, 'style.css');
const destDir = join(__dirname, 'public');
const dest = join(destDir, 'style.css');

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

copyFileSync(src, dest);
console.log(`Copied style.css -> ${dest}`);
