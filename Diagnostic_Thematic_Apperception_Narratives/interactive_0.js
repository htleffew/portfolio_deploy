
document.addEventListener('DOMContentLoaded', () => {

    /* --- Spine Observer Logic --- */
    const spine = document.getElementById('spine');
    const sections = Array.from(document.querySelectorAll('section[data-spine]'));
    sections.forEach((sec, i) => {
      const row = document.createElement('div');
      row.className = 'row';
      const isPaper = sec.classList.contains('band--paper');
      row.innerHTML = `<div class="num">0${i+1}</div><div class="tick"></div><div class="label">${sec.getAttribute('data-spine')}</div>`;
      row.addEventListener('click', () => { sec.scrollIntoView({ behavior:'smooth' }); });
      spine.appendChild(row);
    });
    
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting) {
          const idx = sections.indexOf(e.target);
          Array.from(spine.children).forEach((child, i) => {
            child.classList.remove('is-active', 'is-paper-active');
            if(i === idx) {
              const isPaper = e.target.classList.contains('band--paper');
              child.classList.add(isPaper ? 'is-paper-active' : 'is-active');
              const topnavEl = document.getElementById('topnav');
              const spineEl = document.getElementById('spine');
              if(isPaper) {
                if (topnavEl) topnavEl.classList.add('is-paper');
                if (spineEl) spineEl.classList.add('is-paper');
              } else {
                if (topnavEl) topnavEl.classList.remove('is-paper');
                if (spineEl) spineEl.classList.remove('is-paper');
              }
            }
          });
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    sections.forEach(s => obs.observe(s));

    /* --- LIWC Means by Card, normalized to per-axis max across the 5 high-frequency cards --- */
    const dimensions = ["anx", "anger", "sad", "achieve", "power", "death"];
    // Raw means from MANOVA: Cards 1, 2, 3BM, 4, 8BM
    // Card 1:   anx 0.76, anger 0.75, sad 1.18, achieve 2.40, power 1.76, death 0.00
    // Card 3BM: anx 1.11, anger 0.61, sad 2.56, achieve 0.99, power 2.55, death 0.26
    // Card 8BM: anx 0.42, anger 0.94, sad 0.32, achieve 1.24, power 2.87, death 1.37
    // Per-axis max: anx 1.11, anger 1.15, sad 2.56, achieve 2.40, power 2.87, death 1.37
    const card1Data    = [0.68, 0.65, 0.46, 1.00, 0.61, 0.00]; // achievement signature
    const card3bmData  = [1.00, 0.53, 1.00, 0.41, 0.89, 0.19]; // anxiety/sadness signature
    const card8bmData  = [0.38, 0.82, 0.13, 0.52, 1.00, 1.00]; // power/death signature
    const R = 160;

    const axesGroup = document.getElementById('radar-axes');
    const labelsGroup = document.getElementById('radar-labels');
    const polygon = document.getElementById('radar-polygon');
    const pointsGroup = document.getElementById('radar-points');

    function getCoordinates(value, index, total) {
        // -PI/2 shifts the start to the top (12 o'clock)
        const angle = (Math.PI * 2 * index / total) - (Math.PI / 2);
        const r = value * R;
        return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
    }

    // Draw static axes and labels
    dimensions.forEach((dim, i) => {
        const { x, y } = getCoordinates(1.0, i, dimensions.length);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0); line.setAttribute('y1', 0);
        line.setAttribute('x2', x); line.setAttribute('y2', y);
        axesGroup.appendChild(line);
        
        // Offset labels slightly beyond the edge (1.15 multiplier)
        const { x: lx, y: ly } = getCoordinates(1.15, i, dimensions.length);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', lx); text.setAttribute('y', ly);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'middle');
        text.textContent = dim;
        labelsGroup.appendChild(text);
    });

    // Initialize stateful point elements
    const pointEls = [];
    dimensions.forEach(() => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', 4);
        circle.style.transition = 'cx 0.8s cubic-bezier(0.16,1,0.3,1), cy 0.8s cubic-bezier(0.16,1,0.3,1), fill 0.8s cubic-bezier(0.16,1,0.3,1)';
        pointsGroup.appendChild(circle);
        pointEls.push(circle);
    });

    // Per-card color theming
    const cardThemes = {
        card1:   { point: '#DBA844', fill: 'rgba(219, 168, 68, 0.30)', stroke: '#DBA844' }, // hansa / achievement
        card3bm: { point: '#7A1626', fill: 'rgba(122, 22, 38, 0.32)',  stroke: '#7A1626' }, // alizarin / distress
        card8bm: { point: '#3D1F4A', fill: 'rgba(61, 31, 74, 0.40)',   stroke: '#7A52A0' }  // dioxazine / power+death
    };

    function updateRadar(dataArray, key) {
        const theme = cardThemes[key];
        let pathD = "";
        dataArray.forEach((val, i) => {
            const { x, y } = getCoordinates(val, i, dimensions.length);
            if(i === 0) pathD += `M ${x} ${y} `;
            else pathD += `L ${x} ${y} `;
            pointEls[i].setAttribute('cx', x);
            pointEls[i].setAttribute('cy', y);
            pointEls[i].setAttribute('fill', theme.point);
        });
        pathD += "Z";
        polygon.setAttribute('d', pathD);
        polygon.setAttribute('fill', theme.fill);
        polygon.setAttribute('stroke', theme.stroke);
    }

    // Initial state: Card 1 / Achievement
    updateRadar(card1Data, 'card1');

    function bindRadarButton(btnId, data, key) {
        document.getElementById(btnId).addEventListener('click', function() {
            document.querySelectorAll('.sim-btn').forEach(b => b.classList.remove('is-active'));
            this.classList.add('is-active');
            updateRadar(data, key);
        });
    }
    bindRadarButton('btn-card1',   card1Data,   'card1');
    bindRadarButton('btn-card3bm', card3bmData, 'card3bm');
    bindRadarButton('btn-card8bm', card8bmData, 'card8bm');

    /* -- Reveal classes -- */
    const reveals = document.querySelectorAll('.reveal');
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting) { e.target.classList.add('is-on'); revObs.unobserve(e.target); }
      });
    }, { rootMargin:"0px 0px -10% 0px" });
    reveals.forEach(r => revObs.observe(r));

    window.addEventListener('scroll', () => {
      const p = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
      document.body.style.setProperty('--p', (p*100)+'%');
    });
});
