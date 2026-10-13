/* ══════════════════════════════════════════════════════════════════════════
   TrackMyFund — Mobile runtime (/m)

   Shared by m-month, m-add, m-ledger, m-invest and m-more. Deliberately does
   NOT use components/nav.js: that file builds a desktop sidebar and rehomes
   document.body's children, which is the wrong shape here.

   Reuses, unchanged:
     · TMFTheme     (shared/theme.js)        — light/dark, meta theme-color
     · TMFNotify    (components/notification.js) — toasts
     · the /api/v1 surface — no new endpoints, no backend change

   Formatting helpers are lifted verbatim from transactions.html so money,
   labels and escaping cannot drift between desktop and mobile.
   ══════════════════════════════════════════════════════════════════════════ */

window.TMFMobile = (() => {
  'use strict';

  /* ── Formatting ─────────────────────────────────────────────────────────
     Identical to transactions.html:925-947 and :1092. */

  const INR = n => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  /* Compact form for the hero, where 4 significant figures beat exactness. */
  const INR_SHORT = (n) => {
    const v = Math.abs(Number(n || 0));
    if (v >= 1e7) return '₹' + (v / 1e7).toFixed(2) + 'Cr';
    if (v >= 1e5) return '₹' + (v / 1e5).toFixed(2) + 'L';
    return '₹' + v.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const escHtml = v => String(v == null ? '' : v)
    .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

  /* Account keys are stored lowercase; show them the way a person wrote them. */
  function labelFor(key) {
    if (!key) return '—';
    const k = String(key).toLowerCase();
    return k.length <= 4 ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1);
  }

  /* "Today" / "Yesterday" / "Fri 10 Oct" — a date you can read at a glance. */
  function dayLabel(iso) {
    if (!iso) return 'No date';
    const d = new Date(iso + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return iso;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.round((today - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    const sameYear = d.getFullYear() === today.getFullYear();
    return d.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short',
      year: sameYear ? undefined : 'numeric',
    });
  }

  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  /* ── Haptics ────────────────────────────────────────────────────────────
     A 10ms tick confirms a commit without a toast stealing the screen. */
  function tap(ms = 10) {
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch {}
  }

  /* ── Toasts — delegate to the existing component ───────────────────────── */
  function toast(msg, type = 'info') {
    if (window.TMFNotify) return window.TMFNotify.show(msg, type);
    console.log(`[${type}] ${msg}`);
    return null;
  }


  /* ════════════════════════════════════════════════════════════════════════
     API
     Same contract as transactions.html:952 — session cookie, unwrap .data,
     throw on !ok. Adds a Bearer fallback so the JWT issued by
     POST /auth/login/mobile (server.js:442) finally has a client, and a
     clear offline signal so callers can queue instead of failing.
     ════════════════════════════════════════════════════════════════════════ */

  const JWT_KEY = 'tmf-jwt';

  function getToken() {
    try { return localStorage.getItem(JWT_KEY) || null; } catch { return null; }
  }

  class OfflineError extends Error {
    constructor() { super('You are offline'); this.name = 'OfflineError'; this.offline = true; }
  }

  async function api(url, opts = {}) {
    if (navigator.onLine === false) throw new OfflineError();

    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let res;
    try {
      res = await fetch(url, { credentials: 'same-origin', ...opts, headers });
    } catch (networkErr) {
      // fetch() rejects only on network failure, never on a 4xx/5xx.
      throw new OfflineError();
    }

    // The session expired. Send them to login rather than rendering an empty
    // screen that looks like "you have no transactions".
    if (res.status === 401) {
      location.href = '/login?next=' + encodeURIComponent(location.pathname);
      throw new Error('Session expired');
    }

    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || `Request failed (${res.status})`);
    return ('data' in body) ? body.data : body;
  }


  /* ════════════════════════════════════════════════════════════════════════
     SHELL — app bar + tab bar
     Five destinations; the centre one is the action the app exists for.
     ════════════════════════════════════════════════════════════════════════ */

  const TABS = [
    { id: 'month',  label: 'Month',  icon: 'account_balance_wallet', href: '/m' },
    { id: 'ledger', label: 'Ledger', icon: 'receipt_long',           href: '/m/ledger' },
    { id: 'add',    label: 'Log',    icon: 'add',                    href: '/m/add', action: true },
    { id: 'invest', label: 'Invest', icon: 'trending_up',            href: '/m/invest' },
    { id: 'more',   label: 'More',   icon: 'menu',                   href: '/m/more' },
  ];

  function tabBar(active) {
    const nav = document.createElement('nav');
    nav.className = 'tm-tabs';
    nav.setAttribute('aria-label', 'Main');

    nav.innerHTML = TABS.map(t => {
      const isActive = t.id === active;
      const inner = t.action
        ? `<span class="tm-tab-fab"><span class="material-icons-outlined">${t.icon}</span></span>
           <span class="tm-sr">${t.label}</span>`
        : `<span class="material-icons-outlined">${t.icon}</span><span>${t.label}</span>`;
      return `<a href="${t.href}"
                 class="tm-tab${t.action ? ' tm-tab--action' : ''}${isActive ? ' is-active' : ''}"
                 ${isActive ? 'aria-current="page"' : ''}>${inner}</a>`;
    }).join('');

    return nav;
  }

  /* Builds the chrome around whatever the page put in <main>. */
  function shell({ active, title, action } = {}) {
    const app = document.querySelector('.tm-app');
    if (!app) return;

    const bar = document.createElement('header');
    bar.className = 'tm-bar';
    bar.innerHTML = `
      <div class="tm-bar-title">${escHtml(title || '')}</div>
      ${action ? `<button class="tm-bar-btn" id="${action.id}" aria-label="${escHtml(action.label)}">
        <span class="material-icons-outlined">${action.icon}</span>
      </button>` : ''}
    `;
    app.prepend(bar);

    if (active) app.appendChild(tabBar(active));

    // The bar grows a rule only once content has scrolled under it, so a short
    // page never shows a line with nothing above it.
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    app.prepend(sentinel);
    new IntersectionObserver(
      ([e]) => bar.classList.toggle('tm-bar--stuck', !e.isIntersecting),
      { threshold: 1 },
    ).observe(sentinel);

    return bar;
  }


  /* ════════════════════════════════════════════════════════════════════════
     LEDGER RENDERER
     Shared by /m (recent) and /m/ledger (full month) so the two screens can
     never disagree about what a transaction looks like.
     ════════════════════════════════════════════════════════════════════════ */

  /* type → how the amount reads. Transfers are neither gain nor loss, so they
     stay neutral: green and red mean money entering or leaving, nothing else. */
  const SIGN = {
    income:  { cls: 'is-in',   pre: '+' },
    expense: { cls: 'is-out',  pre: '−' },
    payment: { cls: 'is-move', pre: '' },
  };

  function syncClass(r) {
    if (r.queued) return 'is-pending';
    const s = r.sync && r.sync.notionStatus;
    if (s === 'synced' && r.sync.notionPageId) return 'is-synced';
    if (s === 'failed') return 'is-failed';
    if (s === 'pending') return 'is-pending';
    return '';
  }

  /* The second line: what kind of money this was, and where it moved. */
  function rowMeta(r) {
    if (r.type === 'payment') {
      return `${labelFor(r.fromAccountKey)} → ${labelFor(r.toAccountKey)}`;
    }
    const parts = [];
    if (r.categoryKey) parts.push(r.categoryKey);
    if (r.accountKey)  parts.push(labelFor(r.accountKey));
    if (r.split)       parts.push('split');
    return parts.join(' · ') || '—';
  }

  function rowHTML(r) {
    const s = SIGN[r.type] || SIGN.expense;
    const flag = syncClass(r);
    return `
      <li class="tm-row-host" data-id="${escHtml(r.id)}">
        <button class="tm-row" type="button" data-row="${escHtml(r.id)}">
          <span class="tm-row-body">
            <span class="tm-row-name">${escHtml(r.name || r.vendor || 'Untitled')}</span>
            <span class="tm-row-meta">${escHtml(rowMeta(r))}</span>
          </span>
          ${flag ? `<span class="tm-row-flag ${flag}" aria-hidden="true"></span>` : ''}
          <span class="tm-row-amt ${s.cls}">${s.pre}${INR(Math.abs(r.amount))}</span>
        </button>
      </li>`;
  }

  /* Groups by date and emits a sticky day heading above each run. */
  function ledgerHTML(list) {
    if (!list || !list.length) return '';
    const groups = new Map();
    for (const r of list) {
      const k = r.date || '';
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(r);
    }
    return [...groups.entries()].map(([date, rows]) => `
      <h2 class="tm-group-label">${escHtml(dayLabel(date))}</h2>
      <ul class="tm-rows">${rows.map(rowHTML).join('')}</ul>
    `).join('');
  }

  /* ── States ─────────────────────────────────────────────────────────────
     An empty screen names what would be here and offers the action that puts
     it there. An error says what happened and what to do about it. */

  function emptyHTML(title, text, cta) {
    return `
      <div class="tm-state">
        <span class="material-icons-outlined">receipt_long</span>
        <p class="tm-state-title">${escHtml(title)}</p>
        <p class="tm-state-text">${escHtml(text)}</p>
        ${cta ? `<a class="tm-btn tm-btn--auto" href="${cta.href}">${escHtml(cta.label)}</a>` : ''}
      </div>`;
  }

  function errorHTML(text, retryFn) {
    return `
      <div class="tm-state">
        <span class="material-icons-outlined">cloud_off</span>
        <p class="tm-state-title">${escHtml(text)}</p>
        <p class="tm-state-text">Check your connection, then try again.</p>
        ${retryFn ? `<button class="tm-btn tm-btn--auto tm-btn--quiet" onclick="${retryFn}">Try again</button>` : ''}
      </div>`;
  }

  function skeletonHTML(n = 5) {
    return `<ul class="tm-rows">${Array.from({ length: n }, () => `
      <li><div class="tm-row">
        <span class="tm-row-body">
          <span class="tm-skeleton" style="display:block;width:45%;height:0.875rem;"></span>
          <span class="tm-skeleton" style="display:block;width:28%;height:0.75rem;margin-top:0.375rem;"></span>
        </span>
        <span class="tm-skeleton" style="width:4.5rem;height:0.875rem;"></span>
      </div></li>`).join('')}</ul>`;
  }


  return {
    INR, INR_SHORT, escHtml, labelFor, dayLabel, todayISO, tap, toast, MONTHS,
    api, OfflineError, getToken,
    shell, tabBar,
    ledgerHTML, rowHTML, emptyHTML, errorHTML, skeletonHTML,
  };
})();

