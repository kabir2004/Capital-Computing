// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initScrollAnimations();
    initMagneticButtons();
    initMenu();
    initStripeReactivity();
    initClientSlider();
    initRowScramble();
    initMagnetLines();
    initTestimonialSlider();
    initPageTransitions();
    initExpertiseScramble();
    initAdvisoryCardScramble();
});

function initPageTransitions() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        gsap.to(loader, {
            height: 0,
            duration: 1.2,
            ease: "power4.inOut"
        });
    }

    // Handle internal links for smooth transition
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('http') && !href.startsWith('mailto')) {
                e.preventDefault();
                const tl = gsap.timeline();

                // Add overlay if it doesn't exist
                let overlay = document.querySelector('.transition-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'transition-overlay';
                    document.body.appendChild(overlay);
                }

                tl.to(overlay, {
                    height: '100%',
                    duration: 0.8,
                    ease: "power4.inOut",
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            }
        });
    });
}

function textScramble(el, text, speed = 2) {
    if (el._scrambling) return;
    el._scrambling = true;

    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let frame = 0;

    function update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = text.length; i < n; i++) {
            // speed determines how many frames per character resolution
            if (frame >= i * speed + 20) {
                output += text[i];
                complete++;
            } else if (frame >= i * speed) {
                output += chars[Math.floor(Math.random() * chars.length)];
            } else {
                output += (text[i] === ' ') ? ' ' : chars[Math.floor(Math.random() * chars.length)];
            }
        }

        el.innerText = output;

        if (complete < text.length) {
            frame++;
            requestAnimationFrame(update);
        } else {
            el._scrambling = false;
        }
    }

    update();
}

function initRowScramble() {
    const rows = document.querySelectorAll('.panel-row');
    rows.forEach(row => {
        const num = row.querySelector('.row-num');

        if (num) {
            num.dataset.value = num.innerText;
            row.addEventListener('mouseenter', () => {
                textScramble(num, num.dataset.value, 1.5); // Fast speed for 'quick and smooth' glitch
            });
        }
    });
}

function switchTab(index) {
    const panels = document.querySelectorAll('.tab-panel');
    const triggers = document.querySelectorAll('.tab-trigger');

    panels.forEach(p => p.classList.remove('active'));
    triggers.forEach(t => t.classList.remove('active'));

    panels[index].classList.add('active');
    triggers[index].classList.add('active');

    // Scramble effect for the title - SLOWER
    const title = panels[index].querySelector('.panel-title');
    textScramble(title, title.innerText, 5); // Speed multiplier increased to 5 for titles

    // Scramble effect for numbers in the panel (Sequential Reveal)
    const rows = panels[index].querySelectorAll('.panel-row');
    rows.forEach((row, i) => {
        const num = row.querySelector('.row-num');

        if (num) {
            if (!num.dataset.value) num.dataset.value = num.innerText;
            setTimeout(() => {
                textScramble(num, num.dataset.value, 2);
            }, i * 100);
        }
    });

    // Punchy entry for the active panel
    gsap.from(panels[index], {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out"
    });
}

function initExpertiseScramble() {
    const items = document.querySelectorAll('.expertise-item');
    items.forEach(item => {
        const num = item.querySelector('.exp-num');
        if (num) {
            num.dataset.value = num.innerText;
            item.addEventListener('mouseenter', () => {
                textScramble(num, num.dataset.value, 1.5);
            });
        }
    });
}

function initAdvisoryCardScramble() {
    const cards = document.querySelectorAll('.adv-card');
    cards.forEach(card => {
        // Target ONLY metadata elements for the glitch effect
        const metaElements = card.querySelectorAll('.card-code, .card-id');

        metaElements.forEach(el => {
            el.dataset.value = el.innerText;
        });

        card.addEventListener('mouseenter', () => {
            metaElements.forEach(el => {
                textScramble(el, el.dataset.value, 1.2);
            });
        });
    });
}

function initHeroAnimations() {
    // Initial entrance for Hero
    const tl = gsap.timeline();

    tl.from('.hero-title', {
        y: 200,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
    })
        .from('.hero-info-row .info-col, .hero-explore', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.8
        }, "-=1");
}

