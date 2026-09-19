/* ══════════════════════════════════════════════════════════
   TrackMyFund — Toast Notification v2.0
   Glass-style toasts with colored borders
   ══════════════════════════════════════════════════════════ */

window.TMFNotify = (() => {
  'use strict';

  const ICONS = {
    success: 'check_circle',
    error:   'error',
    warning: 'warning',
    info:    'info',
  };

  let container = null;

  function getContainer() {
    if (container && document.body.contains(container)) return container;
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'tmf-toast-container';
    document.body.appendChild(container);
    return container;
  }

  function show(message, type = 'info', duration = 4000) {
    const c = getContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
      <span class="material-icons-outlined toast-icon">${ICONS[type] || ICONS.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close">
        <span class="material-icons-outlined" style="font-size:1rem;">close</span>
      </button>
    `;

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => dismiss(toast));

    c.appendChild(toast);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => dismiss(toast), duration);
    }

    return toast;
  }

  function dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }

  // Convenience methods
  function success(msg, dur) { return show(msg, 'success', dur); }
  function error(msg, dur)   { return show(msg, 'error', dur); }
  function warning(msg, dur) { return show(msg, 'warning', dur); }
  function info(msg, dur)    { return show(msg, 'info', dur); }

  return { show, dismiss, success, error, warning, info };
})();

// Backward compatibility
function showNotification(msg, type = 'info') {
  if (window.TMFNotify) window.TMFNotify.show(msg, type);
}