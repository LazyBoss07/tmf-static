/* ══════════════════════════════════════════════════════════
   TrackMyFund — Multi-Theme Switcher
   Reads/writes data-theme on <html> and persists to localStorage.
   Renders the theme picker dropdown in the sidebar footer.
   ══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── Theme Catalogue ─────────────────────────────────── */
  const THEMES = [
    /* name,    label,        swatch color (light-mode primary) */
    { id: 'default',  label: 'Obsidian',  swatch: '#101010' },
    { id: 'zinc',     label: 'Zinc',      swatch: '#18181b' },
    { id: 'slate',    label: 'Slate',     swatch: '#0f172a' },
    { id: 'neutral',  label: 'Neutral',   swatch: '#171717' },
    { id: 'rose',     label: 'Rose',      swatch: '#e11d48' },
    { id: 'orange',   label: 'Orange',    swatch: '#ea580c' },
    { id: 'green',    label: 'Green',     swatch: '#16a34a' },
    { id: 'teal',     label: 'Teal',      swatch: '#0d9488' },
    { id: 'blue',     label: 'Blue',      swatch: '#2563eb' },
    { id: 'violet',   label: 'Violet',    swatch: '#7c3aed' },
    { id: 'yellow',   label: 'Yellow',    swatch: '#ca8a04' },
    { id: 'red',      label: 'Red',       swatch: '#dc2626' },
  ];

  const STORAGE_KEY = 'tmf-color-theme';

  /* ── Persistence ─────────────────────────────────────── */
  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY) || 'default'; } catch { return 'default'; }
  }

  function saveTheme(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
  }

  /* ── Apply theme to <html> ───────────────────────────── */
  function applyColorTheme(id) {
    const html = document.documentElement;
    // Remove any previously applied data-theme
    html.setAttribute('data-theme', id);
    saveTheme(id);

    // Notify TMFTheme to re-sync chart colors
    window.dispatchEvent(new CustomEvent('colorThemeChange', { detail: { theme: id } }));

    // Re-run chart defaults if Chart.js is loaded
    if (window.TMFTheme && typeof window.TMFTheme.configureChartDefaults === 'function') {
      window.TMFTheme.configureChartDefaults();
    }

    // Update meta theme-color to match new bg-base
    syncMetaColor();
  }

  function syncMetaColor() {
    // Read the computed value AFTER CSS applies
    requestAnimationFrame(() => {
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg-base').trim();
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta && bg) meta.content = bg;
    });
  }

  /* ── Render theme picker in sidebar ─────────────────── */
  function renderThemePicker(container) {
    if (!container) return;

    const currentTheme = getSavedTheme();

    const wrap = document.createElement('div');
    wrap.className = 'theme-picker-wrap';

    const currentMeta = THEMES.find(t => t.id === currentTheme) || THEMES[0];

    wrap.innerHTML = `
      <button
        class="theme-picker-trigger sidebar-link"
        id="theme-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded="false"
        title="Change colour theme"
      >
        <span class="tpt-swatch" id="tpt-swatch" style="background:${currentMeta.swatch};"></span>
        <span class="tpt-label" id="tpt-label">${currentMeta.label}</span>
        <span class="material-icons-outlined tpt-chevron" style="font-size:1rem;">expand_more</span>
      </button>

      <div class="theme-picker-panel" id="theme-picker-panel" role="listbox" aria-label="Select colour theme">
        <div class="theme-picker-label">Colour Theme</div>
        ${THEMES.map(t => `
          <button
            class="theme-picker-item${t.id === currentTheme ? ' active' : ''}"
            data-theme-id="${t.id}"
            role="option"
            aria-selected="${t.id === currentTheme}"
            title="${t.label}"
          >
            <span class="tp-swatch" style="background:${t.swatch};"></span>
            ${t.label}
            <span class="material-icons-outlined tp-check">check</span>
          </button>
        `).join('')}

        <div class="theme-picker-sep"></div>
        <div class="theme-picker-label">Mode</div>
        <button
          class="theme-picker-item"
          id="theme-mode-toggle"
          title="Toggle light / dark"
        >
          <span class="material-icons-outlined" style="font-size:0.875rem;" data-theme-icon>dark_mode</span>
          <span data-theme-label>Dark Mode</span>
          <span class="tp-check material-icons-outlined" style="opacity:0;">check</span>
        </button>
      </div>
    `;

    container.appendChild(wrap);

    /* ── Wire up events ─────────────────────────────────── */
    const trigger  = wrap.querySelector('#theme-picker-trigger');
    const panel    = wrap.querySelector('#theme-picker-panel');
    const swatch   = wrap.querySelector('#tpt-swatch');
    const label    = wrap.querySelector('#tpt-label');
    const modeBtn  = wrap.querySelector('#theme-mode-toggle');
    const items    = wrap.querySelectorAll('.theme-picker-item[data-theme-id]');

    // Toggle panel open/close
    function openPanel() {
      const rect = trigger.getBoundingClientRect();
      // Position above the trigger
      panel.style.bottom = (window.innerHeight - rect.top + 6) + 'px';
      panel.style.left   = rect.left + 'px';
      panel.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.contains('open') ? closePanel() : openPanel();
    });

    // Close on outside click or Escape
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) closePanel();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePanel();
    });
    window.addEventListener('resize', closePanel);

    // Theme item click
    items.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.themeId;
        applyColorTheme(id);
        // Update active state
        items.forEach(i => {
          i.classList.toggle('active', i.dataset.themeId === id);
          i.setAttribute('aria-selected', i.dataset.themeId === id);
        });
        // Update trigger swatch + label
        const meta = THEMES.find(t => t.id === id);
        if (meta) {
          swatch.style.background = meta.swatch;
          label.textContent = meta.label;
        }
        closePanel();
      });
    });

    // Mode toggle
    if (modeBtn && window.TMFTheme) {
      modeBtn.addEventListener('click', () => {
        window.TMFTheme.toggle();
        syncMetaColor();
        closePanel();
      });
    }
  }

  /* ── Inject into sidebar footer & mobile drawer ─────── */
  function injectIntoPickers() {
    // Desktop sidebar footer — insert before the existing theme-toggle button
    const sidebarFooter = document.querySelector('.sidebar-footer');
    if (sidebarFooter) {
      // Remove the plain toggle button inserted by nav.js (it duplicates functionality)
      const oldToggle = sidebarFooter.querySelector('button[onclick*="TMFTheme.toggle"]');
      if (oldToggle) oldToggle.remove();

      // Find the existing picker or create one
      if (!sidebarFooter.querySelector('.theme-picker-wrap')) {
        // Insert at top of footer (before user auth section)
        const authDiv = sidebarFooter.querySelector('#sidebar-auth');
        renderThemePicker(sidebarFooter);
        // Keep auth section at bottom
        if (authDiv) sidebarFooter.appendChild(authDiv);
      }
    }

    // Mobile drawer footer — same treatment
    const drawerFooter = document.querySelector('.mobile-drawer .sidebar-footer');
    if (drawerFooter && !drawerFooter.querySelector('.theme-picker-wrap')) {
      const oldToggle = drawerFooter.querySelector('button[onclick*="TMFTheme.toggle"]');
      if (oldToggle) oldToggle.remove();
      renderThemePicker(drawerFooter);
    }
  }

  /* ── Init ───────────────────────────────────────────── */
  function init() {
    // Apply saved theme immediately (before paint) to avoid flash
    applyColorTheme(getSavedTheme());

    // Inject picker after nav.js has built the sidebar
    // nav.js runs on DOMContentLoaded too — use a tiny delay to let it finish
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(injectIntoPickers, 0);
      });
    } else {
      setTimeout(injectIntoPickers, 0);
    }

    // Re-inject whenever the mobile drawer opens
    window.addEventListener('drawerOpened', () => {
      setTimeout(() => {
        const drawerFooter = document.querySelector('.mobile-drawer .sidebar-footer');
        if (drawerFooter && !drawerFooter.querySelector('.theme-picker-wrap')) {
          const oldToggle = drawerFooter.querySelector('button[onclick*="TMFTheme.toggle"]');
          if (oldToggle) oldToggle.remove();
          renderThemePicker(drawerFooter);
        }
      }, 10);
    });
  }

  // Expose for external use (e.g. settings page)
  window.TMFColorTheme = {
    apply: applyColorTheme,
    get current() { return getSavedTheme(); },
    themes: THEMES,
  };

  init();
})();
