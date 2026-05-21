/* ── Shared Top App Bar — logo left · nav centered ── */
(function () {
  var page = location.pathname.split('/').pop().replace('.html', '') || 'index';

  var ACTIVE   = 'text-primary font-bold border-b-2 border-primary pb-1 active-nav-glow animate-glitch hover-glitch relative';
  var INACTIVE = 'text-on-surface-variant font-normal hover:text-primary transition-colors duration-150 cursor-pointer active:scale-95';

  function link(href, label, key) {
    return '<a href="' + href + '" class="' + (page === key ? ACTIVE : INACTIVE) + '">' + label + '</a>';
  }

  var html = [
    '<header class="fixed top-0 left-0 right-0 z-50 border-b border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md h-16 flex items-center px-margin">',
    '  <div class="w-full grid grid-cols-3 items-center h-full">',
    '    <span class="font-display-lg text-headline-md text-primary tracking-tighter neon-text-cyan">DS_OPS // HUB</span>',
    '    <nav class="hidden md:flex justify-center gap-8 font-body-md text-body-md uppercase tracking-[0.2em]">',
         link('index.html',   'DASHBOARD', 'index'),
         link('roadmap.html', 'ROADMAP',   'roadmap'),
    '    </nav>',
    '    <div></div>',
    '  </div>',
    '</header>',
  ].join('');

  document.currentScript.insertAdjacentHTML('beforebegin', html);
}());