function initScrollAnimations() {
    // Fade out header info on scroll
    gsap.to('.header-center-info', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=200',
            scrub: true
        },
        opacity: 0,
        pointerEvents: 'none'
    });


    gsap.from('.huge-text', {
        scrollTrigger: {
            trigger: '.who-we-are',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
        },
        opacity: 0,
        y: 60,
        duration: 2,
        ease: "power3.out"
    });

    // Color transition for background - Locked to Black for Dark Mode
    gsap.to('body', {
        scrollTrigger: {
            trigger: '.who-we-are',
            start: 'top 50%',
            toggleActions: 'play none none reverse'
        },
        backgroundColor: '#000000',
        duration: 0.5
    });

    // Service items reveal - Optimized for sticky behavior
    document.querySelectorAll('.service-item').forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 95%',
            },
            opacity: 0,
            y: 30,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Testimonial BG parallax
    gsap.to('.testimonial-bg img', {
        scrollTrigger: {
            trigger: '.testimonial',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        y: -100,
        ease: "none"
    });

    // Testimonial quote fade
    gsap.from('.huge-quote', {
        scrollTrigger: {
            trigger: '.testimonial',
            start: 'top 60%',
        },
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power4.out"
    });

    // Client card reveal
    gsap.from('.client-card', {
        scrollTrigger: {
            trigger: '.client-card',
            start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
    });

    // Client image parallax
    gsap.to('.client-img', {
        scrollTrigger: {
            trigger: '.client-card',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        scale: 1.1,
        ease: "none"
    });

    // Footer CTA reveal
    gsap.from('.footer-cta h2', {
        scrollTrigger: {
            trigger: '.footer-cta',
            start: 'top 80%'
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
    });
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-talk, .btn-contact');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

function initMenu() {
    const burger = document.querySelector('.burger-menu');
    const closeBtn = document.querySelector('.close-menu');
    const overlay = document.querySelector('#menu-overlay');
    const menuContent = document.querySelector('.menu-content');
    const navNums = document.querySelectorAll('.nav-num');

    burger.addEventListener('click', () => {
        overlay.style.display = 'block';
        gsap.to(overlay, { opacity: 1, duration: 0.5 });
        gsap.fromTo(menuContent,
            { x: -450 }, // Fixed to match 450px width
            { x: 0, duration: 0.8, ease: "power4.out" }
        );

        // Scramble animation for numbers (Password Animation)
        navNums.forEach((num, index) => {
            if (!num.dataset.value) num.dataset.value = num.innerText;

            // Initial reveal scramble
            setTimeout(() => {
                textScramble(num, num.dataset.value, 2);
            }, 300 + (index * 100));

            // Hover glitch for main nav items
            const parentItem = num.closest('.nav-item');
            if (parentItem) {
                parentItem.addEventListener('mouseenter', () => {
                    textScramble(num, num.dataset.value, 1.5);
                });
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        gsap.to(menuContent, { x: -450, duration: 0.6, ease: "power4.in" }); // Fixed to match 450px width
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                overlay.style.display = 'none';
            }
        });
    });

    // Dropdown Logic
    const dropdown = document.querySelector('.nav-dropdown');
    const plus = document.querySelector('.nav-plus');
    const dropdownTiles = document.querySelectorAll('.dropdown-tile');
    let isDropdownOpen = false;

    // Ensure initial state
    if (dropdown) gsap.set(dropdown, { height: 0 });

    if (plus && dropdown) {
        // Hover Glitch for sub-items
        dropdownTiles.forEach(tile => {
            const num = tile.querySelector('.sub-num');
            if (num) {
                num.dataset.value = num.innerText;
                tile.addEventListener('mouseenter', () => {
                    textScramble(num, num.dataset.value, 1.5); // Fast speed for 'quick and smooth' glitch
                });
            }
        });

        plus.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (!isDropdownOpen) {
                // Open: Spin 360 (Ends as a +)
                gsap.to(dropdown, { height: 'auto', duration: 0.6, ease: "power2.out" });
                gsap.to(plus, {
                    rotation: 360,
                    duration: 0.6,
                    ease: "power2.out",
                    color: "#e85642"
                });
                gsap.to(dropdownTiles, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.4,
                    ease: "power2.out",
                    onStart: () => {
                        // Trigger initial scramble for sub-numbers on open
                        const subNums = dropdown.querySelectorAll('.sub-num');
                        subNums.forEach((num, i) => {
                            setTimeout(() => {
                                textScramble(num, num.innerText, 2);
                            }, i * 50);
                        });
                    }
                });
                isDropdownOpen = true;
            } else {
                // Close
                gsap.to(dropdown, { height: 0, duration: 0.4, ease: "power2.inOut" });
                gsap.to(plus, {
                    rotation: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                    color: "#000"
                });
                gsap.to(dropdownTiles, {
                    opacity: 0,
                    y: -10,
                    duration: 0.3,
                    stagger: 0.05
                });
                isDropdownOpen = false;
            }
        });
    }
}

function initClientSlider() {
    const wrapper = document.querySelector('.client-slider-wrapper');
    const slider = document.querySelector('.client-slider');
    const dots = document.querySelectorAll('.slider-dots .dot');

    if (!wrapper || !slider) return;

    let isDragging = false;
    let startX;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentIndex = 0;

    // Slider Dragging Logic
    wrapper.addEventListener('mousedown', (e) => {
        dragStart(e);
    });
    wrapper.addEventListener('mouseup', () => {
        dragEnd();
    });
    wrapper.addEventListener('touchend', dragEnd);
    wrapper.addEventListener('mousemove', dragAction);
    wrapper.addEventListener('touchmove', dragAction);
    wrapper.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        animationID = requestAnimationFrame(animation);
    }

    function dragEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && currentIndex < dots.length - 1) currentIndex += 1;
        if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

        setPositionByIndex();
    }

    function dragAction(e) {
        if (isDragging) {
            const currentX = getPositionX(e);
            currentTranslate = prevTranslate + currentX - startX;
        }
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        if (slider) slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        const card = slider.querySelector('.client-card');
        if (!card) return;
        const cardWidth = card.offsetWidth;
        currentTranslate = currentIndex * -cardWidth;

        prevTranslate = currentTranslate;
        setSliderPosition();
        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
}

