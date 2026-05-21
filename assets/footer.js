/* ── Shared Footer ── */
(function () {
  var html = [
    '<footer class="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface-container-lowest h-10 flex items-center justify-between px-margin">',
    '  <span class="font-label-caps text-[10px] text-primary tracking-widest opacity-80">',
    '    &#169; <span id="footer-year"></span> DEVSEC_CORE // SYSTEM_STABLE',
    '  </span>',
    '  <div class="flex gap-6 font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">',
    '    <span class="opacity-40">SYS_LOGS</span>',
    '    <span class="opacity-40">API_DOCS</span>',
    '    <span class="opacity-40">STATUS_PAGE</span>',
    '  </div>',
    '</footer>',
  ].join('');

  document.currentScript.insertAdjacentHTML('beforebegin', html);
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}());
