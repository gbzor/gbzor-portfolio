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
}

function currentView() {
  return window.location.hash.replace('#', '') || 'home';
}

showView(currentView());

window.addEventListener('hashchange', function () {
  showView(currentView());
});
