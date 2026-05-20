/* ── Common shell logic: clock · nav highlight · scramble ── */

// Live UTC clock
(function () {
  const el = document.getElementById('clock');
  if (!el) return;
  function tick() {
    el.textContent = new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
  }
  tick();
  setInterval(tick, 1000);
}());

// Highlight the active nav link based on current page filename
(function () {
  const file = location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.nav-link[data-page]').forEach(function (el) {
    if (el.dataset.page === file) el.classList.add('is-active');
  });
}());

// Scramble-to-reveal text animation for [data-scramble] elements
(function () {
  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@%&!?<>[]{}';

  function scramble(el) {
    var target = el.dataset.scramble || el.textContent.trim();
    var frame  = 0;
    var FRAMES = 20;
    var id = setInterval(function () {
      var out = '';
      for (var i = 0; i < target.length; i++) {
        if (target[i] === ' ') { out += ' '; continue; }
        if (i < Math.floor((frame / FRAMES) * target.length)) {
          out += target[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      el.textContent = out;
      if (++frame >= FRAMES) { el.textContent = target; clearInterval(id); }
    }, 42);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-scramble]').forEach(scramble);
  });
}());
