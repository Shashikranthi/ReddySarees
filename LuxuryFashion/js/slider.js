/* ==========================================================================
   AURA LUXURY FASHION EDITORIAL JS
   Sliders Setup: Swiper.js Configurations for Products & Testimonials
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. Trending Collection Carousel (Swiper.js)
    // ----------------------------------------------------------------------
    const trendingSlider = new Swiper('.trending-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 800,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-btn-next',
            prevEl: '.swiper-btn-prev',
        },
        breakpoints: {
            // Small Mobile
            375: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            // Mobile (Landscape) & Small Tablets
            576: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // Tablets
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            // Large Laptops & Desktops
            1200: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        }
    });

    // ----------------------------------------------------------------------
    // 2. Testimonials Slider (Swiper.js)
    // ----------------------------------------------------------------------
    const testimonialsSlider = new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.testimonial-pagination',
            clickable: true,
        },
        grabCursor: true,
    });
});
