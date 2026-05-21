/* ── Shared Footer ── */
(function () {
  var html = [
    '<footer class="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface-container-lowest h-10 flex items-center justify-between px-margin">',
    '  <span class="font-label-caps text-[10px] text-primary tracking-widest opacity-80">',
    '    &#169; <span id="footer-year"></span> DEVSEC_CORE // SYSTEM_STABLE',
    '  </span>',
    '  <div class="flex gap-6 font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">',
    '    <a href="#" class="hover:text-primary transition-colors">SYS_LOGS</a>',
    '    <a href="#" class="hover:text-primary transition-colors">API_DOCS</a>',
    '    <a href="#" class="hover:text-primary transition-colors">STATUS_PAGE</a>',
    '  </div>',
    '</footer>',
  ].join('');

  document.currentScript.insertAdjacentHTML('beforebegin', html);
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}());
