/**
 * Asset pipeline for Fast Slim+.
 *
 * Regenerates the optimized web media (video, poster, responsive images) from the
 * original product video. The optimized outputs are committed to the repo, so you
 * only need to run this when the source video changes.
 *
 * Usage:
 *   SOURCE=/path/to/original-product-video.mp4 npm run assets
 *
 * Requires the devDependencies ffmpeg-static, ffprobe-static and sharp.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const SOURCE = process.env.SOURCE;
const OUT = 'src/assets/media';
const TMP = '.asset-tmp';

if (!SOURCE || !existsSync(SOURCE)) {
  console.error('Set SOURCE to the original product video, e.g.\n  SOURCE=./original.mp4 npm run assets');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const ff = (args) => execFileSync(ffmpegPath, ['-y', ...args, '-loglevel', 'error'], { stdio: 'inherit' });

// 1) Web-optimized, muted video (mp4 h264 + webm vp9) for autoplay hero.
console.log('Encoding video…');
ff(['-i', SOURCE, '-an', '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-crf', '26', '-preset', 'slow', '-movflags', '+faststart', '-vf', 'scale=720:1280',
    `${OUT}/fastslim.mp4`]);
ff(['-i', SOURCE, '-an', '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-vf', 'scale=720:1280',
    `${OUT}/fastslim.webm`]);

// 2) Key stills grabbed from strong moments of the video (native 720x1280).
console.log('Grabbing stills…');
const stills = { hero: 3.0, pack: 2.5, closeup: 4.9, poster: 3.0 };
for (const [name, t] of Object.entries(stills)) {
  ff(['-ss', String(t), '-i', SOURCE, '-frames:v', '1', `${TMP}/${name}.png`]);
}

// 3) Responsive webp + jpg for the photo blocks.
console.log('Optimizing images…');
for (const name of ['pack', 'closeup']) {
  for (const w of [480, 720]) {
    await sharp(`${TMP}/${name}.png`).resize({ width: w }).webp({ quality: 82 }).toFile(`${OUT}/${name}-${w}.webp`);
    await sharp(`${TMP}/${name}.png`).resize({ width: w }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/${name}-${w}.jpg`);
  }
}

// Video poster.
await sharp(`${TMP}/poster.png`).resize({ width: 720 }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/poster.jpg`);

// Social share image (1200x630).
const hero = await sharp(`${TMP}/hero.png`).resize({ width: 630, height: 630, fit: 'cover' }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 45, g: 20, b: 70 } } })
  .composite([{ input: hero, left: 285, top: 0 }]).jpeg({ quality: 84 }).toFile(`${OUT}/og.jpg`);

console.log('Done → ' + OUT);
