/* ══════════════════════════════════════════════════════════
   TrackMyFund — Kinetics JS Helpers
   Spring-physics micro-interactions (kinetics.colorion.co)
   CDN: https://cdn.jsdelivr.net/gh/ckissi/kinetics@main/public/js/main.js
   ══════════════════════════════════════════════════════════ */
'use strict';

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Re-trigger a CSS class for a spring bump */
  function springBump(el, cls = 'bump', duration = 400) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), duration);
  }

  /** Ripple at pointer position */
  function addRipple(e) {
    const btn  = e.currentTarget;
    const r    = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const span = document.createElement('span');
    span.className   = 'k-ripple';
    span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size/2}px;top:${e.clientY - r.top - size/2}px`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 650);
  }

  /* ── Ripple ──────────────────────────────────────────── */
  $$('.ripple-surface').forEach(btn => btn.addEventListener('click', addRipple));

  /* ── Magnetic Button ─────────────────────────────────── */
  $$('.magnet-zone').forEach(zone => {
    const btn = $('.magnet-btn', zone);
    if (!btn) return;
    zone.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*0.35}px,${(e.clientY-(r.top+r.height/2))*0.35}px)`;
    });
    zone.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ── Accordion ───────────────────────────────────────── */
  $$('[data-k-accordion] .k-accordion-head').forEach(head => {
    head.addEventListener('click', () => head.closest('.k-accordion-item').classList.toggle('open'));
  });

  /* ── Dropdown ────────────────────────────────────────── */
  $$('.k-dropdown').forEach(drop => {
    const trigger = $('.k-dropdown-trigger', drop);
    if (!trigger) return;
    const close = () => { drop.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); };
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = drop.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', e => { if (!drop.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  });

  /* ── Tab Pill Glide ──────────────────────────────────── */
  $$('[data-k-tabs]').forEach(tabs => {
    const pill = $('.k-tab-pill', tabs);
    const btns = $$('.k-tab-btn', tabs);
    if (!pill || !btns.length) return;
    const move = t => { pill.style.left = t.offsetLeft+'px'; pill.style.width = t.offsetWidth+'px'; };
    const active = btns.find(b => b.classList.contains('active')) || btns[0];
    if (active) requestAnimationFrame(() => move(active));
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.toggle('active', x === b));
      move(b);
    }));
  });

  /* ── Modal ───────────────────────────────────────────── */
  $$('[data-k-modal]').forEach(modal => {
    const open  = () => { modal.classList.add('open');    document.body.style.overflow = 'hidden'; };
    const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
    document.querySelectorAll(`[data-k-modal-open="${modal.id}"]`).forEach(btn => btn.addEventListener('click', open));
    $$('[data-k-modal-close],[data-close]', modal).forEach(btn => btn.addEventListener('click', close));
    modal.querySelector('.k-modal-backdrop')?.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
    modal._kOpen = open; modal._kClose = close;
  });

  /* ── Toast / Notify (global helper) ─────────────────── */
  window.kShowToast = (el, duration = 2400) => {
    if (!el) return;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duration);
  };

  /* ── Snackbar Trigger ────────────────────────────────── */
  $$('[data-k-snackbar-trigger]').forEach(btn => {
    const bar = document.getElementById(btn.dataset.kSnackbarTrigger);
    if (!bar) return;
    let timer;
    btn.addEventListener('click', () => {
      clearTimeout(timer);
      bar.classList.add('show');
      timer = setTimeout(() => bar.classList.remove('show'), 3000);
    });
    bar.querySelector('[data-k-snackbar-close]')?.addEventListener('click', () => {
      clearTimeout(timer); bar.classList.remove('show');
    });
  });

  /* ── Toggle / Copy ──────────────────────────────────── */
  $$('.k-switch').forEach(sw => sw.addEventListener('click', () => sw.classList.toggle('on')));

  $$('.k-copy-btn').forEach(btn => {
    const lbl = btn.querySelector('.k-copy-label');
    let t;
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy || ''); } catch (_) {}
      btn.classList.add('copied'); if (lbl) lbl.textContent = 'Copied';
      clearTimeout(t);
      t = setTimeout(() => { btn.classList.remove('copied'); if (lbl) lbl.textContent = 'Copy'; }, 1400);
    });
  });

  /* ── Stagger ─────────────────────────────────────────── */
  $$('.k-stagger').forEach(list => {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) list.classList.add('in'); });
      }, { threshold: 0.2 }).observe(list);
    } else list.classList.add('in');
  });
  $$('.k-split[data-split-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => el.classList.add('in'));
    el.addEventListener('mouseleave', () => el.classList.remove('in'));
  });

  /* ── Stepper / Chip / Stars ──────────────────────────── */
  $$('[data-k-stepper]').forEach(stepper => {
    const v = stepper.querySelector('.k-val');
    if (!v) return;
    let n = parseInt(v.textContent, 10) || 0;
    stepper.querySelectorAll('[data-dir]').forEach(btn => {
      btn.addEventListener('click', () => {
        n = Math.max(0, n + (parseInt(btn.dataset.dir,10)||0));
        v.textContent = n; springBump(v);
      });
    });
  });
  $$('.k-chip').forEach(c => c.addEventListener('click', () => { c.classList.toggle('on'); springBump(c,'pop',300); }));
  $$('[data-k-rating]').forEach(rating => {
    const stars = $$('.k-star', rating);
    const paint = n => stars.forEach((s,i) => s.classList.toggle('on', i<n));
    const cur   = () => parseInt(rating.dataset.value,10)||0;
    stars.forEach(star => {
      const n = parseInt(star.dataset.i,10);
      star.addEventListener('mouseenter',()=>paint(n));
      star.addEventListener('click',()=>{ rating.dataset.value=n; paint(n); springBump(star,'pop',260); });
    });
    rating.addEventListener('mouseleave',()=>paint(cur()));
  });

  /* ── Tilt ────────────────────────────────────────────── */
  $$('.tilt-zone').forEach(zone => {
    const card = zone.querySelector('.tilt-card');
    if (!card) return;
    zone.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.transform = `rotateX(${((e.clientY-r.top)/r.height-0.5)*-14}deg) rotateY(${((e.clientX-r.left)/r.width-0.5)*14}deg)`;
    });
    zone.addEventListener('mouseleave', () => { card.style.transform=''; });
  });

  /* ── Drag-to-dismiss ─────────────────────────────────── */
  $$('.k-drag-card').forEach(card => {
    let sx=0,x=0,drag=false;
    const reset=()=>{ x=0; card.style.transform=''; card.style.opacity=''; };
    card.addEventListener('pointerdown',e=>{ drag=true;sx=e.clientX; card.classList.add('dragging'); card.setPointerCapture(e.pointerId); });
    card.addEventListener('pointermove',e=>{ if(!drag)return; x=e.clientX-sx; card.style.transform=`translateX(${x}px) rotate(${x*0.04}deg)`; card.style.opacity=Math.max(1-Math.abs(x)/260,0.25); });
    card.addEventListener('pointerup',()=>{ if(!drag)return; drag=false; card.classList.remove('dragging'); if(Math.abs(x)>100){const s=x>0?1:-1;card.style.transform=`translateX(${s*400}px) rotate(${s*24}deg)`;card.style.opacity='0';setTimeout(reset,500);}else reset(); });
  });

  /* ── Swipe-to-reveal ─────────────────────────────────── */
  $$('.k-swipe-item').forEach(item => {
    let sx=0,dx=0,drag=false;
    item.addEventListener('pointerdown',e=>{ drag=true;sx=e.clientX;dx=0; item.classList.add('dragging');item.classList.remove('open');item.setPointerCapture(e.pointerId); });
    item.addEventListener('pointermove',e=>{ if(!drag)return; dx=Math.min(0,e.clientX-sx); item.style.transform=`translateX(${dx}px)`; });
    item.addEventListener('pointerup',()=>{ if(!drag)return; drag=false; item.classList.remove('dragging'); item.style.transform=''; if(dx<=-96)item.classList.add('open'); });
  });

  /* ── Step Progress ───────────────────────────────────── */
  $$('[data-k-steps]').forEach(container => {
    const nodes=$$('.k-step-node',container), fill=container.querySelector('.k-steps-track-fill'), btn=container.querySelector('[data-k-step-next]'), count=nodes.length;
    let cur=1;
    const apply=n=>{ cur=n; nodes.forEach((node,i)=>node.classList.toggle('active',i<n)); if(fill&&count>1)fill.style.transform=`scaleX(${(n-1)/(count-1)})`; };
    apply(1); btn?.addEventListener('click',()=>apply((cur%count)+1));
  });

  /* ── Odometer count-up ───────────────────────────────── */
  $$('[data-k-countup]').forEach(el => {
    const target=parseInt(el.dataset.kCountup,10)||0; let done=false;
    const run=()=>{ if(done)return;done=true; const dur=1400,t0=performance.now(); const step=t=>{ const p=Math.min((t-t0)/dur,1); el.textContent=Math.round(target*(1-Math.pow(1-p,3))).toLocaleString('en-IN'); if(p<1)requestAnimationFrame(step);else el.textContent=target.toLocaleString('en-IN'); }; requestAnimationFrame(step); };
    if('IntersectionObserver'in window)new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting)run();});},{threshold:0.5}).observe(el); else run();
  });

  /* ── Expose API ──────────────────────────────────────── */
  window.Kinetics = { springBump, addRipple };

})();