function initStripeReactivity() {
    const stripes = document.querySelectorAll('.hero-stripes span');

    stripes.forEach((stripe, index) => {
        stripe.addEventListener('mouseenter', () => {
            // Highlighting neighbors for a "liquid" feel
            if (stripes[index - 1]) stripes[index - 1].style.width = '102%';
            if (stripes[index + 1]) stripes[index + 1].style.width = '102%';
        });

        stripe.addEventListener('mouseleave', () => {
            if (stripes[index - 1]) stripes[index - 1].style.width = '';
            if (stripes[index + 1]) stripes[index + 1].style.width = '';
        });
    });
}

// Custom Cursor (Optional but adds to the "Locomotive" feel)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

// Add styles for custom cursor to document
const cursorStyle = document.createElement('style');
cursorStyle.innerHTML = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        background: rgba(0,0,0,0.1);
        border: 1px solid #000;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
        mix-blend-mode: difference;
    }
    body:hover .custom-cursor {
        opacity: 1;
    }
`;
document.head.appendChild(cursorStyle);

window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
});

// Expand cursor on hover
document.querySelectorAll('a, .burger-menu, .tab-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 3, backgroundColor: 'rgba(0,0,0,0.5)' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, backgroundColor: 'rgba(0,0,0,0.1)' });
    });
});

function initMagnetLines() {
    const container = document.getElementById('magnet-lines');
    if (!container) return;

    const rows = 9;
    const columns = 9;
    const total = rows * columns;
    const baseAngle = 0;
    const lineColor = "#e85642"; // Matches our primary red
    const lineWidth = "0.6vmin";
    const lineHeight = "4vmin";

    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // Create lines
    for (let i = 0; i < total; i++) {
        const span = document.createElement('span');
        span.style.setProperty('--rotate', `${baseAngle}deg`);
        span.style.backgroundColor = lineColor;
        span.style.width = lineWidth;
        span.style.height = lineHeight;
        container.appendChild(span);
    }

    const items = container.querySelectorAll('span');

    const onPointerMove = (e) => {
        const x = e.clientX;
        const y = e.clientY;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.x + rect.width / 2;
            const centerY = rect.y + rect.height / 2;

            const b = x - centerX;
            const a = y - centerY;
            const c = Math.sqrt(a * a + b * b) || 1;
            const r = ((Math.acos(b / c) * 180) / Math.PI) * (y > centerY ? 1 : -1);

            item.style.setProperty('--rotate', `${r + 90}deg`); // Added 90 to align lines correctly
        });
    };

    window.addEventListener('pointermove', onPointerMove);

    // Initial orientation
    if (items.length) {
        const middleIndex = Math.floor(items.length / 2);
        const rect = items[middleIndex].getBoundingClientRect();
        onPointerMove({ clientX: rect.x, clientY: rect.y });
    }
}

function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let isAnimating = false;

    function transition(nextIndex, direction) {
        if (isAnimating || nextIndex === currentIndex) return;
        isAnimating = true;

        const currentSlide = slides[currentIndex];
        const nextSlide = slides[nextIndex];

        // Prepare next slide - Surgical entry
        gsap.set(nextSlide, {
            display: 'flex',
            opacity: 0,
            y: 0,
            x: direction === 'next' ? 20 : -20
        });

        const tl = gsap.timeline({
            onComplete: () => {
                currentSlide.classList.remove('active');
                nextSlide.classList.add('active');
                gsap.set(currentSlide, { display: 'none', clearProps: "all" });
                currentIndex = nextIndex;
                isAnimating = false;
            }
        });

        tl.to(currentSlide, {
            opacity: 0,
            x: direction === 'next' ? -20 : 20,
            duration: 0.4,
            ease: "expo.out"
        })
            .to(nextSlide, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: "expo.out"
            }, "-=0.2");
    }

    nextBtn.addEventListener('click', () => {
        const next = (currentIndex + 1) % slides.length;
        transition(next, 'next');
    });

    prevBtn.addEventListener('click', () => {
        const prev = (currentIndex - 1 + slides.length) % slides.length;
        transition(prev, 'prev');
    });
}
