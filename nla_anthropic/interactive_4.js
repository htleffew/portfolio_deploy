
window.addEventListener('load', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  function animateCounter(el) {
    var target   = parseFloat(el.dataset.target);
    var suffix   = el.dataset.suffix || '';
    var decimals = parseInt(el.dataset.decimals || '0');
    var dur      = parseFloat(el.dataset.duration || '2');

    gsap.to({ val: 0 }, {
      val: target,
      duration: dur,
      ease: 'power2.out',
      onUpdate: function () {
        el.textContent = this.targets()[0].val.toFixed(decimals) + suffix;
      }
    });
  }

  function startCounters() {
    document.querySelectorAll('[data-counter]').forEach(animateCounter);
  }

  ScrollTrigger.create({
    trigger: '[data-counter]',
    start: 'top 80%',
    onEnter: startCounters,
    once: true
  });
});
