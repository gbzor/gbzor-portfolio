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

function typewrite() {
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

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ===== DOCK ACTIVE STATE ===== */
const dockItems = document.querySelectorAll('.dock-item[href^="#"]');
const sections = document.querySelectorAll('section[id]');

function updateActiveDock() {
  const scrollY = window.scrollY + window.innerHeight / 2;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      dockItems.forEach((item) => item.classList.remove('active'));
      const activeItem = document.querySelector(`.dock-item[href="#${id}"]`);
      if (activeItem) activeItem.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveDock, { passive: true });

/* ===== SMOOTH SCROLL FOR DOCK LINKS ===== */
dockItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(item.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== SCROLL TO TOP BUTTON ===== */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== SECTION REVEAL ON SCROLL ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach((section) => {
  observer.observe(section);
});

/* ===== CONTACT FORM (placeholder handler) ===== */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // EDIT: Replace this with your actual form submission logic
  // Options: Formspree, EmailJS, Netlify Forms, custom backend, etc.
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  console.log('Form submitted:', data);

  alert('Thanks for your message! (Connect a form service to make this work)');
  contactForm.reset();
});

/* ===== DOCK MAGNIFICATION EFFECT ===== */
const dockContainer = document.querySelector('.dock-container');

dockContainer.addEventListener('mousemove', (e) => {
  const items = dockContainer.querySelectorAll('.dock-item');
  const rect = dockContainer.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;

  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenter = itemRect.left + itemRect.width / 2 - rect.left;
    const distance = Math.abs(mouseX - itemCenter);
    const maxDistance = 120;

    if (distance < maxDistance) {
      const scale = 1 + 0.15 * (1 - distance / maxDistance);
      const lift = -4 * (1 - distance / maxDistance);
      item.style.transform = `translateY(${lift}px) scale(${scale})`;
    } else {
      item.style.transform = '';
    }
  });
});

dockContainer.addEventListener('mouseleave', () => {
  const items = dockContainer.querySelectorAll('.dock-item');
  items.forEach((item) => {
    item.style.transform = '';
  });
});
