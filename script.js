/* ===== VIEW ROUTING (Home / Projects / Tools / Contact) ===== */
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
const validViews = ['home', 'projects', 'tools', 'contact'];

function showView(name) {
  const view = validViews.includes(name) ? name : 'home';

  views.forEach(function (section) {
    section.hidden = section.dataset.view !== view;
  });

  navItems.forEach(function (item) {
    item.classList.toggle('active', item.dataset.view === view);
  });

  if (view === 'tools') buildTickers();
}

function currentView() {
  return window.location.hash.replace('#', '') || 'home';
}

/* ===== TOOLS MARQUEE =====
   Repeat each list until one copy is wider than its row, then double it so
   translating by -50% loops seamlessly. Built only when the view is visible
   (hidden rows have no width to measure). */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tickers = document.querySelectorAll('.ticker');
const PX_PER_SECOND = 55;

tickers.forEach(function (ticker) {
  const ul = ticker.querySelector('ul');
  const items = Array.from(ul.children).map(function (li) { return li.textContent; });
  ticker.dataset.items = JSON.stringify(items);

  // Screen readers get one clean list; the moving copies are hidden from them.
  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = ticker.dataset.label + ': ' + items.join(', ');
  ticker.prepend(label);
  ul.setAttribute('aria-hidden', 'true');
});

function buildTickers() {
  if (reduceMotion) return;

  tickers.forEach(function (ticker) {
    const ul = ticker.querySelector('ul');
    const items = JSON.parse(ticker.dataset.items);
    const rowWidth = ticker.clientWidth;
    if (!rowWidth) return;

    const html = items.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    let half = html;
    ul.innerHTML = half;
    while (ul.scrollWidth < rowWidth) {
      half += html;
      ul.innerHTML = half;
    }
    const halfWidth = ul.scrollWidth;
    ul.innerHTML = half + half;
    ul.style.setProperty('--dur', (halfWidth / PX_PER_SECOND).toFixed(1) + 's');
  });
}

let resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    if (currentView() === 'tools') buildTickers();
  }, 200);
});

/* ===== COPY EMAIL ===== */
const copyBtn = document.querySelector('.copy-btn');

if (copyBtn) {
  copyBtn.addEventListener('click', function () {
    const text = copyBtn.dataset.copy;
    const done = function () {
      copyBtn.textContent = 'copied ✓';
      copyBtn.classList.add('copied');
      setTimeout(function () {
        copyBtn.textContent = 'copy email';
        copyBtn.classList.remove('copied');
      }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        window.location.href = 'mailto:' + text;
      });
    } else {
      window.location.href = 'mailto:' + text;
    }
  });
}

/* ===== INIT ===== */
showView(currentView());

window.addEventListener('hashchange', function () {
  showView(currentView());
});
