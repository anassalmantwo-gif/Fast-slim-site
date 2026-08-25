# Fast Slim+ — Cinematic Brand Experience

A premium, cinematic **single-product** website for **Fast Slim+** by **Five Stars**,
built for the Jordan / Middle East audience. Arabic-first, right-to-left (RTL), with a
scroll-driven 3D product experience.

Reference synthesis: **AG1** structure + **Seed** restraint + **AuraFlow** cinematic depth.
The **real Fast Slim+ bottle** is the hero of the whole experience and is never redesigned.

## Stack

- **Vite** (vanilla JS + CSS) — fast static build, no framework overhead.
- Google Fonts: **Tajawal** (Arabic) + **Manrope** (Latin wordmarks), with system fallbacks.
- **Higgsfield-generated** cinematic assets + the real product media.

## Key experience

- Fixed **traveling bottle** layer (`#travelBottle`) that moves, scales and tilts across
  sections on scroll (`src/main.js`), with mouse parallax on desktop.
- Floating blue/white **capsules** (pure CSS), parallax, glass cards, cinematic full-screen
  sections, premium micro-animations. All motion respects `prefers-reduced-motion`.
- Single conversion everywhere: **WhatsApp order → +962 7 9151 4026**, persistent sticky CTA on mobile.

## Assets

```
src/assets/hf/bottle.webp   # REAL bottle, background removed (Higgsfield) — the traveling hero
src/assets/hf/bg0.webp      # cinematic god-ray atmosphere (Higgsfield) — hero background
src/assets/hf/bg1.webp      # cosmic purple atmosphere (Higgsfield) — ingredients background
src/assets/media/           # real product photos + video (poster, pack, closeup, mp4/webm)
src/assets/reviews/         # ← drop real WhatsApp review screenshots here
```

The real bottle cutout and the two backgrounds were produced with the connected Higgsfield
tools from the original packaging photos; the packaging itself is preserved exactly.

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Editing content

- **WhatsApp order number / message** — single source of truth in `src/main.js`
  (`WA_NUMBER = '962791514026'`, `WA_TEXT`). Every "اطلبي الآن" button uses it.
- **Price** — `30 دينار أردني`, in `index.html` (order card + contact price card).
- **Ingredients** (confirmed): Caffeine · EGCG / Green Tea Extract · Guarana · Yohimbine ·
  Synephrine · Capsaicin — in the Ingredients section of `index.html`.
- **Usage**: كبسولة واحدة صباحاً (1 capsule in the morning).
- **Reviews** — the review grid uses **clearly-marked placeholder** cards (no invented
  reviews). Replace each with a real WhatsApp screenshot: add images under
  `src/assets/reviews/` and swap the placeholder bubble for an `<img>` in the reviews section.
- **Contacts** — WhatsApp `+962 7 9151 4026` and Instagram `@fastslim.global` only.

## Notes

- No horizontal scroll on mobile; RTL Arabic layout with LTR English names rendered cleanly.
- Content is informational only — **no medical claims**, no invented product facts.
- Sticky WhatsApp CTA on mobile; video lightbox for the product clip.
