/* ===== TYPEWRITER EFFECT ===== */
const typewriterEl = document.getElementById('typewriter');
const roles = [
  'Student',
  'Aspiring Full-Stack Developer',
  'Data Engineer',
  'Problem Solver'
  // EDIT: Add more roles here
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const TYPING_SPEED = 70;
const DELETING_SPEED = 40;
const PAUSE_AFTER_TYPING = 2000;
const PAUSE_AFTER_DELETING = 500;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function typewrite() {
  if (prefersReducedMotion.matches) {
    typewriterEl.textContent = roles[roleIndex];
    return;
  }

  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typewriterEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typewrite, PAUSE_AFTER_TYPING);
      return;
    }
    setTimeout(typewrite, TYPING_SPEED);
  } else {
    typewriterEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typewrite, PAUSE_AFTER_DELETING);
      return;
    }
    setTimeout(typewrite, DELETING_SPEED);
  }
}

typewrite();

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function getDefaultTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

html.setAttribute('data-theme', getDefaultTheme());

function updateMetaThemeColor(theme) {
  const color = theme === 'dark' ? '#0c0f14' : '#f5f0e8';
  document.querySelectorAll('meta[name="theme-color"]').forEach(function(meta) {
    meta.setAttribute('content', color);
  });
}

updateMetaThemeColor(getDefaultTheme());

themeToggle.addEventListener('click', function() {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateMetaThemeColor(next);
});

/* ===== THROTTLE UTILITY ===== */
function throttle(fn, ms) {
  let lastCall = 0;
  let timer = null;
  return function() {
    var now = Date.now();
    var remaining = ms - (now - lastCall);
    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastCall = now;
      fn();
    } else if (!timer) {
      timer = setTimeout(function() {
        lastCall = Date.now();
        timer = null;
        fn();
      }, remaining);
    }
  };
}

/* ===== DOCK ACTIVE STATE ===== */
var dockItems = document.querySelectorAll('.dock-item[href^="#"]');
var sections = document.querySelectorAll('section[id]');

function updateActiveDock() {
  var scrollY = window.scrollY + window.innerHeight / 2;

  sections.forEach(function(section) {
    var top = section.offsetTop;
    var height = section.offsetHeight;
    var id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      dockItems.forEach(function(item) { item.classList.remove('active'); });
      var activeItem = document.querySelector('.dock-item[href="#' + id + '"]');
      if (activeItem) activeItem.classList.add('active');
    }
  });
}

window.addEventListener('scroll', throttle(updateActiveDock, 100), { passive: true });

/* ===== SMOOTH SCROLL FOR DOCK LINKS ===== */
dockItems.forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(item.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== SCROLL TO TOP BUTTON ===== */
var scrollTopBtn = document.getElementById('scrollTop');

var handleScrollVisibility = throttle(function() {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, 100);

window.addEventListener('scroll', handleScrollVisibility, { passive: true });

scrollTopBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== SECTION REVEAL ON SCROLL ===== */
var observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px -30px 0px'
};

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach(function(section) {
  observer.observe(section);
});

/* ===== CONTACT FORM (placeholder handler) ===== */
var contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // EDIT: Replace this with your actual form submission logic
  // Options: Formspree, EmailJS, Netlify Forms, custom backend, etc.
  var formData = new FormData(contactForm);
  var data = Object.fromEntries(formData);
  console.log('Form submitted:', data);

  alert('Thanks for your message! (Connect a form service to make this work)');
  contactForm.reset();
});

/* ===== DOCK MAGNIFICATION EFFECT (pointer devices only) ===== */
var dockContainer = document.querySelector('.dock-container');
var isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (!isTouchDevice) {
  dockContainer.addEventListener('mousemove', function(e) {
    var items = dockContainer.querySelectorAll('.dock-item');
    var rect = dockContainer.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;

    items.forEach(function(item) {
      var itemRect = item.getBoundingClientRect();
      var itemCenter = itemRect.left + itemRect.width / 2 - rect.left;
      var distance = Math.abs(mouseX - itemCenter);
      var maxDistance = 120;

      if (distance < maxDistance) {
        var scale = 1 + 0.15 * (1 - distance / maxDistance);
        var lift = -4 * (1 - distance / maxDistance);
        item.style.transform = 'translateY(' + lift + 'px) scale(' + scale + ')';
      } else {
        item.style.transform = '';
      }
    });
  });

  dockContainer.addEventListener('mouseleave', function() {
    var items = dockContainer.querySelectorAll('.dock-item');
    items.forEach(function(item) {
      item.style.transform = '';
    });
  });
}

/* ===== HANDLE ORIENTATION CHANGE / RESIZE ===== */
var resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    updateActiveDock();
  }, 250);
}, { passive: true });
