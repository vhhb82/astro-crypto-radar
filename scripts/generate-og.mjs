import fs from 'node:fs/promises';
import sharp from 'sharp';

const svg = await fs.readFile('public/og.svg');
await sharp(svg).resize(1200, 630).png({ quality: 90 }).toFile('public/og.png');
console.log('✔ public/og.png generat');
