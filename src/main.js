/* Fast Slim+ — cinematic interactions
   WhatsApp CTA · scroll-driven traveling bottle · parallax · reveal · counters */

/* ---------------- WhatsApp (single source of truth) ---------------- */
const WA_NUMBER = '962791514026';                 // +962 7 9151 4026 — official orders
const WA_TEXT   = 'مرحباً، أريد طلب Fast Slim+ 🌿';
const WA_URL    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`;

document.querySelectorAll('[data-wa]').forEach((el) => {
  el.setAttribute('href', WA_URL);
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

/* ---------------- Year ---------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Scroll reveal ---------------- */
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => io.observe(el));
}

/* ---------------- Header scrolled state + sticky CTA ---------------- */
const header = document.querySelector('.site-header');
const sticky = document.querySelector('.sticky-cta');
function onScrollChrome() {
  const y = window.scrollY;
  if (header) header.classList.toggle('scrolled', y > 40);
  if (sticky) sticky.classList.toggle('show', y > window.innerHeight * 0.9);
}

/* ---------------- Counter animation ---------------- */
const counters = document.querySelectorAll('[data-count]');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const dur = 1200; const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toString();
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cio.observe(c));
}

/* ---------------- Traveling bottle choreography ----------------
   The REAL Fast Slim+ bottle is a fixed layer that travels across
   the experience: it moves, scales and tilts as sections scroll by. */
const bottle = document.getElementById('travelBottle');
const anchorDefs = [
  ['hero',        { x: 0,   y: 15, s: 0.92, rz: -3, op: 1 }],
  ['trust',       { x: 0,   y: -6, s: 0.55, rz: -3, op: 0 }],   // fade out (up/small) over the stats strip
  ['benefits',    { x: -26, y: 0,  s: 0.82, rz: 6,  op: 1 }],   // left spacer column
  ['ingredients', { x: -26, y: 0,  s: 0.70, rz: 2,  op: 0 }],   // stay left, fade out over centered cards
  ['usage',       { x: -26, y: 0,  s: 0.82, rz: 5,  op: 1 }],   // left spacer column
  ['pack',        { x: -26, y: 0,  s: 0.66, rz: -2, op: 0 }],   // fade out before the real photo takes over
];
const anchors = anchorDefs
  .map(([id, t]) => { const el = document.getElementById(id); return el ? { el, t } : null; })
  .filter(Boolean);

let mouseX = 0, mouseY = 0;
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });
}

const lerp = (a, b, t) => a + (b - a) * t;
function centerOf(el) { return el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2; }

function updateBottle() {
  if (!bottle || anchors.length === 0) return;
  const y = window.scrollY;
  let cur;
  const firstC = centerOf(anchors[0].el);
  const lastC = centerOf(anchors[anchors.length - 1].el);
  if (y <= firstC) {
    cur = anchors[0].t;
  } else if (y >= lastC) {
    cur = anchors[anchors.length - 1].t;
  } else {
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = centerOf(anchors[i].el), b = centerOf(anchors[i + 1].el);
      if (y >= a && y <= b) {
        const t = (y - a) / Math.max(b - a, 1);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOut
        const A = anchors[i].t, B = anchors[i + 1].t;
        cur = {
          x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e),
          s: lerp(A.s, B.s, e), rz: lerp(A.rz, B.rz, e), op: lerp(A.op, B.op, e),
        };
        break;
      }
    }
  }
  if (!cur) return;
  const px = mouseX * 14, py = mouseY * 12;   // subtle mouse parallax
  const ry = mouseX * 10 + cur.x * 0.25;      // 3D turn
  bottle.style.transform =
    `translate(calc(-50% + ${cur.x}vw + ${px}px), calc(-50% + ${cur.y}vh + ${py}px)) ` +
    `scale(${cur.s.toFixed(3)}) rotateY(${ry.toFixed(1)}deg) rotate(${cur.rz.toFixed(1)}deg)`;
  bottle.style.opacity = cur.op.toFixed(2);
}

/* ---------------- Parallax capsules ---------------- */
const parallaxEls = document.querySelectorAll('[data-parallax]');
function updateParallax() {
  const y = window.scrollY;
  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.1;
    el.style.transform = `translateY(${(y * speed).toFixed(1)}px)`;
  });
}

/* ---------------- rAF scroll loop ---------------- */
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    onScrollChrome();
    if (!reduceMotion) { updateBottle(); updateParallax(); }
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => { onScrollChrome(); if (!reduceMotion) updateBottle(); });
if (!reduceMotion) {
  // mouse-driven idle refresh so parallax reacts even without scroll
  let idleRAF;
  function idle() { updateBottle(); idleRAF = requestAnimationFrame(idle); }
  if (window.matchMedia('(pointer:fine)').matches) idle();
}
onScrollChrome();
updateBottle();

/* ---------------- Video lightbox ---------------- */
const lightbox = document.getElementById('videoLightbox');
const lbVideo = lightbox ? lightbox.querySelector('video') : null;
document.querySelectorAll('[data-video-open]').forEach((b) =>
  b.addEventListener('click', () => {
    if (!lightbox) return;
    lightbox.hidden = false;
    if (lbVideo) { lbVideo.currentTime = 0; lbVideo.play().catch(() => {}); }
    document.body.style.overflow = 'hidden';
  })
);
function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  if (lbVideo) lbVideo.pause();
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-video-close]').forEach((b) => b.addEventListener('click', closeLightbox));
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
