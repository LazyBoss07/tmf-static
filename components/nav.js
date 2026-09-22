/* ══════════════════════════════════════════════════════════
   TrackMyFund — Navigation v2.0
   Sidebar (desktop) + Bottom Tabs (mobile) + Drawer
   ══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const NAV_SECTIONS = [
    {
      title: 'Overview',
      items: [
        { id: 'overview', label: 'Overview', icon: 'dashboard', href: '/' },
      ],
    },
    {
      title: 'Invest',
      items: [
        { id: 'funds', label: 'Fund Analyzer', icon: 'analytics', href: '/funds' },
        { id: 'portfolio', label: 'Holdings', icon: 'account_balance', href: '/portfolio' },
        { id: 'portfolio-overlap', label: 'Overlap', icon: 'compare_arrows', href: '/portfolio-overlap' },
      ],
    },
    {
      title: 'Markets',
      items: [
        { id: 'asset-prices', label: 'Market Watch', icon: 'monitoring', href: '/asset-prices' },
      ],
    },
    {
      title: 'Spending',
      items: [
        { id: 'expenses', label: 'Add / Import', icon: 'add_circle', href: '/expenses' },
        { id: 'transactions', label: 'Transactions', icon: 'receipt_long', href: '/transactions' },
        { id: 'stats', label: 'Statistics', icon: 'bar_chart', href: '/stats' },
      ],
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
      ],
    },
  ];

  const NAV_ITEMS = NAV_SECTIONS.flatMap(section => section.items);
  const BOTTOM_NAV_IDS = ['overview', 'expenses', 'transactions', 'stats', 'more'];
  const DRAWER_EXTRA_ITEMS = [
    { id: 'funds', label: 'Fund Analyzer', icon: 'analytics', href: '/funds' },
    { id: 'stats', label: 'Statistics', icon: 'bar_chart', href: '/stats' },
    { id: 'portfolio', label: 'Holdings', icon: 'account_balance', href: '/portfolio' },
    { id: 'portfolio-overlap', label: 'Overlap', icon: 'compare_arrows', href: '/portfolio-overlap' },
    { id: 'asset-prices', label: 'Market Watch', icon: 'monitoring', href: '/asset-prices' },
  ];

  const SIDEBAR_COLLAPSED_KEY = 'tmf-sidebar-collapsed';

  function getActivePage() {
    const el = document.getElementById('nav-container');
    return el ? el.getAttribute('data-page') || '' : '';
  }

  function isSidebarCollapsed() {
    try { return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'; } catch { return false; }
  }

  function setSidebarCollapsed(val) {
    try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, val ? '1' : '0'); } catch {}
  }

  function createSidebar(activePage) {
    const collapsed = isSidebarCollapsed();
    const sidebar = document.createElement('aside');
    sidebar.className = `app-sidebar desktop-only${collapsed ? ' collapsed' : ''}`;
    sidebar.id = 'app-sidebar';

    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">
          <img src="/shared/assets/icon.svg" alt="TrackMyFund" class="sidebar-brand-logo" data-theme-logo />
        </div>
        <span class="sidebar-brand-text gradient-text">TrackMyFund</span>
      </div>

      <nav class="sidebar-nav">
        ${NAV_SECTIONS.map(section => `
          <div class="sidebar-group">
            <div class="sidebar-group-title">${section.title}</div>
            <div class="sidebar-group-links">
              ${section.items.map(item => `
                <a href="${item.href}" class="sidebar-link${activePage === item.id ? ' active' : ''}" data-nav="${item.id}">
                  <span class="material-icons-outlined">${item.icon}</span>
                  <span class="sidebar-link-label">${item.label}</span>
                </a>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </nav>

      <div class="sidebar-footer">
        <button class="sidebar-link" onclick="TMFTheme.toggle()" style="cursor:pointer; border:none; width:100%;">
          <span class="material-icons-outlined" data-theme-icon>dark_mode</span>
          <span class="sidebar-link-label" data-theme-label>Dark Mode</span>
        </button>

        <div id="sidebar-auth" style="display:none;">
          <button class="sidebar-link" id="sidebar-logout" style="cursor:pointer; border:none; width:100%; color:var(--rose);">
            <span class="material-icons-outlined">logout</span>
            <span class="sidebar-link-label">Logout</span>
          </button>
        </div>
      </div>
    `;

    return sidebar;
  }

  function createBottomNav(activePage) {
    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav mobile-only';
    nav.id = 'mobile-bottom-nav';

    const items = BOTTOM_NAV_IDS.map(id => {
      if (id === 'more') {
        return { id: 'more', label: 'More', icon: 'menu', href: '#', isMore: true };
      }
      return NAV_ITEMS.find(n => n.id === id);
    }).filter(Boolean);

    const isMoreActive = DRAWER_EXTRA_ITEMS.some(d => d.id === activePage) || activePage === 'settings';

    nav.innerHTML = `
      <div class="mobile-bottom-nav-inner">
        ${items.map(item => {
          const isActive = item.isMore ? isMoreActive : activePage === item.id;
          return `
            <a href="${item.href}" class="mobile-nav-item${isActive ? ' active' : ''}"
               ${item.isMore ? 'id="mobile-more-btn"' : `data-nav="${item.id}"`}>
              <span class="material-icons-outlined">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `;
        }).join('')}
      </div>
    `;

    return nav;
  }

  function openDrawer(activePage) {
    if (document.getElementById('mobile-drawer-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'mobile-drawer-overlay';
    overlay.id = 'mobile-drawer-overlay';

    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.id = 'mobile-drawer';

    drawer.innerHTML = `
      <div class="sidebar-brand" style="padding:1rem;">
        <div class="sidebar-brand-icon">
          <img src="/shared/assets/icon.svg" alt="TrackMyFund" class="sidebar-brand-logo" data-theme-logo />
        </div>
        <span class="sidebar-brand-text gradient-text">TrackMyFund</span>
      </div>

      <nav class="sidebar-nav" style="padding-top:0.5rem;">
        ${NAV_SECTIONS.map(section => `
          <div class="sidebar-group">
            <div class="sidebar-group-title">${section.title}</div>
            <div class="sidebar-group-links">
              ${section.items.map(item => `
                <a href="${item.href}" class="sidebar-link${activePage === item.id ? ' active' : ''}">
                  <span class="material-icons-outlined">${item.icon}</span>
                  <span class="sidebar-link-label">${item.label}</span>
                </a>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </nav>

      <div class="sidebar-footer">
        <button class="sidebar-link" onclick="TMFTheme.toggle(); closeDrawer();" style="cursor:pointer; border:none; width:100%;">
          <span class="material-icons-outlined" data-theme-icon>dark_mode</span>
          <span class="sidebar-link-label" data-theme-label>Dark Mode</span>
        </button>

        <div id="drawer-auth" style="display:none;"></div>
      </div>
    `;

    overlay.appendChild(drawer);
    document.body.appendChild(overlay);

    if (window.TMFTheme) {
      window.TMFTheme.syncIcons();
      window.TMFTheme.syncLogos();
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDrawer();
    });

    syncAuthForDrawer();
  }

  function closeDrawer() {
    const overlay = document.getElementById('mobile-drawer-overlay');
    const drawer = document.getElementById('mobile-drawer');
    if (!overlay) return;

    if (drawer) {
      drawer.classList.add('closing');
      setTimeout(() => overlay.remove(), 250);
    } else {
      overlay.remove();
    }
  }

  window.closeDrawer = closeDrawer;

  let currentUser = null;

  async function syncAuth() {
    try {
      const res = await fetch('/auth/me', { credentials: 'same-origin' });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.isAuthenticated && data.user) {
        currentUser = data.user;
        showAuthUI(data.user);
      }
    } catch {}
  }

  function showAuthUI(user) {
    // Build user avatar in sidebar footer
    const sidebarAuth = document.getElementById('sidebar-auth');
    if (sidebarAuth && user) {
      const initial = (user.username || '?')[0].toUpperCase();
      const isAdmin = user.role === 'admin';
      sidebarAuth.style.display = 'block';
      sidebarAuth.innerHTML = `
        <div class="sidebar-user-profile" id="sidebar-user-btn" title="${user.username}" style="cursor:pointer;position:relative;">
          <div class="sidebar-link" style="display:flex;align-items:center;gap:0.75rem;width:100%;border:none;padding:0.625rem 0.75rem;">
            <div class="user-avatar" style="
              width:1.25rem;min-width:1.25rem;height:1.25rem;border-radius:4px;
              background:${isAdmin ? 'var(--primary)' : 'var(--text-tertiary)'};
              color:#fff;display:flex;align-items:center;justify-content:center;
              font-weight:700;font-size:0.65rem;flex-shrink:0;text-align:center;
            ">${initial}</div>
            <span class="sidebar-link-label" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              ${user.username}
            </span>
          </div>
        </div>
      `;

      const userBtn = document.getElementById('sidebar-user-btn');
      if (userBtn) {
        userBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleUserContextMenu(userBtn, user);
        });
      }
    }
  }

  function toggleUserContextMenu(anchor, user) {
    const existingMenu = document.getElementById('user-context-menu');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const isAdmin = user.role === 'admin';
    const initial = (user.username || '?')[0].toUpperCase();

    const menu = document.createElement('div');
    menu.id = 'user-context-menu';
    menu.className = 'user-context-menu';
    menu.innerHTML = `
      <div style="padding:12px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border-light);">
        <div style="
          width:36px;height:36px;border-radius:var(--radius-md);
          background:${isAdmin ? 'var(--primary)' : 'var(--text-tertiary)'};
          color:#fff;display:flex;align-items:center;justify-content:center;
          font-weight:700;font-size:16px;flex-shrink:0;
        ">${initial}</div>
        <div>
          <div style="font-weight:700;color:var(--text-primary);font-size:0.875rem;">${user.username}</div>
          <div style="font-size:0.7rem;color:var(--text-tertiary);margin-top:2px;">
            <span style="
              display:inline-block;padding:1px 6px;border-radius:4px;font-weight:600;font-size:0.65rem;
              background:${isAdmin ? 'var(--primary)' : 'var(--text-tertiary)'};color:#fff;text-transform:uppercase;
            ">${user.role || 'user'}</span>
          </div>
        </div>
      </div>
      <a href="/settings" class="user-context-item" style="display:flex;align-items:center;gap:8px;padding:10px 16px;text-decoration:none;color:var(--text-primary);font-size:0.85rem;">
        <span class="material-icons-outlined" style="font-size:18px;">settings</span>
        Settings
      </a>
      <button id="ctx-logout-btn" class="user-context-item" style="display:flex;align-items:center;gap:8px;padding:10px 16px;width:100%;border:none;background:none;cursor:pointer;color:var(--rose);font-size:0.85rem;text-align:left;">
        <span class="material-icons-outlined" style="font-size:18px;">logout</span>
        Logout
      </button>
    `;

    // Position the menu above the anchor
    const rect = anchor.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    menu.style.left = rect.left + 'px';
    menu.style.zIndex = '9999';

    document.body.appendChild(menu);

    const logoutBtn = document.getElementById('ctx-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', postLogout);

    // Close on outside click
    setTimeout(() => {
      function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== anchor && !anchor.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
          document.removeEventListener('keydown', closeOnEsc);
        }
      }
      function closeOnEsc(e) {
        if (e.key === 'Escape') {
          menu.remove();
          document.removeEventListener('click', closeMenu);
          document.removeEventListener('keydown', closeOnEsc);
        }
      }
      document.addEventListener('click', closeMenu);
      document.addEventListener('keydown', closeOnEsc);
    }, 0);
  }

  function syncAuthForDrawer() {
    const drawerAuth = document.getElementById('drawer-auth');
    if (!drawerAuth || !currentUser) return;

    const user = currentUser;
    const initial = (user.username || '?')[0].toUpperCase();
    const isAdmin = user.role === 'admin';

    drawerAuth.style.display = 'block';
    drawerAuth.innerHTML = `
      <div class="sidebar-link" style="display:flex;align-items:center;gap:0.75rem;width:100%;border:none;padding:0.625rem 0.75rem;">
        <div class="user-avatar" style="
          width:1.25rem;min-width:1.25rem;height:1.25rem;border-radius:4px;
          background:${isAdmin ? 'var(--primary)' : 'var(--text-tertiary)'};
          color:#fff;display:flex;align-items:center;justify-content:center;
          font-weight:700;font-size:0.65rem;flex-shrink:0;text-align:center;
        ">${initial}</div>
        <span class="sidebar-link-label" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${user.username}
        </span>
      </div>
      <a href="/settings" class="sidebar-link" style="text-decoration:none;">
        <span class="material-icons-outlined">settings</span>
        <span class="sidebar-link-label">Settings</span>
      </a>
      <button class="sidebar-link" id="drawer-logout" style="cursor:pointer; border:none; width:100%; color:var(--rose);">
        <span class="material-icons-outlined">logout</span>
        <span class="sidebar-link-label">Logout</span>
      </button>
    `;

    const logoutBtn = document.getElementById('drawer-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', postLogout);
  }

  async function postLogout() {
    try {
      // Clear JWT token from localStorage
      try { localStorage.removeItem('tmf-jwt'); } catch {}

      // Get CSRF token for the logout request
      let csrfToken = null;
      try {
        const csrfRes = await fetch('/auth/csrf-token', { credentials: 'same-origin' });
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          csrfToken = csrfData.csrfToken;
        }
      } catch {}

      const headers = { 'Content-Type': 'application/json' };
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      } else {
        // Fallback: try cookie-based CSRF
        const csrfMatch = document.cookie.match(/(?:^|;\s*)_csrf=([^;]*)/);
        if (csrfMatch) headers['x-csrf-token'] = decodeURIComponent(csrfMatch[1]);
      }

      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers,
      });
    } catch {
      // Even if logout API fails, clear local state
    }
    // Always redirect to login
    window.location.href = '/login';
  }

  function init() {
    const container = document.getElementById('nav-container');
    if (!container) return;

    const activePage = getActivePage();

    const layout = document.createElement('div');
    layout.className = 'app-layout';
    layout.id = 'app-layout';

    const sidebar = createSidebar(activePage);
    layout.appendChild(sidebar);

    // Create toggle button outside the sidebar
    const collapsed = isSidebarCollapsed();
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle desktop-only';
    toggleBtn.id = 'sidebar-toggle-btn';
    toggleBtn.title = 'Toggle sidebar';
    toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
    toggleBtn.innerHTML = `<span class="material-icons-outlined" id="sidebar-toggle-icon">${collapsed ? 'chevron_right' : 'chevron_left'}</span>`;
    if (collapsed) {
      toggleBtn.style.left = 'var(--sidebar-collapsed)';
    }
    layout.appendChild(toggleBtn);

    const content = document.createElement('main');
    content.className = 'app-content';
    content.id = 'app-content';

    const children = Array.from(document.body.children);
    children.forEach(child => {
      if (child !== container && child.id !== 'app-layout') {
        content.appendChild(child);
      }
    });

    layout.appendChild(content);
    container.replaceWith(layout);

    const bottomNav = createBottomNav(activePage);
    document.body.appendChild(bottomNav);
    document.body.classList.add('has-bottom-nav');

    const toggleBtnEl = document.getElementById('sidebar-toggle-btn');
    if (toggleBtnEl) {
      toggleBtnEl.addEventListener('click', () => {
        const sb = document.getElementById('app-sidebar');
        if (!sb) return;
        const isCollapsed = sb.classList.toggle('collapsed');
        setSidebarCollapsed(isCollapsed);
        const icon = document.getElementById('sidebar-toggle-icon');
        if (icon) icon.textContent = isCollapsed ? 'chevron_right' : 'chevron_left';

        // Move the toggle button position
        toggleBtnEl.style.left = isCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

        const ct = document.getElementById('app-content');
        if (ct) {
          ct.style.marginLeft = isCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';
        }
      });
    }

    const moreBtn = document.getElementById('mobile-more-btn');
    if (moreBtn) {
      moreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer(activePage);
      });
    }

    syncAuth();

    if (window.TMFTheme) {
      window.TMFTheme.syncIcons();
      window.TMFTheme.syncLogos();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();