/* ============================================================
   institutional.js - Reveal Orchestration + Reading Engine

   Pages link three script tags in this order:
     <script src=".../js/cinematic_engine_v3.js" defer></script>
     <script src=".../js/global_chrome.js"        defer></script>
     <script src=".../js/institutional.js"         defer></script>

   Contents:
     - GSAP-driven hero reveal cascade + ScrollTrigger band reveals
     - Lenis smooth-scroll bootstrap, scroll progress, nav mode toggle
     - Spine + sidenotes reading engine for case-study pages

   Generated 2026-06-05 from global.js (mountOrchestration IIFE) +
   design_system/assets/js/institutional.js (spine + sidenotes).
   ============================================================ */
// ==========================================
// GLOBAL CINEMATIC REVEAL ORCHESTRATION
// Self-bootstrapping: dynamically loads GSAP + companions if absent.
// Pages need ZERO additional script tags beyond global.js.
// ==========================================
(function mountOrchestration() {
    const gsapDeps = [
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js',
        'https://unpkg.com/split-type',
        'https://cdn.jsdelivr.net/npm/@hyperframes/shader-transitions@0.4.45/dist/index.global.js'
    ];

    const alreadyLoaded = (url) => {
        if (url.includes('gsap.min')      && typeof gsap !== 'undefined')          return true;
        if (url.includes('ScrollTrigger') && typeof ScrollTrigger !== 'undefined') return true;
        if (url.includes('lenis')         && typeof Lenis !== 'undefined')         return true;
        if (url.includes('split-type')    && typeof SplitType !== 'undefined')     return true;
        if (url.includes('shader-transitions') && typeof HyperShader !== 'undefined') return true;
        return false;
    };

    const loadSeq = (urls, cb) => {
        if (!urls.length) { cb(); return; }
        if (alreadyLoaded(urls[0])) { loadSeq(urls.slice(1), cb); return; }
        const s = document.createElement('script');
        s.src = urls[0];
        s.onload  = () => loadSeq(urls.slice(1), cb);
        s.onerror = () => loadSeq(urls.slice(1), cb);
        document.head.appendChild(s);
    };

    window.ensureDependenciesLoaded = (cb) => {
        loadSeq(gsapDeps, cb);
    };

    window.initGlobalLenis = () => {
        window.ensureDependenciesLoaded(() => {
            if (window.activeLenis) {
                if (typeof window.activeLenis.destroy === 'function') {
                    window.activeLenis.destroy();
                }
                window.activeLenis = null;
            }
            
            if (typeof Lenis !== 'undefined') {
                const lenis = new Lenis({
                    duration: 1.4,
                    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true
                });
                window.activeLenis = lenis;
                // Force scroll to top immediately upon Lenis initialization
                window.scrollTo(0, 0);
                lenis.scrollTo(0, { immediate: true });
                
                if (typeof gsap !== 'undefined') {
                    if (!window._gsapTickerAdded) {
                        gsap.ticker.add((time) => {
                            if (window.activeLenis && typeof window.activeLenis.raf === 'function') {
                                window.activeLenis.raf(time * 1000);
                            }
                        });
                        gsap.ticker.lagSmoothing(0);
                        window._gsapTickerAdded = true;
                    }
                } else {
                    const raf = (time) => {
                        if (window.activeLenis === lenis) {
                            lenis.raf(time);
                            requestAnimationFrame(raf);
                        }
                    };
                    requestAnimationFrame(raf);
                }
            }
        });
    };

    window.initScrollProgress = () => {
        if (window._scrollProgressInitialized) {
            if (typeof window.recalculateScrollProgress === 'function') {
                window.recalculateScrollProgress();
            }
            return;
        }
        window._scrollProgressInitialized = true;

        let cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        window.recalculateScrollProgress = () => {
            setTimeout(() => {
                cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const p = cachedScrollHeight > 0 ? (window.scrollY / cachedScrollHeight) * 100 : 0;
                const progEl = document.getElementById('progress');
                if (progEl) progEl.style.setProperty('--p', p + '%');
            }, 100);
        };

        window.addEventListener('resize', () => {
            cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        });
        window.addEventListener('scroll', () => {
            const p = cachedScrollHeight > 0 ? (window.scrollY / cachedScrollHeight) * 100 : 0;
            const progEl = document.getElementById('progress');
            if (progEl) progEl.style.setProperty('--p', p + '%');
        }, { passive: true });

        window.recalculateScrollProgress();
    };

    window.initNavMode = () => {
        if (window.navModeObserver) {
            window.navModeObserver.disconnect();
        }

        try {
            const nav = document.getElementById('topnav');
            if (!nav) return;
            const bands = document.querySelectorAll('[data-mode], .band--paper, .band--dark');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const isPaper = entry.target.classList.contains('band--paper') || entry.target.dataset.mode === 'paper';
                        nav.classList.toggle('is-paper', isPaper);
                    }
                });
            }, { rootMargin: "-15% 0px -84% 0px" });
            
            bands.forEach(b => observer.observe(b));
            window.navModeObserver = observer;
            
            // Initial paint check
            const center = window.innerHeight * 0.15;
            bands.forEach(b => {
                const r = b.getBoundingClientRect();
                if (r.top <= center && r.bottom > center) {
                    const isPaper = b.classList.contains('band--paper') || b.dataset.mode === 'paper';
                    nav.classList.toggle('is-paper', isPaper);
                }
            });
        } catch(e) {
            console.warn("initNavMode error:", e);
        }
    };

    window.initPageAnimations = () => {
        // Respect the OS-level "reduce motion" setting before doing any animation work.
        // When set, reveal every animated element immediately and skip the cascade
        // (matches the GSAP-missing fallback below, but runs even when GSAP is present).
        const prefersReducedMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            const pre = document.getElementById('preloader');
            if (pre) pre.style.display = 'none';
            document.querySelectorAll(
                '.meta-row span, h1, .hero-rule, .abstract, #glCanvas, ' +
                '.scroll-cue, .band .section-eyebrow, .band .section-heading, .type-block, ' +
                '.swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .dashboard-layout, .reveal, .ds-prose'
            ).forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
            return;
        }
        window.ensureDependenciesLoaded(() => {
            if (typeof gsap === 'undefined') {
                const pre = document.getElementById('preloader');
                if (pre) pre.style.display = 'none';
                document.querySelectorAll(
                    '.meta-row span, h1, .hero-rule, .abstract, #glCanvas, ' +
                    '.scroll-cue, .band .section-eyebrow, .band .section-heading, .type-block, ' +
                    '.swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .dashboard-layout, .reveal, .ds-prose'
                ).forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
                return;
            }

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                // No eager ScrollTrigger.refresh() here: triggers haven't been created
                // yet at this point. The single refresh + initScrollTriggers() runs
                // inside the timeline's onComplete, which is the correct ordering
                // per STYLE.md §5.3 ("ScrollTrigger Refresh Caution").
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                        initScrollTriggers();
                    }
                }
            });

            const preloader = document.getElementById('preloader');
            const preLeft   = document.getElementById('preloader-left');
            const preRight  = document.getElementById('preloader-right');
            const preLine   = document.getElementById('preloader-line');
            if (preloader && preloader.style.display !== 'none') {
                tl.to(preLine,  { height: '28vh', duration: 0.55, ease: 'power2.inOut' })
                  .to(preLine,  { opacity: 0, height: '50vh', duration: 0.3, ease: 'power2.in' }, '+=0.075')
                  .to(preLeft,  { xPercent: -100, duration: 0.55, ease: 'power3.inOut' }, '-=0.125')
                  .to(preRight, { xPercent:  100, duration: 0.55, ease: 'power3.inOut' }, '<')
                  .set(preloader, { display: 'none' });
            }

            // ----------------------------------------------------------------
            // Hero reveal cascade.
            //
            // The previous implementation positioned every reveal with relative
            // negative offsets (-=2.8, -=2.2, -=1.6, -=2.0, -=0.5, -=0.9, -=0.3)
            // measured from the end of the preloader chain. The preloader chain
            // total runs ~1.95s, so every position with magnitude >1.95 clamped
            // to t=0 inside GSAP, collapsing the cascade into a single
            // simultaneous reveal. Position labels keep the ordering
            // deterministic regardless of the preloader's presence or length.
            //
            // Hero title note: the .hero h1 is pre-hidden via global.css line
            // 1820 (.hero .meta-row span, .hero h1, .hero .hero-rule, .hero
            // .abstract { opacity: 0 }). The previous code set
            // heroTitle.style.opacity = 1 inline BEFORE SplitType, briefly
            // exposing the full title; gsap.from(split.chars, { opacity: 0 })
            // then snapped the chars invisible and animated them back, which
            // read as a "restart". We let CSS hold the parent at opacity:0
            // until the chars animation begins; a tl.set at the chars label
            // raises parent opacity:1 at the same beat so children become
            // visible only as their stagger plays.
            // ----------------------------------------------------------------
            tl.addLabel('heroIn');

            tl.to('#glCanvas', { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 'heroIn');
            tl.to('#topnav',   { y: 0,       duration: 1.4, ease: 'power3.out'   }, 'heroIn');

            let split;
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle && typeof SplitType !== 'undefined') {
                split = new SplitType(heroTitle, { types: 'words, chars' });
            }

            const metaSpans = gsap.utils.toArray('.meta-row span');
            if (metaSpans.length) tl.to(metaSpans, { opacity: 1, x: 0, duration: 1.0, stagger: 0.2, ease: 'power2.out' }, 'heroIn+=0.30');

            if (split) {
                tl.set(heroTitle, { opacity: 1 }, 'heroIn+=0.50');
                tl.from(split.chars, { opacity: 0, y: 20, rotateX: -90, stagger: 0.04, duration: 1.5, ease: 'back.out(1.5)' }, 'heroIn+=0.50');
            }

            const heroRule = document.querySelector('.hero-rule');
            if (heroRule) tl.to(heroRule, { width: 64, opacity: 1, duration: 1.3, ease: 'power3.inOut' }, 'heroIn+=1.10');

            const frontTitle = document.querySelector('.front h1');
            if (frontTitle && !heroTitle) {
                tl.fromTo(frontTitle,
                    { opacity: 0, y: 28 },
                    { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' },
                    'heroIn+=0.20'
                );
            } else if (frontTitle && heroTitle) {
                tl.to(frontTitle, { opacity: 1, duration: 1.0, ease: 'power2.out' }, 'heroIn+=0.40');
            }

            const abstractEl = document.querySelector('.abstract');
            if (abstractEl) tl.to(abstractEl, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, 'heroIn+=0.70');
            const scrollCue = document.querySelector('.scroll-cue');
            if (scrollCue) tl.to(scrollCue,   { opacity: 1, duration: 1.2, ease: 'power2.out' }, 'heroIn+=1.40');


            function initScrollTriggers() {
                // Guard: .scroll-cue only exists on the homepage hero. Case-study
                // and library pages have no .scroll-cue, so calling gsap.to on it
                // unconditionally logged "GSAP target .scroll-cue not found" and
                // created a pointless ScrollTrigger on every such page.
                if (document.querySelector('.scroll-cue')) {
                    gsap.to('.scroll-cue', {
                        opacity: 0, y: -10, duration: 0.6, ease: 'power2.in',
                        scrollTrigger: { trigger: '.hero, .front', start: 'top top', end: '+=120', scrub: true }
                    });
                }
                gsap.utils.toArray('.band').forEach(band => {
                    // Skip bands owned by other animation controllers
                    if (band.classList.contains('library-band') || band.classList.contains('front') || band.classList.contains('back-matter')) return;
                    // Skip article content bands (markdown-body sections have no reveal targets)
                    if (band.querySelector('.markdown-body')) return;

                    const tlBand = gsap.timeline({
                        scrollTrigger: { trigger: band, start: 'top 75%', toggleActions: 'play none none none' }
                    });
                    const eyebrow = band.querySelector('.section-eyebrow');
                    const heading = band.querySelector('.section-heading');
                    if (eyebrow) tlBand.fromTo(eyebrow, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' });
                    if (heading) tlBand.fromTo(heading, { opacity: 0, y: 25  }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=0.6');
                    const reveals = band.querySelectorAll('.type-block, .swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .reveal, .ds-prose, .bio-card, .project-carousel, .view-all-link, .edu-card, .headshot-frame');
                    if (reveals.length) {
                        tlBand.fromTo(reveals, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.5, stagger: 0.15, ease: 'expo.out' }, '-=0.8');
                    }
                });
                gsap.utils.toArray('.reveal, .ds-prose').forEach(el => {
                    if (el.closest('.band')) return;

                    gsap.fromTo(el, { opacity: 0, y: 40 }, {
                        opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
                    });
                });

                // Parallax scroll: only on homepage structural bands
                gsap.utils.toArray('.band').forEach(band => {
                  if (band.classList.contains('library-band') || band.classList.contains('front') || band.classList.contains('back-matter')) return;
                  if (band.querySelector('.markdown-body')) return;
                  const inner = band.querySelector('.col-wide') || band.querySelector('.bio-wrap');
                  if (inner) {
                    gsap.fromTo(inner, { yPercent: 2 }, {
                      yPercent: -2, ease: 'none',
                      scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true }
                    });
                  }
                });
            }
        });
    };

    // Self-bootstrapping call for normal pages.
    // Uses the scoped window.onReady / window.onLoad helpers defined above; they
    // collapse the "register or run-now" check into a single call, and avoid the
    // earlier bug where DOMContentLoaded was incorrectly registered on `window`
    // (DOMContentLoaded only fires on `document`) and thus never fired without
    // the prototype override compensating.
    if (!window.disableGlobalOrchestration) {
        window.onReady(() => {
            if (typeof window.resetScrollToTop === 'function') window.resetScrollToTop();
        });
        window.onLoad(() => {
            window.initGlobalLenis();
            window.initScrollProgress();
            window.initNavMode();
            window.initPageAnimations();
            if (typeof window.resetScrollToTop === 'function') window.resetScrollToTop();
        });
    }
})();


