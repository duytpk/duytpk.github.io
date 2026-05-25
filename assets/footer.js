/* ── Shared Footer ── */
(function () {
  var html = [
    '<footer class="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface-container-lowest h-10 flex items-center px-margin">',
    '  <span class="font-label-caps text-[10px] text-primary tracking-widest opacity-80">',
    '    &#169; <span id="footer-year"></span> DuyTPK\'s hub',
    '  </span>',
    '</footer>',
  ].join('');

  document.currentScript.insertAdjacentHTML('beforebegin', html);
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}());
