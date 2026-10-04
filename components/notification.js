/* ══════════════════════════════════════════════════════════
   TrackMyFund — Toast Notification (coss.com/ui rebuild)
   Uses .coss-toast pattern with icon, title, desc, close
   ══════════════════════════════════════════════════════════ */

window.TMFNotify = (() => {
  'use strict';

  const ICONS = {
    success: 'check_circle',
    error:   'error',
    warning: 'warning_amber',
    info:    'info',
  };

  let container = null;

  function getContainer() {
    if (container && document.body.contains(container)) return container;
    container = document.createElement('div');
    container.className = 'coss-toast-container';
    container.id = 'tmf-toast-container';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
    return container;
  }

  function show(message, type = 'info', duration = 4200) {
    const c = getContainer();
    const toast = document.createElement('div');
    toast.className = `coss-toast coss-toast-${type}`;
    toast.setAttribute('role', 'alert');

    toast.innerHTML = `
      <div class="coss-toast-icon">
        <span class="material-icons-outlined" style="font-size:1.125rem;">${ICONS[type] || ICONS.info}</span>
      </div>
      <div class="coss-toast-body">
        <div class="coss-toast-title">${message}</div>
      </div>
      <button class="coss-toast-close" aria-label="Close">
        <span class="material-icons-outlined" style="font-size:1rem;">close</span>
      </button>
    `;

    toast.querySelector('.coss-toast-close').addEventListener('click', () => dismiss(toast));
    c.appendChild(toast);

    if (duration > 0) setTimeout(() => dismiss(toast), duration);
    return toast;
  }

  function showDetailed(title, description, type = 'info', duration = 5000) {
    const c = getContainer();
    const toast = document.createElement('div');
    toast.className = `coss-toast coss-toast-${type}`;
    toast.setAttribute('role', 'alert');

    toast.innerHTML = `
      <div class="coss-toast-icon">
        <span class="material-icons-outlined" style="font-size:1.125rem;">${ICONS[type] || ICONS.info}</span>
      </div>
      <div class="coss-toast-body">
        <div class="coss-toast-title">${title}</div>
        ${description ? `<div class="coss-toast-desc">${description}</div>` : ''}
      </div>
      <button class="coss-toast-close" aria-label="Close">
        <span class="material-icons-outlined" style="font-size:1rem;">close</span>
      </button>
    `;

    toast.querySelector('.coss-toast-close').addEventListener('click', () => dismiss(toast));
    c.appendChild(toast);
    if (duration > 0) setTimeout(() => dismiss(toast), duration);
    return toast;
  }

  function dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('dismissing');
    setTimeout(() => toast.remove(), 280);
  }

  function success(msg, dur) { return show(msg, 'success', dur); }
  function error(msg, dur)   { return show(msg, 'error', dur); }
  function warning(msg, dur) { return show(msg, 'warning', dur); }
  function info(msg, dur)    { return show(msg, 'info', dur); }

  return { show, showDetailed, dismiss, success, error, warning, info };
})();

// Backward-compatible global
function showNotification(msg, type = 'info') {
  if (window.TMFNotify) window.TMFNotify.show(msg, type);
}