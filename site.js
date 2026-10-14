(function () {
  var root = document.documentElement;

  // Theme toggle (initial theme is applied inline in <head> to avoid a flash)
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Mobile menu
  var menuBtn = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Back to top
  var top = document.querySelector('.back-to-top');
  if (top) {
    window.addEventListener('scroll', function () {
      top.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    top.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
  }

  // News: show more / less
  var more = document.querySelector('[data-toggle-news]');
  var news = document.querySelector('.timeline');
  if (more && news) {
    more.addEventListener('click', function () {
      var collapsed = news.classList.toggle('is-collapsed');
      more.textContent = collapsed ? 'Show all news ↓' : 'Show less ↑';
    });
  }

  // Publication filters
  var filters = document.querySelectorAll('.filters button');
  if (filters.length) {
    var cards = document.querySelectorAll('[data-tags]');
    var years = document.querySelectorAll('.pub-year');
    var count = document.querySelector('.pub-count span');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        var n = 0;
        cards.forEach(function (c) {
          var show = f === 'all' || c.getAttribute('data-tags').split(' ').indexOf(f) !== -1;
          c.hidden = !show;
          if (show) n++;
        });
        years.forEach(function (y) {
          y.hidden = !y.querySelector('[data-tags]:not([hidden])');
        });
        if (count) count.textContent = n;
      });
    });
  }
})();
