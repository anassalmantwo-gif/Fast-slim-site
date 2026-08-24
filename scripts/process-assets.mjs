/**
 * Asset pipeline for Fast Slim+.
 *
 * Turns raw product media (the source video and/or high-res Higgsfield exports)
 * into the optimized web assets that the site references. Outputs are committed to
 * src/assets/media, so you only run this when a source asset changes.
 *
 * ── Swap slots ──────────────────────────────────────────────────────────────
 * Drop a file into ./assets-src/ (create the folder) and re-run `npm run assets`.
 * Each slot below is optional; if its source is missing it falls back to a frame
 * grabbed from the product video, so the site always has valid media.
 *
 *   assets-src/hero.mp4        → fastslim.mp4 + fastslim.webm  (hero cinematic loop)
 *   assets-src/poster.(png|jpg)→ poster.jpg                    (hero video poster)
 *   assets-src/product.(png|jpg)→ pack-480/720 .webp/.jpg      (clean product shot)
 *   assets-src/capsules.(png|jpg)→ closeup-480/720 .webp/.jpg  (capsule / detail shot)
 *   assets-src/lifestyle.(png|jpg)→ lifestyle-480/720/1080 .webp/.jpg (lifestyle scene)
 *   assets-src/og.(png|jpg)    → og.jpg                        (social share, 1200x630)
 *
 * The base product video (for fallbacks / hero) is assets-src/hero.mp4, or set
 *   SOURCE=/path/to/video.mp4 npm run assets
 *
 * Requires the devDependencies ffmpeg-static, ffprobe-static and sharp.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const OUT = 'src/assets/media';
const SRC = 'assets-src';
const TMP = '.asset-tmp';
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const ff = (args) => execFileSync(ffmpegPath, ['-y', ...args, '-loglevel', 'error'], { stdio: 'inherit' });

// Return the first existing path for a slot, trying .png then .jpg then .jpeg.
const find = (base, exts = ['png', 'jpg', 'jpeg']) => {
  for (const e of exts) { const p = `${SRC}/${base}.${e}`; if (existsSync(p)) return p; }
  return null;
};

const VIDEO = process.env.SOURCE || (existsSync(`${SRC}/hero.mp4`) ? `${SRC}/hero.mp4` : null);

// ── 1) Hero video (mp4 + webm) ────────────────────────────────────────────────
if (VIDEO) {
  console.log(`Encoding hero video from ${VIDEO}…`);
  ff(['-i', VIDEO, '-an', '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-crf', '26', '-preset', 'slow', '-movflags', '+faststart', '-vf', 'scale=720:1280',
      `${OUT}/fastslim.mp4`]);
  ff(['-i', VIDEO, '-an', '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-vf', 'scale=720:1280',
      `${OUT}/fastslim.webm`]);
} else {
  console.log('No hero video source — keeping existing fastslim.mp4/.webm.');
}

// Grab a still from the video (used as fallback for image slots + poster).
const grab = (name, t) => {
  if (!VIDEO) return null;
  const out = `${TMP}/${name}.png`;
  ff(['-ss', String(t), '-i', VIDEO, '-frames:v', '1', out]);
  return out;
};

// ── 2) Responsive image slots ─────────────────────────────────────────────────
async function responsive(source, name, widths) {
  if (!source) { console.log(`Skip ${name} (no source).`); return; }
  for (const w of widths) {
    await sharp(source).resize({ width: w }).webp({ quality: 82 }).toFile(`${OUT}/${name}-${w}.webp`);
    await sharp(source).resize({ width: w }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/${name}-${w}.jpg`);
  }
  console.log(`✓ ${name} (${widths.join(', ')})`);
}

await responsive(find('product') || grab('pack', 2.5), 'pack', [480, 720]);
await responsive(find('capsules') || grab('closeup', 4.9), 'closeup', [480, 720]);
// Lifestyle: only emitted when a source is provided (future/optional slot).
await responsive(find('lifestyle'), 'lifestyle', [480, 720, 1080]);

// ── 3) Poster ─────────────────────────────────────────────────────────────────
const posterSrc = find('poster') || grab('poster', 3.0);
if (posterSrc) {
  await sharp(posterSrc).resize({ width: 720 }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/poster.jpg`);
  console.log('✓ poster');
}

// ── 4) Social share image (1200x630) ──────────────────────────────────────────
const ogSlot = find('og');
if (ogSlot) {
  await sharp(ogSlot).resize({ width: 1200, height: 630, fit: 'cover' }).jpeg({ quality: 84 }).toFile(`${OUT}/og.jpg`);
  console.log('✓ og (from slot)');
} else {
  const heroStill = find('product') || grab('hero', 3.0);
  if (heroStill) {
    const sq = await sharp(heroStill).resize({ width: 630, height: 630, fit: 'cover' }).png().toBuffer();
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 45, g: 20, b: 70 } } })
      .composite([{ input: sq, left: 285, top: 0 }]).jpeg({ quality: 84 }).toFile(`${OUT}/og.jpg`);
    console.log('✓ og (composed)');
  }
}

console.log('Done → ' + OUT);
