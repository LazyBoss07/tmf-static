/* ══════════════════════════════════════════════════════════════════════════
   TrackMyFund — Multi-Theme Switcher
   80+ themes across 10 categories (shadcn/ui theme registry)
   Applies data-theme="<id>" on <html>, persists to localStorage,
   renders the categorised theme picker dropdown in the sidebar footer.
   ══════════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ── Theme catalogue ────────────────────────────────────────────────────── */
  const CATEGORIES = [
    {
      label: 'Color',
      themes: [
        { id: 'blue',           label: 'Blue',           swatch: '#2563eb', swatchDark: '#93c5fd' },
        { id: 'green',          label: 'Green',          swatch: '#16a34a', swatchDark: '#86efac' },
        { id: 'red',            label: 'Red',            swatch: '#dc2626', swatchDark: '#fca5a5' },
        { id: 'orange',         label: 'Orange',         swatch: '#ea580c', swatchDark: '#fdba74' },
        { id: 'yellow',         label: 'Yellow',         swatch: '#ca8a04', swatchDark: '#fde047' },
        { id: 'violet',         label: 'Violet',         swatch: '#7c3aed', swatchDark: '#c4b5fd' },
        { id: 'rose',           label: 'Rose',           swatch: '#e11d48', swatchDark: '#fda4af' },
      ],
    },
    {
      label: 'Pastel',
      themes: [
        { id: 'marshmallow',    label: 'Marshmallow',    swatch: '#d946ef', swatchDark: '#f0abfc' },
        { id: 'bubblegum',      label: 'Bubblegum',      swatch: '#ec4899', swatchDark: '#f9a8d4' },
        { id: 'catppuccin',     label: 'Catppuccin',     swatch: '#8839ef', swatchDark: '#cba6f7' },
        { id: 'pastel-dreams',  label: 'Pastel Dreams',  swatch: '#9b72cf', swatchDark: '#c4a8f5' },
        { id: 'soft-pop',       label: 'Soft Pop',       swatch: '#f472b6', swatchDark: '#f9a8d4' },
      ],
    },
    {
      label: 'Dark',
      themes: [
        { id: 'vscode',         label: 'VS Code',        swatch: '#007acc', swatchDark: '#007acc', alwaysDark: true },
        { id: 'cosmic-night',   label: 'Cosmic Night',   swatch: '#7c3aed', swatchDark: '#7c3aed', alwaysDark: true },
        { id: 'midnight-bloom', label: 'Midnight Bloom', swatch: '#db2777', swatchDark: '#db2777', alwaysDark: true },
        { id: 'caffeine',       label: 'Caffeine',       swatch: '#d97706', swatchDark: '#d97706', alwaysDark: true },
        { id: 'doom64',         label: 'Doom 64',        swatch: '#dc2626', swatchDark: '#dc2626', alwaysDark: true },
        { id: 'cyberpunk',      label: 'Cyberpunk',      swatch: '#facc15', swatchDark: '#facc15', alwaysDark: true },
        { id: 'dark-matter',    label: 'Dark Matter',    swatch: '#6d28d9', swatchDark: '#6d28d9', alwaysDark: true },
      ],
    },
    {
      label: 'Minimal',
      themes: [
        { id: 'zinc',           label: 'Zinc',           swatch: '#18181b', swatchDark: '#fafafa' },
        { id: 'slate',          label: 'Slate',          swatch: '#0f172a', swatchDark: '#f8fafc' },
        { id: 'neutral',        label: 'Neutral',        swatch: '#171717', swatchDark: '#fafafa' },
        { id: 'modern-minimal', label: 'Modern Minimal', swatch: '#374151', swatchDark: '#f9fafb' },
        { id: 'clean-slate',    label: 'Clean Slate',    swatch: '#000000', swatchDark: '#ffffff' },
        { id: 'amber-minimal',  label: 'Amber Minimal',  swatch: '#92400e', swatchDark: '#fcd34d' },
        { id: 'corporate',      label: 'Corporate',      swatch: '#1e40af', swatchDark: '#93c5fd' },
        { id: 'graphite',       label: 'Graphite',       swatch: '#334155', swatchDark: '#94a3b8' },
        { id: 'mono',           label: 'Mono',           swatch: '#000000', swatchDark: '#ffffff' },
      ],
    },
    {
      label: 'Creative',
      themes: [
        { id: 'art-deco',       label: 'Art Deco',       swatch: '#b8860b', swatchDark: '#ffd700' },
        { id: 'neo-brutalism',  label: 'Neo Brutalism',  swatch: '#ff6b35', swatchDark: '#ff6b35' },
        { id: 'studio-ghibli',  label: 'Studio Ghibli',  swatch: '#2d7d46', swatchDark: '#5abf7a' },
        { id: 'starry-night',   label: 'Starry Night',   swatch: '#f5c518', swatchDark: '#f5c518', alwaysDark: true },
        { id: 'northern-lights',label: 'Northern Lights',swatch: '#00bfa5', swatchDark: '#00bfa5', alwaysDark: true },
        { id: 'candyland',      label: 'Candyland',      swatch: '#ff1493', swatchDark: '#ff69b4' },
        { id: 'claymorphism',   label: 'Claymorphism',   swatch: '#6366f1', swatchDark: '#a78bfa' },
        { id: 'amethyst-haze',  label: 'Amethyst Haze',  swatch: '#9333ea', swatchDark: '#d8b4fe' },
      ],
    },
    {
      label: 'Warm',
      themes: [
        { id: 'mocha-mousse',   label: 'Mocha Mousse',   swatch: '#a07850', swatchDark: '#d4a878' },
        { id: 'solar-dusk',     label: 'Solar Dusk',     swatch: '#e85d04', swatchDark: '#faa307' },
        { id: 'sunset-horizon', label: 'Sunset Horizon', swatch: '#f97316', swatchDark: '#fb923c' },
        { id: 'summer',         label: 'Summer',         swatch: '#f59e0b', swatchDark: '#fbbf24' },
        { id: 'tangerine',      label: 'Tangerine',      swatch: '#f97316', swatchDark: '#fb923c' },
      ],
    },
    {
      label: 'Tech',
      themes: [
        { id: 'material',       label: 'Material Design',swatch: '#1976d2', swatchDark: '#90caf9' },
        { id: 'bold-tech',      label: 'Bold Tech',      swatch: '#6366f1', swatchDark: '#818cf8' },
        { id: 't3-chat',        label: 'T3 Chat',        swatch: '#7c3aed', swatchDark: '#c4b5fd' },
      ],
    },
    {
      label: 'Brand',
      themes: [
        { id: 'spotify',        label: 'Spotify',        swatch: '#1db954', swatchDark: '#1db954', alwaysDark: true },
        { id: 'claude',         label: 'Claude',         swatch: '#d97757', swatchDark: '#e8a88a' },
        { id: 'slack',          label: 'Slack',          swatch: '#4a154b', swatchDark: '#e8a0e8' },
        { id: 'supabase',       label: 'Supabase',       swatch: '#3ecf8e', swatchDark: '#3ecf8e' },
        { id: 'twitter',        label: 'Twitter / X',    swatch: '#1d9bf0', swatchDark: '#1d9bf0' },
        { id: 'vercel',         label: 'Vercel',         swatch: '#000000', swatchDark: '#ffffff' },
        { id: 'valorant',       label: 'Valorant',       swatch: '#ff4655', swatchDark: '#ff4655', alwaysDark: true },
        { id: 'marvel',         label: 'Marvel',         swatch: '#e23636', swatchDark: '#e23636' },
      ],
    },
    {
      label: 'Luxury',
      themes: [
        { id: 'elegant-luxury', label: 'Elegant Luxury', swatch: '#c9a84c', swatchDark: '#c9a84c', alwaysDark: true },
        { id: 'violet-bloom',   label: 'Violet Bloom',   swatch: '#7c3aed', swatchDark: '#7c3aed', alwaysDark: true },
        { id: 'quantum-rose',   label: 'Quantum Rose',   swatch: '#e879f9', swatchDark: '#f0a8ff' },
        { id: 'perpetuity',     label: 'Perpetuity',     swatch: '#2c2c2c', swatchDark: '#c8b89a' },
      ],
    },
    {
      label: 'Retro',
      themes: [
        { id: 'retro-arcade',   label: 'Retro Arcade',   swatch: '#ff00ff', swatchDark: '#ff00ff', alwaysDark: true },
        { id: 'vintage-paper',  label: 'Vintage Paper',  swatch: '#5c4033', swatchDark: '#c8a87a' },
        { id: 'notebook',       label: 'Notebook',       swatch: '#1a237e', swatchDark: '#7986cb' },
      ],
    },
    {
      label: 'Nature',
      themes: [
        { id: 'kodama-grove',   label: 'Kodama Grove',   swatch: '#4a7c59', swatchDark: '#8fbc8f' },
        { id: 'ocean-breeze',   label: 'Ocean Breeze',   swatch: '#0369a1', swatchDark: '#7dd3fc' },
        { id: 'nature',         label: 'Nature',         swatch: '#2d6a4f', swatchDark: '#74c69d' },
      ],
    },
    {
      label: 'TMF',
      themes: [
        { id: 'default',        label: 'Obsidian',       swatch: '#101010', swatchDark: '#101010' },
      ],
    },
  ];

  /* flat list for lookups */
  const ALL_THEMES = CATEGORIES.flatMap(c => c.themes);

  const THEME_KEY = 'tmf-color-theme';
  const MODE_KEY  = 'tmf-theme-mode'; /* 'dark' | 'light' */

  /* ── Persistence ─────────────────────────────────────────────────────────── */
  function getSavedTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'default'; } catch { return 'default'; }
  }
  function saveTheme(id) {
    try { localStorage.setItem(THEME_KEY, id); } catch {}
  }
  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  /* ── Apply theme ─────────────────────────────────────────────────────────── */
  function applyColorTheme(id) {
    const meta = ALL_THEMES.find(t => t.id === id) || ALL_THEMES[0];
    document.documentElement.setAttribute('data-theme', id);

    /* force dark for always-dark themes */
    if (meta.alwaysDark && !isDark()) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem(MODE_KEY, 'dark'); } catch {}
    }

    saveTheme(id);
    syncMetaColor();
    window.dispatchEvent(new CustomEvent('colorThemeChange', { detail: { theme: id } }));
    if (window.TMFTheme && typeof window.TMFTheme.configureChartDefaults === 'function') {
      window.TMFTheme.configureChartDefaults();
    }
  }

  function syncMetaColor() {
    requestAnimationFrame(() => {
      const bg  = getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim();
      const el  = document.querySelector('meta[name="theme-color"]');
      if (el && bg) el.content = bg;
    });
  }

  /* ── Build the picker panel HTML ─────────────────────────────────────────── */
  function buildPanelHTML(currentId) {
    let html = '';
    CATEGORIES.forEach((cat, ci) => {
      if (ci > 0) html += '<div class="theme-picker-sep"></div>';
      html += `<div class="theme-picker-cat">${cat.label}</div>`;
      cat.themes.forEach(t => {
        const sw = isDark() ? t.swatchDark : t.swatch;
        html += `
          <button class="theme-picker-item${t.id === currentId ? ' active' : ''}"
            data-theme-id="${t.id}" role="option"
            aria-selected="${t.id === currentId}" title="${t.label}">
            <span class="tp-swatch" style="background:${sw};"></span>
            ${t.label}
            <span class="material-icons-outlined tp-check" style="font-size:0.75rem;">check</span>
          </button>`;
      });
    });
    return html;
  }

  /* ── Render picker into a container element ──────────────────────────────── */
  function renderThemePicker(container) {
    if (!container || container.querySelector('.theme-picker-wrap')) return;

    const currentId   = getSavedTheme();
    const currentMeta = ALL_THEMES.find(t => t.id === currentId) || ALL_THEMES[0];
    const sw = isDark() ? currentMeta.swatchDark : currentMeta.swatch;

    const wrap = document.createElement('div');
    wrap.className = 'theme-picker-wrap';
    wrap.innerHTML = `
      <button class="theme-picker-trigger" id="tpt-btn-${Date.now()}"
        aria-haspopup="listbox" aria-expanded="false" title="Pick a theme">
        <span class="tpt-swatch" style="background:${sw};"></span>
        <span class="tpt-label">${currentMeta.label}</span>
        <span class="material-icons-outlined tpt-chevron">expand_more</span>
      </button>
      <div class="theme-picker-panel" role="listbox" aria-label="Select colour theme">
        ${buildPanelHTML(currentId)}
        <div class="theme-picker-sep"></div>
        <div class="theme-picker-mode-row">
          <span class="material-icons-outlined" style="font-size:1rem;">contrast</span>
          <span>Dark mode</span>
          <button class="theme-mode-toggle-btn" data-mode-toggle>
            <span class="material-icons-outlined" style="font-size:0.875rem;" data-mode-icon>
              ${isDark() ? 'light_mode' : 'dark_mode'}
            </span>
            <span data-mode-label>${isDark() ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>`;

    /* remove old plain toggle if nav.js already rendered one */
    const old = container.querySelector('button[onclick*="TMFTheme"]');
    if (old) old.remove();

    container.appendChild(wrap);

    /* ── Wire events ───────────────────────────────────────────────────── */
    const trigger = wrap.querySelector('.theme-picker-trigger');
    const panel   = wrap.querySelector('.theme-picker-panel');
    const swatch  = wrap.querySelector('.tpt-swatch');
    const label   = wrap.querySelector('.tpt-label');

    function openPanel() {
      const r = trigger.getBoundingClientRect();
      panel.style.bottom = (window.innerHeight - r.top + 6) + 'px';
      panel.style.left   = r.left + 'px';
      panel.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) closePanel(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
    window.addEventListener('resize', closePanel);

    /* theme item clicks */
    panel.addEventListener('click', e => {
      const item = e.target.closest('[data-theme-id]');
      if (item) {
        const id = item.dataset.themeId;
        applyColorTheme(id);

        /* update active states */
        panel.querySelectorAll('[data-theme-id]').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.themeId === id);
          btn.setAttribute('aria-selected', btn.dataset.themeId === id);
          const m = ALL_THEMES.find(t => t.id === btn.dataset.themeId);
          if (m) btn.querySelector('.tp-swatch').style.background = isDark() ? m.swatchDark : m.swatch;
        });

        /* update trigger */
        const m = ALL_THEMES.find(t => t.id === id);
        if (m) {
          swatch.style.background = isDark() ? m.swatchDark : m.swatch;
          label.textContent = m.label;
        }
        closePanel();
      }

      /* mode toggle */
      if (e.target.closest('[data-mode-toggle]')) {
        if (window.TMFTheme) window.TMFTheme.toggle();
        syncMetaColor();
        /* update mode button label */
        const icon  = wrap.querySelector('[data-mode-icon]');
        const lbl   = wrap.querySelector('[data-mode-label]');
        if (icon) icon.textContent = isDark() ? 'light_mode' : 'dark_mode';
        if (lbl)  lbl.textContent  = isDark() ? 'Light' : 'Dark';
        closePanel();
      }
    });
  }

  /* ── Inject into sidebar and mobile drawer ───────────────────────────────── */
  function inject() {
    /* desktop sidebar footer */
    const sf = document.querySelector('.sidebar-footer');
    if (sf) renderThemePicker(sf);

    /* mobile drawer sidebar footer */
    const df = document.querySelector('.mobile-drawer .sidebar-footer');
    if (df) renderThemePicker(df);
  }

  /* ── Init ────────────────────────────────────────────────────────────────── */
  function init() {
    /* apply immediately to avoid FOUC */
    applyColorTheme(getSavedTheme());

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(inject, 0));
    } else {
      setTimeout(inject, 0);
    }

    /* re-inject when mobile drawer opens */
    window.addEventListener('drawerOpened', () => setTimeout(inject, 10));

    /* re-sync swatches when mode changes externally */
    window.addEventListener('themeChange', () => {
      document.querySelectorAll('.tp-swatch').forEach(el => {
        const id = el.closest('[data-theme-id]')?.dataset.themeId;
        if (!id) return;
        const m = ALL_THEMES.find(t => t.id === id);
        if (m) el.style.background = isDark() ? m.swatchDark : m.swatch;
      });
      document.querySelectorAll('.tpt-swatch').forEach(el => {
        const id = getSavedTheme();
        const m = ALL_THEMES.find(t => t.id === id);
        if (m) el.style.background = isDark() ? m.swatchDark : m.swatch;
      });
    });
  }

  /* ── Public API ──────────────────────────────────────────────────────────── */
  window.TMFColorTheme = {
    apply: applyColorTheme,
    get current() { return getSavedTheme(); },
    categories: CATEGORIES,
    themes: ALL_THEMES,
  };

  init();
})();
