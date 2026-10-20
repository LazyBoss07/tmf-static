/* ══════════════════════════════════════════════════════════
   TrackMyFund — Theme System v2.0 "Obsidian Aurora"
   ══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── Color Tokens ────────────────────────────────────────
  const theme = {
    light: {
      primary:       '#101010',
      primaryLight:  '#2B2B2B',
      primaryDark:   '#000000',
      secondary:     '#FF5A24',
      accent:        '#16A34A',
      rose:          '#DC2626',
      amber:         '#D97706',
      bgBase:        '#F5F5F6',
      bgSurface:     '#FFFFFF',
      bgElevated:    '#FFFFFF',
      textPrimary:   '#0D0D0D',
      textSecondary: '#3F3F46',
      textTertiary:  '#71717A',
      border:        '#E4E4E7',
      chart: ['#101010','#FF5A24','#16A34A','#D97706','#DC2626','#71717A','#0EA5E9','#8B5CF6'],
    },
    dark: {
      primary:       '#FFFFFF',
      primaryLight:  '#FFFFFF',
      primaryDark:   '#D4D4D4',
      secondary:     '#FF5A24',
      accent:        '#4ADE80',
      rose:          '#FF5A5A',
      amber:         '#F5B544',
      bgBase:        '#050505',
      bgSurface:     '#0F0F0F',
      bgElevated:    '#141414',
      textPrimary:   '#F2F2F2',
      textSecondary: '#BFBFBF',
      textTertiary:  '#737373',
      border:        '#242424',
      chart: ['#FFFFFF','#FF5A24','#4ADE80','#F5B544','#FF5A5A','#A3A3A3','#7DD3FC','#C4B5FD'],
    },
  };

  // ── Helpers ─────────────────────────────────────────────
  const STORAGE_KEY = 'tmf-theme';
  const LIGHT_LOGO_SRC = '/shared/assets/icon.svg';
  const DARK_LOGO_SRC = '/shared/assets/icon_transparent.svg';

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }

  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function resolveTheme() {
    const saved = getSavedTheme();
    if (saved === 'dark' || saved === 'light') return saved;
    // Premium black is the signature look — default to dark unless the user
    // has explicitly chosen light before (respect an explicit light system pref only if you prefer).
    return 'dark';
  }

  // ── Apply Theme ─────────────────────────────────────────
  function applyTheme(mode) {
    const html = document.documentElement;
    if (mode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    try { localStorage.setItem(STORAGE_KEY, mode); } catch {}

    // Update meta theme-color for mobile
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = mode === 'dark' ? '#050505' : '#F5F5F6';

    // Dispatch event for charts and other listeners
    window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));

    // Keep theme-sensitive logo assets in sync
    syncThemeLogos();
  }

  function toggleTheme() {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    syncThemeIcons();
    return next;
  }

  function syncThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.textContent = isDark ? 'light_mode' : 'dark_mode';
    });
    document.querySelectorAll('[data-theme-label]').forEach(el => {
      el.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    });
  }

  function syncThemeLogos() {
    const isDark = document.documentElement.classList.contains('dark');
    const logoSrc = isDark ? DARK_LOGO_SRC : LIGHT_LOGO_SRC;
    document.querySelectorAll('img[data-theme-logo]').forEach((el) => {
      if (el.getAttribute('src') !== logoSrc) {
        el.setAttribute('src', logoSrc);
      }
    });
  }

  // ── Chart Helpers ───────────────────────────────────────
  function getChartColors(count) {
    const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const palette = theme[mode].chart;
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(palette[i % palette.length]);
    }
    return result;
  }

  function getThemeTokens() {
    const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    return { ...theme[mode], mode };
  }

  function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ── Chart.js Default Styling ────────────────────────────
  function configureChartDefaults() {
    if (typeof Chart === 'undefined') return;
    const t = getThemeTokens();

    Chart.defaults.color = t.textSecondary;
    Chart.defaults.borderColor = t.border;
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    Chart.defaults.font.size = 12;

    // ── Premium chart feel: smooth lines, ghost points, rounded bars ──
    const gridColor = t.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';
    if (Chart.defaults.elements) {
      Chart.defaults.elements.line = {
        ...Chart.defaults.elements.line,
        tension: 0.38,          // smooth curves
        borderWidth: 2.5,
        borderCapStyle: 'round',
        fill: true,
      };
      Chart.defaults.elements.point = {
        ...Chart.defaults.elements.point,
        radius: 0,              // clean line, no dots…
        hoverRadius: 5,         // …until you hover
        hitRadius: 12,
        hoverBorderWidth: 2,
      };
      Chart.defaults.elements.bar = {
        ...Chart.defaults.elements.bar,
        borderRadius: 8,
        borderSkipped: false,
      };
      Chart.defaults.elements.arc = {
        ...Chart.defaults.elements.arc,
        borderWidth: 0,
        hoverOffset: 6,
      };
    }
    // Subtle, borderless grid (v4 reads these off the scale defaults)
    ['linear', 'category', 'time', 'logarithmic'].forEach((s) => {
      if (Chart.defaults.scales && Chart.defaults.scales[s]) {
        Chart.defaults.scales[s].grid = {
          ...Chart.defaults.scales[s].grid,
          color: gridColor,
          drawBorder: false,
          drawTicks: false,
        };
        Chart.defaults.scales[s].border = { display: false };
        Chart.defaults.scales[s].ticks = {
          ...Chart.defaults.scales[s].ticks,
          padding: 8,
          color: t.textTertiary,
        };
      }
    });

    Chart.defaults.plugins.tooltip = {
      ...Chart.defaults.plugins.tooltip,
      backgroundColor: t.mode === 'dark' ? 'rgba(14, 15, 18, 0.96)' : 'rgba(255, 255, 255, 0.97)',
      titleColor: t.textPrimary,
      bodyColor: t.textSecondary,
      borderColor: t.border,
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      displayColors: true,
      usePointStyle: true,
      titleFont: { weight: '600', size: 13 },
      bodyFont: { size: 12 },
      boxPadding: 4,
    };

    Chart.defaults.plugins.legend = {
      ...Chart.defaults.plugins.legend,
      labels: {
        ...Chart.defaults.plugins.legend.labels,
        color: t.textSecondary,
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 16,
        font: { size: 12, weight: '500' },
      },
    };
  }

  // ── Initialize ──────────────────────────────────────────
  // Force day/month/year ordering for native date inputs & Intl formatting
  // (browsers format <input type="date"> using the element's lang).
  try { document.documentElement.setAttribute('lang', 'en-GB'); } catch {}

  // Apply immediately (before DOM ready) to prevent flash
  applyTheme(resolveTheme());

  // After DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      syncThemeIcons();
      syncThemeLogos();
      configureChartDefaults();
    });
  } else {
    syncThemeIcons();
    syncThemeLogos();
    configureChartDefaults();
  }

  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
        syncThemeIcons();
        syncThemeLogos();
        configureChartDefaults();
      }
    });
  }

  // Re-configure chart defaults on theme change
  window.addEventListener('themechange', configureChartDefaults);

  // ── Date Formatter (DD/MM/YYYY) ─────────────────────────
  function fmtDate(dateStr) {
    if (!dateStr) return '';
    try {
      // Handle YYYY-MM-DD, ISO strings, Date objects
      const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return String(dateStr);
    }
  }

  function fmtDateTime(dateStr) {
    if (!dateStr) return '';
    try {
      const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
    } catch {
      return String(dateStr);
    }
  }

  // Make globally available
  window.fmtDate = fmtDate;
  window.fmtDateTime = fmtDateTime;

  // ── Public API ──────────────────────────────────────────
  window.TMFTheme = {
    toggle: toggleTheme,
    apply: applyTheme,
    getTokens: getThemeTokens,
    getChartColors,
    hexToRgba,
    configureChartDefaults,
    syncIcons: syncThemeIcons,
    syncLogos: syncThemeLogos,
    theme,
  };
})();