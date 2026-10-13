/* ══════════════════════════════════════════════════════════
   TrackMyFund — Loader v2.0
   Skeleton shimmer + spinner + page loader
   ══════════════════════════════════════════════════════════ */

window.TMFLoader = (() => {
  'use strict';

  // ── Full Page Loader ────────────────────────────────────
  function showPageLoader(message = 'Loading...') {
    if (document.getElementById('tmf-page-loader')) return;
    const el = document.createElement('div');
    el.id = 'tmf-page-loader';
    el.style.cssText = `
      position: fixed; inset: 0; z-index: 300;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 1rem;
      background: var(--glass-bg); backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      animation: fadeIn 0.2s ease-out;
    `;
    el.innerHTML = `
      <div style="display:flex;gap:6px;">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--primary);animation:dotPulse 1.2s ease-in-out infinite;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:var(--secondary);animation:dotPulse 1.2s ease-in-out 0.2s infinite;"></div>
        <div style="width:8px;height:8px;border-radius:50%;background:var(--accent);animation:dotPulse 1.2s ease-in-out 0.4s infinite;"></div>
      </div>
      <p style="font-size:0.875rem;color:var(--text-secondary);font-weight:500;">${message}</p>
    `;
    document.body.appendChild(el);
  }

  function hidePageLoader() {
    const el = document.getElementById('tmf-page-loader');
    if (el) {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.2s ease';
      setTimeout(() => el.remove(), 200);
    }
  }

  // ── Inline Spinner ──────────────────────────────────────
  function createSpinner(size = 'md') {
    const el = document.createElement('div');
    el.className = `loading-spinner${size === 'sm' ? ' loading-spinner-sm' : ''}`;
    return el;
  }

  // ── Skeleton Cards ──────────────────────────────────────
  function createSkeletonCards(count = 3, height = '120px') {
    const wrap = document.createElement('div');
    wrap.className = 'grid gap-4 stagger-children';
    wrap.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    for (let i = 0; i < count; i++) {
      const card = document.createElement('div');
      card.className = 'skeleton skeleton-card animate-fade-in-up';
      card.style.height = height;
      card.style.animationFillMode = 'both';
      wrap.appendChild(card);
    }
    return wrap;
  }

  // ── Skeleton Text Lines ─────────────────────────────────
  function createSkeletonText(lines = 3) {
    const wrap = document.createElement('div');
    const widths = ['long', 'medium', 'short', 'long', 'medium'];
    for (let i = 0; i < lines; i++) {
      const line = document.createElement('div');
      line.className = `skeleton skeleton-text ${widths[i % widths.length]}`;
      wrap.appendChild(line);
    }
    return wrap;
  }

  // ── Button Loading State ────────────────────────────────
  function setButtonLoading(btn, loading, originalText) {
    if (!btn) return;
    if (loading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `
        <div class="loading-spinner loading-spinner-sm" style="border-top-color:currentColor;border-color:rgba(255,255,255,0.3);"></div>
        <span>${originalText || 'Loading...'}</span>
      `;
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.originalText || originalText || btn.innerHTML;
    }
  }

  return {
    showPageLoader,
    hidePageLoader,
    createSpinner,
    createSkeletonCards,
    createSkeletonText,
    setButtonLoading,
  };
})();