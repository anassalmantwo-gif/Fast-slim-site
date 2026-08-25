# Media slots — Fast Slim+

Every visual on the site comes from one of the slots below. To replace any of them
(e.g. with a **Higgsfield** export), drop the raw file into `assets-src/` with the
listed name and run `npm run assets`. The script regenerates the optimized files here
and the site picks them up on the next `npm run build`. If a slot's source is missing,
it falls back to a frame from the product video, so the site always has valid media.

| Slot file (drop in `assets-src/`) | Generates | Used in | Recommended Higgsfield asset |
|---|---|---|---|
| `bottle-cutout.webp` / `.png` | *(committed directly)* | **Hero** — the free-floating 3D-style bottle | **Transparent product cut-out** of the bottle (no background). Currently derived from the product video via local background removal. Replace with a clean cut-out of the **bottle-on-white** photo for best sharpness — just drop a transparent PNG here (and re-export a `.webp`). |
| `hero.mp4` | `fastslim.mp4`, `fastslim.webm`, `poster.jpg` | Video lightbox (شاهدي الفيديو / About Us) | **Product cinematic loop** — slow push-in on the Fast Slim+ bottle, soft studio light, subtle water droplets. Vertical 720×1280, 4–6 s, seamless loop, no text. |
| `product.png` | `pack-480/720.webp/.jpg` + `og.jpg` | "العبوة الأصلية" block | **Clean product shot** — the sealed bottle on a soft gradient, front label crisp and centered. ≥ 1080×1920, PNG. |
| `capsules.png` | `closeup-480/720.webp/.jpg` | "طريقة الاستخدام" block | **Close-up detail** — capsules / cap / label macro, shallow depth of field. ≥ 1080×1920, PNG. |
| `lifestyle.png` | `lifestyle-480/720/1080.webp/.jpg` | *(optional, ready to wire — see below)* | **Premium lifestyle scene** — the packaging in an elegant real setting (marble, morning light, glass of water). ≥ 1620×1080, PNG. |
| `poster.png` | `poster.jpg` | Hero video poster | Optional override; otherwise taken from `hero.mp4`. |
| `og.png` | `og.jpg` (1200×630) | Social share meta | Optional override; otherwise composed from `product`. |

## Design direction for new assets

Keep it a *premium product presentation*, not a stock "wellness" template:

- Brand palette from the packaging: **deep purple, white, cyan/teal accent, hints of silver**.
- Real product focus — the actual Fast Slim+ bottle, no plastic 3D capsules for effect.
- Clean composition, soft cinematic light, generous negative space, gentle motion.
- Vertical framing (9:16) for hero/product; horizontal (3:2) for the lifestyle scene.

## Wiring the lifestyle slot (when ready)

The lifestyle images are generated but not yet placed, to keep the current structure.
To add a full-width lifestyle band, insert this between two sections in `index.html`:

```html
<section class="section lifestyle-band" aria-hidden="true">
  <div class="container">
    <picture>
      <source type="image/webp" srcset="./src/assets/media/lifestyle-720.webp 720w, ./src/assets/media/lifestyle-1080.webp 1080w" sizes="100vw" />
      <img src="./src/assets/media/lifestyle-1080.jpg" loading="lazy" decoding="async"
           width="1620" height="1080" alt="مشهد لعبوة Fast Slim+ ضمن نمط حياة راقٍ" />
    </picture>
  </div>
</section>
```
