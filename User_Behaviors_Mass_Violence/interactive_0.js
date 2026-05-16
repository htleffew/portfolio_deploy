
  document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section.band');
    const spine = document.getElementById('spine');
    const topnav = document.getElementById('topnav');
    const status = document.getElementById('status');
    const pctEl = status ? status.querySelector('.pct') : null;

    const updateProgress = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(100, Math.max(0, (scroll / height) * 100));
      const progressEl = document.getElementById('progress');
      if (progressEl) progressEl.style.setProperty('--p', p + '%');
      if (pctEl) pctEl.innerText = Math.round(p) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    if (spine) {
      spine.innerHTML = '';
      sections.forEach((sec, i) => {
        const label = sec.getAttribute('data-spine');
        if (!label) return;
        const row = document.createElement('div');
        row.className = 'row';
        if (i === 0) row.classList.add('is-active');
        row.innerHTML = `<span class="num">0${i + 1}</span><div class="tick"></div><span class="label">${label}</span>`;
        row.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth' }));
        spine.appendChild(row);

        const observer = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              [...spine.children].forEach(c => c.classList.remove('is-active', 'is-paper-active'));
              const isPaper = e.target.classList.contains('band--paper');
              row.classList.add('is-active');
              if (isPaper) {
                spine.classList.add('is-paper');
                if (topnav) topnav.classList.add('is-paper');
                if (status) status.classList.add('is-paper');
              } else {
                spine.classList.remove('is-paper');
                if (topnav) topnav.classList.remove('is-paper');
                if (status) status.classList.remove('is-paper');
              }
            }
          });
        }, { threshold: 0.3 });
        observer.observe(sec);
      });
    }

    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-on'); });
    }, { threshold: 0.15 });
    reveals.forEach(el => revealObs.observe(el));

    /* --- Warning Behavior x Stage Matrix interaction --- */
    const behaviorItems = document.querySelectorAll('.behavior-item');
    const matrixCols = document.querySelectorAll('.matrix-col');
    const statusText = document.getElementById('behaviorStatusText');

    function activateBehavior(item) {
      behaviorItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      const stages = (item.dataset.stages || '').split(',').map(s => s.trim()).filter(Boolean);
      matrixCols.forEach(col => {
        col.classList.toggle('is-stage-active', stages.includes(col.dataset.stage));
      });
      if (statusText) statusText.textContent = 'Active: ' + item.textContent.trim();
    }

    behaviorItems.forEach(item => {
      item.addEventListener('click', () => activateBehavior(item));
    });

    // Initialize with the first item already marked is-active
    const initial = document.querySelector('.behavior-item.is-active');
    if (initial) activateBehavior(initial);
  });
