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

/* ===== HERO BACKGROUND CODE TYPING (hero only) ===== */
const heroCode = document.querySelector('.hero-code');

if (heroCode) {
  const snippet = [
    'const dev = {',
    "  name: 'Gabriel Azor',",
    "  role: 'full-stack + data',",
    "  base: 'Philippines',",
    '};',
    '',
    'async function build(idea) {',
    '  const raw = await collect(idea);',
    '  const clean = transform(raw);',
    '  return ship(render(clean));',
    '}',
    '',
    'function transform(rows) {',
    '  return rows',
    '    .filter(row => row.valid)',
    '    .map(normalize);',
    '}',
    '',
    '// turn data into things people use',
    "build({ from: 'an idea' })",
    '  .then(launch)',
    '  .catch(retry);',
    ''
  ];

  const inner = document.createElement('div');
  inner.className = 'hero-code-inner';
  heroCode.appendChild(inner);

  const BLANK = '​'; // keep height on empty lines

  if (reduceMotion) {
    // Static, motion-free backdrop.
    snippet.forEach(function (text) {
      const line = document.createElement('div');
      line.className = 'hero-code-line';
      line.textContent = text || BLANK;
      inner.appendChild(line);
    });
  } else {
    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = null;

    function startLine() {
      currentLine = document.createElement('div');
      currentLine.className = 'hero-code-line';
      currentLine.textContent = BLANK;
      inner.appendChild(currentLine);
      // Trim the oldest lines once the column overflows — endless scroll.
      while (inner.offsetHeight > heroCode.clientHeight && inner.children.length > 1) {
        inner.removeChild(inner.firstChild);
      }
    }

    function step() {
      const text = snippet[lineIndex % snippet.length];
      if (currentLine === null) startLine();

      if (charIndex <= text.length) {
        currentLine.textContent = text.slice(0, charIndex) || BLANK;
        charIndex++;
        setTimeout(step, text ? 26 + Math.random() * 46 : 0);
      } else {
        currentLine.textContent = text || BLANK;
        currentLine = null;
        charIndex = 0;
        lineIndex++;
        setTimeout(step, 240 + Math.random() * 260);
      }
    }

    step();
  }
}
