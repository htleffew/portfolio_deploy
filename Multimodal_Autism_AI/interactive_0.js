
    document.addEventListener('DOMContentLoaded', () => {
        // Profile Explorer Logic
        const patientData = {
            "PART_0012": {
                age: 100,
                behaviors: "High gaze (74.7%), 100% functional play",
                prob: "2.9%",
                ados: "3 / 18",
                rec: "Routine screening. Bayesian uncertainty was extremely low (0.003)."
            },
            "PART_0013": {
                age: 70,
                behaviors: "Typical gaze, reduced smiling, 50% functional play",
                prob: "26.2%",
                ados: "N/A",
                rec: "Continued surveillance. Predictions ranged wildly from 2.3% to 50.1% depending on the algorithm."
            },
            "PART_0032": {
                age: 76,
                behaviors: "Reduced gaze (36.2%), high phrase repetition",
                prob: "78.2%",
                ados: "9 / 18",
                rec: "Prompt comprehensive evaluation by a developmental specialist."
            }
        };

        const profileSelector = document.getElementById('profileSelector');
        function updateProfileCard(profileId) {
            const data = patientData[profileId];
            document.getElementById('cardTitle').innerText = profileId;
            document.getElementById('cardAge').innerText = data.age;
            document.getElementById('cardBehaviors').innerText = data.behaviors;
            document.getElementById('cardProb').innerText = data.prob;
            document.getElementById('cardAdos').innerText = data.ados;
            document.getElementById('cardRec').innerText = data.rec;
        }

        profileSelector.addEventListener('change', (e) => {
            updateProfileCard(e.target.value);
        });
        
        // Initialize spine intersection observer
        const sections = document.querySelectorAll('section.band');
        const spine = document.getElementById('spine');
        const topnav = document.getElementById('topnav');
        const status = document.getElementById('status');
        const pctEl = status ? status.querySelector('.pct') : null;
        
        const updateProgress = () => {
          const scroll = window.scrollY;
          const height = document.documentElement.scrollHeight - window.innerHeight;
          const p = Math.min(100, Math.max(0, (scroll / height) * 100));
          document.getElementById('progress').style.setProperty('--p', p + '%');
          if(pctEl) pctEl.innerText = Math.round(p) + '%';
        };
        window.addEventListener('scroll', updateProgress, {passive:true});
        updateProgress();
        
        if (spine) {
            spine.innerHTML = '';
            sections.forEach((sec, i) => {
                const label = sec.getAttribute('data-spine');
                if(!label) return;
                const row = document.createElement('div');
                row.className = 'row';
                if(i===0) row.classList.add('is-active');
                row.innerHTML = `<span class="num">0${i+1}</span><div class="tick"></div><span class="label">${label}</span>`;
                row.addEventListener('click', () => sec.scrollIntoView({behavior:'smooth'}));
                spine.appendChild(row);
                
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(e => {
                        if(e.isIntersecting) {
                            [...spine.children].forEach(c => c.classList.remove('is-active', 'is-paper-active'));
                            const isPaper = e.target.classList.contains('band--paper');
                            row.classList.add('is-active');
                            
                            if(isPaper) {
                                spine.classList.add('is-paper');
                                if(topnav) topnav.classList.add('is-paper');
                                if(status) status.classList.add('is-paper');
                            } else {
                                spine.classList.remove('is-paper');
                                if(topnav) topnav.classList.remove('is-paper');
                                if(status) status.classList.remove('is-paper');
                            }
                        }
                    });
                }, { threshold: 0.3 });
                observer.observe(sec);
            });
        }
    });
