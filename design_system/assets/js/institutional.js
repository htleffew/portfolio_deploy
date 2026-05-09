/**
 * Portfolio Institutional Design System
 * Centralized Engine for Layout, Sidenotes, and Scroll State
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INJECT GLOBAL CHROME
    // ============================================================
    // If the topnav doesn't exist, inject the chrome elements dynamically
    if (!document.getElementById('topnav')) {
        const atmosphere = document.querySelector('.atmosphere');
        
        const cat = document.body.dataset.category || 'Institutional Portfolio';
        const title = document.body.dataset.title || '';
        
        let crumbsHTML = `<a href="../index.html">&larr; Writing</a>`;
        if (cat) crumbsHTML += ` <span class="sep">/</span> <span>${cat}</span>`;
        if (title) crumbsHTML += ` <span class="sep">/</span> <span>${title}</span>`;

        // Construct the Chrome HTML
        const chromeHTML = `
            <!-- Reading progress -->
            <div id="progress"></div>

            <!-- Top nav -->
            <header id="topnav">
              <a href="../index.html" class="brand">Dr. Heather Leffew</a>
              <div class="crumbs">
                ${crumbsHTML}
              </div>
              <div style="margin-left:auto; font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase;">
                <a href="../projects-repository.html" style="color:var(--platinum); text-decoration:none; transition:color 0.3s;">Research Library</a>
              </div>
            </header>

            <!-- Chapter spine -->
            <aside id="spine"></aside>

            <!-- Reading status -->
            <div id="status">
              <span class="dot"></span>
              <span class="sec">Front matter</span>
              <span class="pct">0%</span>
            </div>
        `;

        if (atmosphere) {
            atmosphere.insertAdjacentHTML('afterend', chromeHTML);
        } else {
            document.body.insertAdjacentHTML('afterbegin', chromeHTML);
        }
    }

    // 2. LAYOUT SIDENOTES (Tufte Engine)
    // ============================================================
    function layoutSidenotes() {
      if (window.innerWidth < 1240) {
          document.querySelectorAll('p.col-with-sidenotes').forEach(p => p.style.minHeight = 'auto');
          return;
      }
      document.querySelectorAll('p.col-with-sidenotes').forEach(p => {
        const pRect = p.getBoundingClientRect();
        let lastBottom = 0;
        p.querySelectorAll('.sn').forEach(sn => {
          const num = sn.querySelector('.sn-num');
          const body = sn.querySelector('.sn-body');
          if (!num || !body) return;
          const numRect = num.getBoundingClientRect();
          let top = numRect.top - pRect.top - 2;
          if (top < lastBottom + 12) top = lastBottom + 12;
          body.style.top = top + 'px';
          const bodyH = body.offsetHeight || 80;
          lastBottom = top + bodyH;
        });
        p.style.minHeight = 'auto'; // Let the grid flow natively
      });
    }

    window.addEventListener('resize', layoutSidenotes);
    
    // Safe simulation hook for case studies with interactive mathematical sandboxes
    window.addEventListener('load', () => { 
        if (typeof updateSimulation === 'function') {
            updateSimulation(); 
        }
        layoutSidenotes(); 
    });
    
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(layoutSidenotes);
    }

    document.querySelectorAll('.sn-num').forEach(n => {
      n.addEventListener('click', () => {
        if (window.innerWidth >= 1080) return;
        const body = n.parentElement.querySelector('.sn-body');
        if (body) body.classList.toggle('is-open');
      });
    });


    // 3. SCROLL ENGINE (Spine, Progress, Reveals)
    // ============================================================
    const spine = document.getElementById('spine');
    const sections = [...document.querySelectorAll('[data-spine]')];
    
    // Build the spine rows dynamically based on the page's sections
    if (spine && sections.length > 0) {
        sections.forEach((s, i) => {
          const r = document.createElement('div');
          r.className = 'row'; r.dataset.idx = i;
          r.innerHTML = `<span class="num">${String(i+1).padStart(2,'0')}</span><span class="tick"></span><span class="label">${s.dataset.spine}</span>`;
          r.addEventListener('click', () => s.scrollIntoView({behavior:'smooth', block:'start'}));
          spine.appendChild(r);
        });
    }

    const progress = document.getElementById('progress');
    const topnav = document.getElementById('topnav');
    const status = document.getElementById('status');
    const statusSec = status ? status.querySelector('.sec') : null;
    const statusPct = status ? status.querySelector('.pct') : null;
    const reveals = [...document.querySelectorAll('.reveal')];
    const spineRows = spine ? [...spine.querySelectorAll('.row')] : [];

    const onScroll = () => {
      const h = document.documentElement;
      const y = window.scrollY;
      const max = h.scrollHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, max > 0 ? y / max : 0));
      
      if (progress) progress.style.setProperty('--p', (p * 100).toFixed(2) + '%');
      if (statusPct) statusPct.textContent = Math.round(p * 100) + '%';

      const trigger = window.innerHeight * 0.32;
      let activeIdx = 0;
      for (let i = 0; i < sections.length; i++) {
        const r = sections[i].getBoundingClientRect();
        if (r.top <= trigger) activeIdx = i;
      }
      
      if (sections.length > 0) {
          const active = sections[activeIdx];
          const mode = [...active.classList].find(c => c.startsWith('band--'));
          const isPaper = mode === 'band--paper';

          if (statusSec) statusSec.textContent = active.dataset.section || active.dataset.spine;
          
          spineRows.forEach((row, i) => {
            row.classList.toggle('is-active', i === activeIdx);
            row.classList.toggle('is-paper-active', i === activeIdx && isPaper);
          });

          if (topnav) topnav.classList.toggle('is-paper', isPaper);
          if (status) status.classList.toggle('is-paper', isPaper);
          if (spine) spine.classList.toggle('is-paper', isPaper);
      }

      reveals.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92) el.classList.add('is-on');
      });
    };
    
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll);
    
    // 4. RECOMMENDED NEXT READS ENGINE
    // ============================================================
    try {
        fetch('../projects_index.json')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(projects => {
                const currentPath = window.location.pathname;
                const me = projects.find(p => currentPath.includes(p.id));
                if (!me || !me.tags) return;

                let scored = projects.map(p => {
                    if (p.id === me.id) return { ...p, score: -1 }; 
                    let score = 0;
                    if(p.tags) {
                        p.tags.forEach(t => {
                            if (me.tags.includes(t)) score++;
                        });
                    }
                    if (p.cat === me.cat) score += 0.5;
                    return { ...p, score };
                });

                scored.sort((a, b) => b.score - a.score);
                const top3 = scored.slice(0, 3);

                const grid = document.getElementById('recommendation-grid');
                if (grid) {
                    top3.forEach(p => {
                        const card = document.createElement('a');
                        card.href = '../' + p.url;
                        card.style.cssText = 'display:flex; flex-direction:column; padding:32px; background:var(--charcoal, #161616); border:1px solid var(--graphite, #222222); text-decoration:none; color:inherit; transition:border-color 0.4s ease, background 0.4s ease; border-radius:0 !important;';
                        card.onmouseover = () => { card.style.borderColor = 'var(--phthalo-lift, #3866A0)'; card.style.background = 'var(--obsidian, #030303)'; };
                        card.onmouseout = () => { card.style.borderColor = 'var(--graphite, #222222)'; card.style.background = 'var(--charcoal, #161616)'; };
                        
                        card.innerHTML = `
                            <div style="font-family:var(--mono, monospace); font-size:10px; color:var(--phthalo-lift, #3866A0); margin-bottom:16px; text-transform:uppercase; letter-spacing:0.18em;">${p.cat}</div>
                            <h3 style="font-family:var(--display, serif); font-size:22px; font-weight:600; color:var(--flare, #fff); margin-bottom:12px; line-height:1.2; letter-spacing:-0.015em;">${p.title}</h3>
                            <p style="font-family:var(--body, serif); font-size:14px; color:var(--tungsten, #A1A1A6); line-height:1.78; margin:0; flex-grow:1;">${p.desc.substring(0, 120)}...</p>
                            <div style="font-family:var(--mono, monospace); font-size:10px; color:var(--platinum, #F5F5F7); margin-top:24px; text-transform:uppercase; letter-spacing:0.18em; opacity:0.6; display:flex; align-items:center; gap:8px;">Read More <span style="color:var(--phthalo-lift, #3866A0)">&rarr;</span></div>
                        `;
                        grid.appendChild(card);
                    });
                }
            });
    } catch(e) {
        console.log('Recommendation engine resting.');
    }
});
