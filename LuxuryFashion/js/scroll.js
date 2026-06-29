/* ==========================================================================
   REDDY SAREES EDITORIAL JS
   Scroll & Animations: Lenis Smooth Scroll, GSAP, and ScrollTrigger Setup
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ----------------------------------------------------------------------
    // 1. Initialize Lenis Smooth Scrolling
    // ----------------------------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium exponential deceleration
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // RequestAnimationFrame Loop for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // ----------------------------------------------------------------------
    // 2. Parallax Effects (Hero & Banner)
    // ----------------------------------------------------------------------
    
    // Parallax Hero Image
    gsap.to('#hero-bg-img', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Fade and translate hero content out on scroll
    gsap.to('#hero .hero-content', {
        opacity: 0,
        y: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'center center',
            end: 'bottom top',
            scrub: true
        }
    });

    // Parallax Promo Banner
    gsap.to('#banner-bg-img', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
            trigger: '#featured-banner',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // ----------------------------------------------------------------------
    // 3. Staggered Text & Element Fade-ups (Scroll Reveal)
    // ----------------------------------------------------------------------
    
    // Global reveal up selector
    const revealUps = document.querySelectorAll('.reveal-up');
    revealUps.forEach(element => {
        gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%', // Trigger when 85% from top of viewport
                toggleActions: 'play none none none' // Play once and don't reverse
            }
        });
    });

    // Left reveal selector
    const revealLefts = document.querySelectorAll('.reveal-left');
    revealLefts.forEach(element => {
        gsap.to(element, {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Right reveal selector
    const revealRights = document.querySelectorAll('.reveal-right');
    revealRights.forEach(element => {
        gsap.to(element, {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ----------------------------------------------------------------------
    // 4. Hero Stagger Load-in (Triggered after Preloader exits)
    // ----------------------------------------------------------------------
    const startHeroAnimations = () => {
        const tl = gsap.timeline({ delay: 0.8 });
        
        tl.to('.navbar-wrapper', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        tl.from('.hero-subtitle', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');

        tl.from('.hero-title .title-line', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        }, '-=0.6');

        tl.from('.hero-actions', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6');

        tl.from('.hero-scroll-indicator', {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4');
    };

    // Listen for preloader dismiss to trigger hero animations
    const checkPreloader = setInterval(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && preloader.classList.contains('dismissed')) {
            clearInterval(checkPreloader);
            startHeroAnimations();
        }
    }, 100);
});
