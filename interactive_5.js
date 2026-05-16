
document.getElementById('year').textContent = new Date().getFullYear();

// Simple navigation mode observer
(function initNavMode() {
  const nav = document.getElementById('topnav');
  const bands = document.querySelectorAll('[data-mode]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.classList.toggle('is-paper', entry.target.dataset.mode === 'paper');
      }
    });
  }, { rootMargin: "-15% 0px -84% 0px" });
  bands.forEach(b => observer.observe(b));
})();

// Basic tooltip interaction for demo
document.querySelectorAll('.gloss').forEach(gloss => {
    gloss.addEventListener('mouseenter', () => {
        const tip = gloss.querySelector('.gloss-tip');
        if(tip) tip.style.cssText += 'visibility:visible; opacity:1;';
    });
    gloss.addEventListener('mouseleave', () => {
        const tip = gloss.querySelector('.gloss-tip');
        if(tip) tip.style.cssText += 'visibility:hidden; opacity:0;';
    });
});
