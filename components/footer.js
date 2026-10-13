/* ══════════════════════════════════════════════════════════
   TrackMyFund — Footer v2.0
   Minimal footer (desktop only, hidden on mobile)
   ══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  function init() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    container.innerHTML = `
      <footer class="desktop-only" style="
        text-align: center;
        padding: 1.5rem 1rem;
        font-size: 0.75rem;
        color: var(--text-tertiary);
        border-top: 1px solid var(--border-light);
        margin-top: 2rem;
      ">
        <p>&copy; ${new Date().getFullYear()} TrackMyFund &mdash; Built with ❤️</p>
      </footer>
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();