/* ============================================================
   Spine + Sidenotes Reading Engine
   ============================================================ */
(function spineAndSidenotes() {
    var run = function () {
        var spine = document.getElementById('spine');
        var sections = Array.prototype.slice.call(document.querySelectorAll('[data-spine]'));
        if (spine && sections.length > 0 && !spine.dataset.bound) {
            spine.dataset.bound = '1';
            sections.forEach(function (s, i) {
                var r = document.createElement('div');
                r.className = 'row';
                r.dataset.idx = String(i);
                r.innerHTML = '<span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
                              '<span class="tick"></span>' +
                              '<span class="label">' + (s.dataset.spine || '') + '</span>';
                r.addEventListener('click', function () {
                    s.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                spine.appendChild(r);
            });
        }
        var layoutSidenotes = function () {
            if (window.innerWidth < 1240) {
                document.querySelectorAll('p.col-with-sidenotes').forEach(function (p) {
                    p.style.minHeight = 'auto';
                });
                return;
            }
            document.querySelectorAll('p.col-with-sidenotes').forEach(function (p) {
                var pRect = p.getBoundingClientRect();
                var lastBottom = 0;
                p.querySelectorAll('.sn').forEach(function (sn) {
                    var num = sn.querySelector('.sn-num');
                    var body = sn.querySelector('.sn-body');
                    if (!num || !body) return;
                    var numRect = num.getBoundingClientRect();
                    var top = numRect.top - pRect.top - 2;
                    if (top < lastBottom + 12) top = lastBottom + 12;
                    body.style.top = top + 'px';
                    var bodyH = body.offsetHeight || 80;
                    lastBottom = top + bodyH;
                });
                p.style.minHeight = 'auto';
            });
        };
        window.addEventListener('resize', layoutSidenotes);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(layoutSidenotes);
        }
        layoutSidenotes();
        document.querySelectorAll('.sn-num').forEach(function (n) {
            if (n.dataset.bound) return;
            n.dataset.bound = '1';
            n.addEventListener('click', function () {
                if (window.innerWidth >= 1080) return;
                var body = n.parentElement && n.parentElement.querySelector('.sn-body');
                if (body) body.classList.toggle('is-open');
            });
        });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();