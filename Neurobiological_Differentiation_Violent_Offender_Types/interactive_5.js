
// Async recommendation populator stripped; global.js handles it
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const pathPrefix = window.location.pathname.includes('projects-repository.html') ? './' : '../';
        const response = await fetch(pathPrefix + 'projects_index.json');
        if (!response.ok) return;
        const projects = await response.json();
        
        const currentPath = window.location.pathname;
        let me = projects.find(p => currentPath.includes(p.id));
        if (!me) me = projects[0]; // fallback
        
        // 1. Populate Recommendations
        if (document.getElementById('recommendation-grid')) {
            let scored = projects.map(p => {
                if (p.id === me.id) return { ...p, score: -1 }; 
                let score = 0;
                if(p.tags && me.tags) {
                    p.tags.forEach(t => { if (me.tags.includes(t)) score++; });
                }
                if (p.cat === me.cat) score += 0.5;
                return { ...p, score };
            });
            scored.sort((a, b) => b.score - a.score);
            const top3 = scored.slice(0, 3);

            const grid = document.getElementById('recommendation-grid');
            grid.innerHTML = '';
            top3.forEach(p => {
                const card = document.createElement('a');
                card.href = pathPrefix + p.url;
                card.className = 'r-card';
                card.innerHTML = `
                    <div class="eb">${p.cat}</div>
                    <div class="ti">${p.title}</div>
                    <div class="ds">${p.desc.substring(0, 100)}...</div>
                    <div class="ar">Read More &rarr;</div>
                `;
                grid.appendChild(card);
            });
        }
        
        // 2. Populate Next Chapter
        const nextChapLink = document.getElementById('next-chap-link');
        const nextChapTitle = document.getElementById('next-chap-title');
        if (nextChapLink && nextChapTitle) {
            let currentIndex = projects.findIndex(p => p.id === me.id);
            if (currentIndex === -1) currentIndex = 0;
            let nextIndex = (currentIndex + 1) % projects.length;
            let nextProj = projects[nextIndex];
            
            nextChapLink.href = pathPrefix + nextProj.url;
            nextChapTitle.textContent = nextProj.title;
        }

    } catch(e) {
        console.log("Global Frame JS resting.");
    }
});
