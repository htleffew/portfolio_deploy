
const PREVIEWS_DISCARDED = {
  'implicit-power-drives': {
    eyebrow: 'Note 04 / Doctoral research',
    title: 'Implicit power drives',
    desc: 'Clinical validation framework quantifying behavioral typologies using T-tests and linguistic predictive limits in written manifestos.',
    foot: '12 min read / Dissertation chapter',
  },
  'credit-fairness': {
    eyebrow: 'Note 12 / Model validation',
    title: 'Credit policy fairness',
    desc: '100,000+ applicant simulation using SHAP to audit fairness and validate a 20.9% equitable approval shift.',
    foot: '8 min read / Production audit',
  },
  'entity-resolution': {
    eyebrow: 'Note 03 / Production pipeline',
    title: 'Entity resolution pipeline',
    desc: 'A 15-step distributed graph-ML pipeline for semantic identity fusion across 49TB of streaming vendor records.',
    foot: '14 min read / Spokeo',
  },
};

/* ============================================================
   SPINE, generated from sections with [data-spine]
   ============================================================ */
const spine = document.getElementById('spine');
const sections = [...document.querySelectorAll('[data-spine]')];
sections.forEach((s, i) => {
  const r = document.createElement('div');
  r.className = 'row'; r.dataset.idx = i;
  r.innerHTML = `<span class="num">${String(i+1).padStart(2,'0')}</span><span class="tick"></span><span class="label">${s.dataset.spine}</span>`;
  r.addEventListener('click', () => s.scrollIntoView({behavior:'smooth', block:'start'}));
  spine.appendChild(r);
});

/* ============================================================
   SCROLL ENGINE, progress, status, mode, spine, reveals
   ============================================================ */
const progress = document.getElementById('progress');
const topnav = document.getElementById('topnav');
const status = document.getElementById('status');
const statusSec = status.querySelector('.sec');
const statusPct = status.querySelector('.pct');
const atmosphere = document.querySelector('.atmosphere');
const reveals = [...document.querySelectorAll('.reveal')];
const spineRows = [...spine.querySelectorAll('.row')];

const onScroll = () => {
  const h = document.documentElement;
  const y = window.scrollY;
  const max = h.scrollHeight - window.innerHeight;
  const p = Math.min(1, Math.max(0, y / max));
  progress.style.setProperty('--p', (p * 100).toFixed(2) + '%');
  statusPct.textContent = Math.round(p * 100) + '%';

  // Find the section currently dominant near top of viewport
  const trigger = window.innerHeight * 0.32;
  let activeIdx = 0;
  for (let i = 0; i < sections.length; i++) {
    const r = sections[i].getBoundingClientRect();
    if (r.top <= trigger) activeIdx = i;
  }
  const active = sections[activeIdx];
  const mode = [...active.classList].find(c => c.startsWith('band--'));
  const isPaper = mode !== 'band--paper';

  statusSec.textContent = active.dataset.section;
  spineRows.forEach((row, i) => {
    row.classList.toggle('is-active', i === activeIdx);
    row.classList.toggle('is-paper-active', i === activeIdx && isPaper);
  });

  topnav.classList.toggle('is-paper', isPaper);
  status.classList.toggle('is-paper', isPaper);
  spine.classList.toggle('is-paper', isPaper);

  // Reveals
  reveals.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) el.classList.add('is-on');
  });

  // Parallax on figures (subtle)
  document.querySelectorAll('.parallax').forEach(el => {
    const r = el.getBoundingClientRect();
    const center = r.top + r.height / 2 - window.innerHeight / 2;
    el.style.transform = `translate3d(0, ${(-center * 0.04).toFixed(1)}px, 0)`;
  });
};
window.addEventListener('scroll', onScroll, { passive:true });
window.addEventListener('resize', onScroll);
onScroll();

/* ============================================================
   HOVER PREVIEWS
   ============================================================ */
const hp = document.getElementById('hover-preview');
const hpEb = hp.querySelector('.h-eb');
const hpTi = hp.querySelector('.h-t');
const hpDs = hp.querySelector('.h-d');
const hpFt = hp.querySelector('.h-ft');
let hpTimer;
document.querySelectorAll('.xlink').forEach(a => {
  a.addEventListener('mouseenter', e => {
    const id = a.dataset.previewId;
    if (!id || !PREVIEWS[id]) return;
    const d = PREVIEWS[id];
    hpEb.textContent = d.eyebrow;
    hpTi.textContent = d.title;
    hpDs.textContent = d.desc;
    hpFt.textContent = d.foot;
    // Position
    const r = a.getBoundingClientRect();
    let x = r.left;
    let y = r.bottom + 12;
    const w = 340, h = 180;
    if (x + w > window.innerWidth - 16) x = window.innerWidth - w - 16;
    if (y + h > window.innerHeight - 16) y = r.top - h - 12;
    hp.style.left = x + 'px';
    hp.style.top  = y + 'px';
    // Sync mode of the preview to the section the link sits in
    const inPaper = a.closest('.band--paper') !== null;
    hp.classList.toggle('is-paper', inPaper);
    clearTimeout(hpTimer);
    hp.classList.add('is-on');
  });
  a.addEventListener('mouseleave', () => {
    hpTimer = setTimeout(() => hp.classList.remove('is-on'), 80);
  });
});

/* ============================================================
   SIDENOTES
   - Wide viewport: position each .sn-body in the right gutter,
     vertically aligned with its inline .sn-num marker.
   - Narrow viewport: tap to toggle inline footnote.
   ============================================================ */
function layoutSidenotes() {
  if (window.innerWidth < 1080) return;
  document.querySelectorAll('p.col-with-sidenotes').forEach(p => {
    const pRect = p.getBoundingClientRect();
    let lastBottom = -9999;
    p.querySelectorAll('.sn').forEach(sn => {
      const num = sn.querySelector('.sn-num');
      const body = sn.querySelector('.sn-body');
      if (!num || !body) return;
      const numRect = num.getBoundingClientRect();
      // top relative to paragraph
      let top = numRect.top - pRect.top - 2;
      // avoid stacking, push down if previous note's bottom would overlap
      if (top < lastBottom + 12) top = lastBottom + 12;
      body.style.top = top + 'px';
      // remember bottom (estimate height: 240px wide, lh ~1.55, ~13.5px -> ~3 lines avg)
      const bodyH = body.offsetHeight || 80;
      lastBottom = top + bodyH;
    });
  });
}
window.addEventListener('load', layoutSidenotes);
window.addEventListener('resize', layoutSidenotes);
// Also re-layout after fonts settle
if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutSidenotes);

document.querySelectorAll('.sn-num').forEach(n => {
  n.addEventListener('click', () => {
    if (window.innerWidth >= 1080) return;
    const body = n.parentElement.querySelector('.sn-body');
    if (body) body.classList.toggle('is-open');
  });
});
