/* Fast Slim+ — interactions: WhatsApp CTA, scroll reveal, video lightbox, sticky bar. */

// --- WhatsApp order link (single source of truth) ---
const WA_NUMBER = '962791514026';
const WA_TEXT = 'مرحبا، أريد طلب Fast Slim+';
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`;

document.querySelectorAll('[data-wa]').forEach((el) => {
  el.setAttribute('href', WA_URL);
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

// --- Current year in footer ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// --- Scroll reveal (respects reduced motion) ---
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
}

// --- Video lightbox ("شاهدي طريقة الاستخدام") ---
const lightbox = document.getElementById('videoLightbox');
const lbVideo = lightbox?.querySelector('.lightbox-video');
let lastFocused = null;

function openLightbox() {
  if (!lightbox) return;
  lastFocused = document.activeElement;
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add('open'));
  document.body.style.overflow = 'hidden';
  lbVideo?.play().catch(() => {});
  lightbox.querySelector('[data-video-close]')?.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lbVideo) { lbVideo.pause(); lbVideo.currentTime = 0; }
  setTimeout(() => { lightbox.hidden = true; }, 280);
  lastFocused?.focus?.();
}

document.querySelectorAll('[data-video-open]').forEach((b) => b.addEventListener('click', openLightbox));
document.querySelectorAll('[data-video-close]').forEach((b) => b.addEventListener('click', closeLightbox));
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox(); });

// --- Hero parallax (mouse depth + subtle scroll drift), motion-safe ---
const parallaxEls = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
  el,
  f: parseFloat(el.dataset.parallax) || 0,
  word: el.classList.contains('hero-word'),
}));
if (!reduceMotion && parallaxEls.length) {
  const hero = document.querySelector('.hero');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  let mx = 0, my = 0, sy = 0, ticking = false;

  const apply = () => {
    ticking = false;
    for (const { el, f, word } of parallaxEls) {
      const px = mx * f * 42;
      const py = my * f * 30 + (word ? sy * f * 2.2 : 0);
      el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
    }
  };
  const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };

  if (finePointer && hero) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      schedule();
    });
    hero.addEventListener('pointerleave', () => { mx = 0; my = 0; schedule(); });
  }
  // Subtle downward drift of the big background wordmark on scroll.
  window.addEventListener('scroll', () => { sy = Math.min(window.scrollY, 500); schedule(); }, { passive: true });
}

// --- Hide sticky CTA when the order/contact CTA is on screen (avoids double CTAs) ---
const sticky = document.querySelector('.sticky-cta');
const orderSection = document.getElementById('order');
if (sticky && orderSection && 'IntersectionObserver' in window) {
  const so = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      sticky.style.transform = e.isIntersecting ? 'translateY(120%)' : 'translateY(0)';
      sticky.style.transition = 'transform .35s cubic-bezier(.22,.61,.36,1)';
    }),
    { threshold: 0.2 }
  );
  so.observe(orderSection);
}
