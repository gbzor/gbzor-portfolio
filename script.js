/* ===== THEME TOGGLE ===== */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function preferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  const meta = theme === 'dark' ? '#15140f' : '#f5f2ec';
  document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
    m.setAttribute('content', meta);
  });
}

applyTheme(preferredTheme());

themeToggle.addEventListener('click', function () {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

/* ===== NAV BORDER ON SCROLL ===== */
const nav = document.getElementById('nav');

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 8);
}

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== REVEAL ON SCROLL ===== */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('.section, .hero');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
} else {
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(function (el) { observer.observe(el); });
}
