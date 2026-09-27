import { createCanvas, loadImage } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';
const names = process.argv.slice(3); const out = process.argv[2]!;
const W = 560, H = 320, cols = 3, rows = Math.ceil(names.length / cols);
const c = createCanvas(W * cols, H * rows); const g = c.getContext('2d');
g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
for (let i = 0; i < names.length; i++) {
  const im = await loadImage(names[i]!); const s = Math.min(W / im.width, H / im.height);
  g.drawImage(im, (i % cols) * W + (W - im.width * s) / 2, Math.floor(i / cols) * H + (H - im.height * s) / 2, im.width * s, im.height * s);
}
writeFileSync(out, c.toBuffer('image/png'));
