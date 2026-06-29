/* ==========================================================================
   REDDY SAREES EDITORIAL JS
   App Core Interaction: Drawer toggles, cart state, wishlist, search & quickview
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. Luxury Preloader Animation
    // ----------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const loadPercent = document.getElementById('load-percentage');
    const preloaderLine = document.querySelector('.preloader-line');
    
    document.body.classList.add('loading');
    
    let count = 0;
    const loadInterval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 4; // Randomized increment for premium feel
        if (count >= 100) {
            count = 100;
            clearInterval(loadInterval);
            
            // Finish loading animation
            preloaderLine.style.width = '100%';
            loadPercent.textContent = '100';
            
            setTimeout(() => {
                preloader.classList.add('dismissed');
                document.body.classList.remove('loading');
            }, 500);
        } else {
            preloaderLine.style.width = `${count}%`;
            loadPercent.textContent = count;
        }
    }, 60);

    // ----------------------------------------------------------------------
    // 2. Global State Management (Cart & Wishlist)
    // ----------------------------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('reddy_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('reddy_wishlist')) || [];
    
    // Query DOM Elements
    const cartCountBadge = document.getElementById('cart-count');
    const wishlistCountBadge = document.getElementById('wishlist-count');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const wishlistDrawer = document.getElementById('wishlist-drawer');
    const wishlistOverlay = document.getElementById('wishlist-drawer-overlay');
    const searchOverlay = document.getElementById('search-overlay');
    
    // Updates UI numbers on start
    updateBadges();

    // ----------------------------------------------------------------------
    // 3. Navbar Sticky Effect & Scroll Handling
    // ----------------------------------------------------------------------
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbarWrapper.classList.add('sticky');
        } else {
            navbarWrapper.classList.remove('sticky');
        }
    });

    // ----------------------------------------------------------------------
    // 4. Hamburger Mobile Toggle Menu
    // ----------------------------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 5. Drawer Controls (Open/Close)
    // ----------------------------------------------------------------------
    
    // Cart Drawer Toggle
    document.getElementById('cart-open-btn').addEventListener('click', () => {
        openDrawer(cartDrawer, cartOverlay);
        renderCart();
    });
    document.getElementById('cart-close-btn').addEventListener('click', () => closeDrawer(cartDrawer, cartOverlay));
    cartOverlay.addEventListener('click', () => closeDrawer(cartDrawer, cartOverlay));
    
    // Wishlist Drawer Toggle
    document.getElementById('wishlist-open-btn').addEventListener('click', () => {
        openDrawer(wishlistDrawer, wishlistOverlay);
        renderWishlist();
    });
    document.getElementById('wishlist-close-btn').addEventListener('click', () => closeDrawer(wishlistDrawer, wishlistOverlay));
    wishlistOverlay.addEventListener('click', () => closeDrawer(wishlistDrawer, wishlistOverlay));

    // Search Overlay Toggle
    document.getElementById('search-open-btn').addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.getElementById('search-input').focus();
    });
    document.getElementById('search-close-btn').addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Handle suggested search clicks
    document.querySelectorAll('.suggested-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('search-input').value = e.target.textContent;
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDrawer(cartDrawer, cartOverlay);
            closeDrawer(wishlistDrawer, wishlistOverlay);
            searchOverlay.classList.remove('active');
            closeQuickView();
            closeCheckout();
        }
    });

    function openDrawer(drawer, overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer(drawer, overlay) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        if (!document.getElementById('quickview-overlay').classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    // ----------------------------------------------------------------------
    // 6. Wishlist Interaction Logic
    // ----------------------------------------------------------------------
    document.body.addEventListener('click', (e) => {
        const wishlistBtn = e.target.closest('.wishlist-btn');
        if (!wishlistBtn) return;
        e.preventDefault();
        
        const card = wishlistBtn.closest('.product-card');
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = card.getAttribute('data-price');
        const img = card.getAttribute('data-img-primary');
        
        toggleWishlist({ id, name, price, img }, wishlistBtn);
    });

    function toggleWishlist(product, element = null) {
        const index = wishlist.findIndex(item => item.id === product.id);
        
        if (index > -1) {
            wishlist.splice(index, 1);
            if (element) element.classList.remove('active');
            showToast(`${product.name} removed from wishlist.`);
        } else {
            wishlist.push(product);
            if (element) element.classList.add('active');
            showToast(`${product.name} added to wishlist.`);
        }
        
        localStorage.setItem('reddy_wishlist', JSON.stringify(wishlist));
        updateBadges();
        updateProductCardStates();
    }

    function renderWishlist() {
        const body = document.getElementById('wishlist-drawer-body');
        if (wishlist.length === 0) {
            body.innerHTML = `
                <div class="drawer-empty-msg">
                    <i class="fa-regular fa-heart"></i>
                    <p>Your wishlist is currently empty.</p>
                    <button class="btn btn-primary shop-now-btn" onclick="document.getElementById('wishlist-close-btn').click();">Explore Collections</button>
                </div>
            `;
            return;
        }

        let html = '<div class="drawer-items-list">';
        wishlist.forEach(item => {
            html += `
                <div class="drawer-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.name}" class="drawer-item-img">
                    <div class="drawer-item-info">
                        <div>
                            <h4 class="drawer-item-title">${item.name}</h4>
                            <p class="drawer-item-price">₹${parseFloat(item.price).toLocaleString('en-IN')}</p>
                        </div>
                        <button class="btn btn-primary add-from-wishlist-btn" style="padding: 0.5rem 1rem; font-size: 0.6rem; margin-top: 0.5rem;">ADD TO BAG</button>
                    </div>
                    <button class="drawer-item-remove remove-wishlist-item" aria-label="Remove item"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
        });
        html += '</div>';
        body.innerHTML = html;

        // Add from wishlist action
        body.querySelectorAll('.add-from-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemEl = e.target.closest('.drawer-item');
                const id = itemEl.getAttribute('data-id');
                const item = wishlist.find(w => w.id === id);
                if (item) {
                    addToCart({ ...item, size: 'M' });
                    // Remove from wishlist
                    toggleWishlist(item);
                    renderWishlist();
                }
            });
        });

        // Remove item action
        body.querySelectorAll('.remove-wishlist-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemEl = e.target.closest('.drawer-item');
                const id = itemEl.getAttribute('data-id');
                const item = wishlist.find(w => w.id === id);
                if (item) {
                    toggleWishlist(item);
                    renderWishlist();
                }
            });
        });
    }

    // ----------------------------------------------------------------------
    // 7. Cart Interaction Logic
    // ----------------------------------------------------------------------
    document.body.addEventListener('click', (e) => {
        const cartBtn = e.target.closest('.btn-add-to-bag');
        if (!cartBtn) return;
        e.preventDefault();
        
        const card = cartBtn.closest('.product-card');
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = card.getAttribute('data-price');
        const img = card.getAttribute('data-img-primary');
        
        addToCart({ id, name, price, img, size: 'M', qty: 1 });
        openDrawer(cartDrawer, cartOverlay);
        renderCart();
    });

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id && item.size === product.size);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        localStorage.setItem('reddy_cart', JSON.stringify(cart));
        updateBadges();
        showToast(`${product.name} (Size: ${product.size}) added to your bag.`);
    }

    function renderCart() {
        const body = document.getElementById('cart-drawer-body');
        const footer = document.getElementById('cart-drawer-footer');
        
        if (cart.length === 0) {
            body.innerHTML = `
                <div class="drawer-empty-msg">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <p>Your shopping bag is empty.</p>
                    <button class="btn btn-primary shop-now-btn" onclick="document.getElementById('cart-close-btn').click();">Explore Collections</button>
                </div>
            `;
            footer.style.display = 'none';
            return;
        }

        footer.style.display = 'block';
        let html = '<div class="drawer-items-list">';
        let total = 0;
        
        cart.forEach(item => {
            const price = parseFloat(item.price);
            total += price * item.qty;
            html += `
                <div class="drawer-item" data-id="${item.id}" data-size="${item.size}">
                    <img src="${item.img}" alt="${item.name}" class="drawer-item-img">
                    <div class="drawer-item-info">
                        <div>
                            <h4 class="drawer-item-title">${item.name}</h4>
                            <span style="font-size:0.75rem; color:var(--color-text-muted);">Size: ${item.size}</span>
                            <p class="drawer-item-price">₹${price.toLocaleString('en-IN')}</p>
                        </div>
                        <div class="drawer-item-qty">
                            <button class="qty-btn qty-minus">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn qty-plus">+</button>
                        </div>
                    </div>
                    <button class="drawer-item-remove remove-cart-item" aria-label="Remove item"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
        });
        
        html += '</div>';
        body.innerHTML = html;
        document.getElementById('cart-total-price').textContent = `₹${total.toLocaleString('en-IN')}`;

        // Quantity Plus / Minus Handlers
        body.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemEl = e.target.closest('.drawer-item');
                const id = itemEl.getAttribute('data-id');
                const size = itemEl.getAttribute('data-size');
                updateCartQty(id, size, -1);
            });
        });

        body.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemEl = e.target.closest('.drawer-item');
                const id = itemEl.getAttribute('data-id');
                const size = itemEl.getAttribute('data-size');
                updateCartQty(id, size, 1);
            });
        });

        // Remove item handler
        body.querySelectorAll('.remove-cart-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemEl = e.target.closest('.drawer-item');
                const id = itemEl.getAttribute('data-id');
                const size = itemEl.getAttribute('data-size');
                removeCartItem(id, size);
            });
        });
    }

    function updateCartQty(id, size, change) {
        const item = cart.find(item => item.id === id && item.size === size);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                removeCartItem(id, size);
                return;
            }
            localStorage.setItem('reddy_cart', JSON.stringify(cart));
            updateBadges();
            renderCart();
        }
    }

    function removeCartItem(id, size) {
        const index = cart.findIndex(item => item.id === id && item.size === size);
        if (index > -1) {
            const name = cart[index].name;
            cart.splice(index, 1);
            localStorage.setItem('reddy_cart', JSON.stringify(cart));
            updateBadges();
            renderCart();
            showToast(`${name} removed from shopping bag.`);
        }
    }

    // Checkout Modal Operations
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const checkoutCloseBtn = document.getElementById('checkout-close-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutContinueBtn = document.getElementById('checkout-continue-btn');

    function openCheckout() {
        if (cart.length === 0) return;
        
        // Calculate subtotal and total quantity
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        let totalAmount = 0;
        cart.forEach(item => {
            totalAmount += parseFloat(item.price) * item.qty;
        });

        // Set summary text
        document.getElementById('checkout-items-qty').textContent = totalQty;
        document.getElementById('checkout-total-price').textContent = `₹${totalAmount.toLocaleString('en-IN')}`;

        // Reset containers
        document.getElementById('checkout-form-container').style.display = 'block';
        document.getElementById('checkout-success-container').style.display = 'none';
        checkoutForm.reset();

        // Close cart drawer first
        closeDrawer(cartDrawer, cartOverlay);

        // Open checkout modal
        checkoutOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
        checkoutOverlay.classList.remove('active');
        if (!cartDrawer.classList.contains('active') && !wishlistDrawer.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    if (checkoutCloseBtn) {
        checkoutCloseBtn.addEventListener('click', closeCheckout);
    }
    if (checkoutContinueBtn) {
        checkoutContinueBtn.addEventListener('click', closeCheckout);
    }
    if (checkoutOverlay) {
        checkoutOverlay.addEventListener('click', (e) => {
            if (e.target === checkoutOverlay) closeCheckout();
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Generate order reference
            const ref = `RDS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
            document.getElementById('checkout-order-ref').textContent = ref;

            // Show success, hide form
            document.getElementById('checkout-form-container').style.display = 'none';
            document.getElementById('checkout-success-container').style.display = 'block';

            // Clear cart
            cart = [];
            localStorage.removeItem('reddy_cart');
            updateBadges();
            renderCart();
        });
    }

    // Checkout handler
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }

    // ----------------------------------------------------------------------
    // 8. Shared Helpers & Utility Functions
    // ----------------------------------------------------------------------
    function updateBadges() {
        // Update Cart count total items qty
        const cartTotalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountBadge.textContent = cartTotalQty;
        cartCountBadge.style.display = cartTotalQty > 0 ? 'flex' : 'none';
        
        // Wishlist items count
        wishlistCountBadge.textContent = wishlist.length;
        wishlistCountBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }

    function updateProductCardStates() {
        document.querySelectorAll('.product-card').forEach(card => {
            const id = card.getAttribute('data-id');
            const wishlistBtn = card.querySelector('.wishlist-btn');
            if (wishlistBtn) {
                const inWishlist = wishlist.some(item => item.id === id);
                if (inWishlist) {
                    wishlistBtn.classList.add('active');
                } else {
                    wishlistBtn.classList.remove('active');
                }
            }
        });
    }

    // Run card update states on startup
    updateProductCardStates();

    // ----------------------------------------------------------------------
    // 9. Quick View Modal Operations
    // ----------------------------------------------------------------------
    const quickviewOverlay = document.getElementById('quickview-overlay');
    const quickviewClose = document.getElementById('quickview-close-btn');
    let currentQuickViewProduct = null;
    let selectedSize = 'M';

    // Click handler for Quick View badges
    document.body.addEventListener('click', (e) => {
        const qvBadge = e.target.closest('.quick-view-badge');
        if (!qvBadge) return;
        e.preventDefault();

        const card = qvBadge.closest('.product-card');
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = card.getAttribute('data-price');
        const img = card.getAttribute('data-img-primary');
        
        currentQuickViewProduct = { id, name, price, img };
        
        // Set modal data
        document.getElementById('quickview-image').src = img;
        document.getElementById('quickview-name').textContent = name;
        document.getElementById('quickview-price').textContent = `₹${parseFloat(price).toLocaleString('en-IN')}`;
        
        // Reset sizes selection state
        selectedSize = 'M';
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === 'M') btn.classList.add('active');
        });

        // Open modal
        quickviewOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    if (quickviewClose) {
        quickviewClose.addEventListener('click', closeQuickView);
    }
    
    quickviewOverlay.addEventListener('click', (e) => {
        if (e.target === quickviewOverlay) closeQuickView();
    });

    function closeQuickView() {
        quickviewOverlay.classList.remove('active');
        if (!cartDrawer.classList.contains('active') && !wishlistDrawer.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    // Size button clicks
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedSize = e.target.textContent;
        });
    });

    // Add to cart from Quick View
    document.getElementById('modal-add-to-cart').addEventListener('click', () => {
        if (currentQuickViewProduct) {
            addToCart({ ...currentQuickViewProduct, size: selectedSize });
            closeQuickView();
            openDrawer(cartDrawer, cartOverlay);
            renderCart();
        }
    });

    // Add to wishlist from Quick View
    document.getElementById('modal-add-to-wishlist').addEventListener('click', () => {
        if (currentQuickViewProduct) {
            const btn = document.querySelector(`.product-card[data-id="${currentQuickViewProduct.id}"] .wishlist-btn`);
            toggleWishlist(currentQuickViewProduct, btn);
            closeQuickView();
        }
    });

    // ----------------------------------------------------------------------
    // 10. Forms Actions (Search & Newsletter Chronicles)
    // ----------------------------------------------------------------------
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = document.getElementById('search-input').value.trim();
            if (val) {
                showToast(`Search result simulation for: "${val}"`);
                searchOverlay.classList.remove('active');
                document.getElementById('search-input').value = '';
            }
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const email = input.value.trim();
            if (email) {
                showToast(`Chronicles subscription successful for ${email}. Thank you.`);
                input.value = '';
            }
        });
    }

    // ----------------------------------------------------------------------
    // 11. Toast Notifications Utility
    // ----------------------------------------------------------------------
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-body">
                <i class="fa-solid fa-circle-check"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Style toast inline to avoid bloating stylesheet
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%) translateY(100px)',
            backgroundColor: '#3D2B24',
            color: '#F7F3EE',
            padding: '1rem 2rem',
            fontSize: '0.8rem',
            fontWeight: '500',
            letterSpacing: '0.05em',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            zIndex: '9999',
            opacity: '0',
            transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
        });

        document.body.appendChild(toast);
        
        // Trigger entrance
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        }, 50);

        // Terminate toast
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    }
});
