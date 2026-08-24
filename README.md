# Fast Slim+ — Landing Site

Premium, mobile-first landing page for **Fast Slim+** by **Five Stars**, built for the
Jordan / Middle East audience. Arabic-first, right-to-left (RTL), with English product
and ingredient names rendered cleanly as LTR inside the Arabic text.

## Stack

- **Vite** (vanilla JS + CSS) — fast static build, no framework overhead.
- Google Fonts: **Tajawal** (Arabic) + **Manrope** (Latin wordmarks).
- Real product media extracted and optimized from the source product video
  (compressed `mp4` + `webm`, responsive `webp`/`jpg`, and a poster).

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run assets     # regenerate optimized media from the source video (see below)
```

## Structure

```
index.html                 # the page (all sections, RTL Arabic)
src/style.css              # design system + responsive layout
src/main.js                # WhatsApp CTA, scroll reveal, video lightbox, sticky bar
src/assets/media/          # optimized video, poster, responsive images (committed)
src/assets/favicon.svg
src/assets/reviews/        # ← drop real WhatsApp review screenshots here
scripts/process-assets.mjs # media pipeline (video → poster/stills → webp/jpg)
```

## Editing content

- **WhatsApp order number / message** — single source of truth in `src/main.js`
  (`WA_NUMBER`, `WA_TEXT`). All "اطلبي الآن" buttons use it.
- **Price** — edit in `index.html` (order section and contact price card). Currently
  `30 دينار أردني`.
- **Reviews** — the review grid uses labelled placeholder cards. Replace each with a
  real WhatsApp screenshot: add images under `src/assets/reviews/` and swap the
  placeholder bubble for an `<img>` in the reviews section of `index.html`.
- **Contact links** — WhatsApp / Instagram / Facebook are in the contact section.

## Media & Higgsfield asset slots

The optimized media is committed, so you only regenerate it when a source asset
changes. Every visual maps to a **swap slot** — drop a raw file (e.g. a Higgsfield
export) into `assets-src/` and re-run the pipeline:

```bash
# swap any subset — missing slots fall back to the product video
assets-src/hero.mp4        # hero cinematic loop  → fastslim.mp4/.webm + poster
assets-src/product.png     # clean product shot   → pack-* + og
assets-src/capsules.png    # capsule/detail shot  → closeup-*
assets-src/lifestyle.png   # premium lifestyle    → lifestyle-* (optional)

npm run assets             # regenerate optimized files in src/assets/media
npm run build
```

See **`src/assets/media/README.md`** for the full slot table, recommended
Higgsfield prompts, and how to wire the optional lifestyle band. The pipeline still
accepts a one-off video via `SOURCE=/path/to/video.mp4 npm run assets`.

Requires the dev dependencies `ffmpeg-static`, `ffprobe-static`, and `sharp`.

## Notes

- No horizontal scroll on mobile (verified 320–430px).
- Hero video uses muted autoplay + loop with a poster fallback.
- Scroll-reveal animations respect `prefers-reduced-motion`.
- Content is informational only — no medical claims.
