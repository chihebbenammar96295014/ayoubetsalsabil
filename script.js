/* ============================================
   🌹 ROMANTIC MOM GIFT SITE — SCRIPT
   ============================================ */

// ===== REGISTER GSAP PLUGINS =====
gsap.registerPlugin(ScrollTrigger);

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        startHeroAnimation();
    }, 2000);
});

// ===== HERO ENTRANCE ANIMATION =====
function startHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('#hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
    })
        .to('#hero-title', {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
        }, '-=0.5')
        .to('#hero-heart', {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
        }, '-=0.4')
        .to('.hero-sparkle', {
            opacity: 1,
            stagger: 0.2,
            duration: 0.5,
        }, '-=0.3');

    // Continuous heart beat
    gsap.to('#hero-heart', {
        scale: 1.15,
        yoyo: true,
        repeat: -1,
        duration: 0.6,
        ease: 'power1.inOut',
        delay: 3,
    });
}

// ===== FLOATING HEARTS CANVAS =====
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let hearts = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Heart {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 14 + 6;
        this.speedY = Math.random() * 1.2 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.4 + 0.15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        // Soft pinks and reds
        const colors = [
            'rgba(96, 165, 250,',   // blue
            'rgba(244, 114, 182,',  // pink
            'rgba(167, 139, 250,',  // violet
            'rgba(59, 130, 246,',   // deep blue
            'rgba(236, 72, 153,',   // deep pink
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color + this.opacity + ')';

        // Draw heart shape
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
        ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
        ctx.fill();

        ctx.restore();
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.4;
        this.rotation += this.rotationSpeed;

        if (this.y < -50) {
            this.reset();
        }
    }
}

// Create hearts
for (let i = 0; i < 30; i++) {
    const h = new Heart();
    h.y = Math.random() * canvas.height; // Spread initial positions
    hearts.push(h);
}

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    animationId = requestAnimationFrame(animateHearts);
}
animateHearts();

// ===== SCROLL REVEAL =====
function setupScrollReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach((el) => {
        const delay = parseFloat(el.dataset.delay) || 0;
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    delay: delay,
                    ease: 'power3.out',
                });
            }
        });
    });
}
setupScrollReveal();

// ===== PARALLAX EFFECTS =====
gsap.to('.hero-petals', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
    }
});

gsap.to('.hero-content', {
    yPercent: 20,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
    }
});

// ===== TYPEWRITER EFFECT =====
const typewriterMessage = `Salsabil, Ayoub... Avoir un frère et une sœur comme vous est le véritable trésor de cette vie. On a grandi ensemble, partagé nos joies, nos peines et nos secrets. Merci d'être mes alliés, mes confidents et mes meilleurs amis. Peu importe où la vie nous mène, notre lien est éternel. Je vous aime fort ❤️`;

let typewriterStarted = false;

ScrollTrigger.create({
    trigger: '#typewriter-container',
    start: 'top 75%',
    once: true,
    onEnter: () => {
        if (!typewriterStarted) {
            typewriterStarted = true;
            typeWriter(typewriterMessage, 0);
        }
    }
});

function typeWriter(text, index) {
    const el = document.getElementById('typewriter-text');
    if (index < text.length) {
        el.textContent += text.charAt(index);
        const speed = text.charAt(index) === '.' || text.charAt(index) === ',' ? 120 : 35;
        setTimeout(() => typeWriter(text, index + 1), speed);
    } else {
        // Hide cursor after finishing
        setTimeout(() => {
            document.getElementById('typewriter-cursor').style.display = 'none';
        }, 2000);
    }
}

// ===== 3D CARD INTERACTION =====
const card3d = document.getElementById('card3d');
let cardOpened = false;

card3d.addEventListener('click', () => {
    cardOpened = !cardOpened;
    card3d.classList.toggle('opened', cardOpened);
});

// Card tilt on mouse move
const card3dWrapper = document.querySelector('.card3d-wrapper');
card3dWrapper.addEventListener('mousemove', (e) => {
    if (cardOpened) return;
    const rect = card3dWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;

    gsap.to(card3d, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.4,
        ease: 'power2.out',
    });
});

card3dWrapper.addEventListener('mouseleave', () => {
    if (cardOpened) return;
    gsap.to(card3d, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
    });
});

// ===== SURPRISE LETTER =====
const surpriseBtn = document.getElementById('surprise-btn');
const letterModal = document.getElementById('letter-modal');
const letterOverlay = document.getElementById('letter-modal-overlay');

surpriseBtn.addEventListener('click', () => {
    letterModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Burst of hearts on open
    burstHearts();
});

letterOverlay.addEventListener('click', () => {
    letterModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && letterModal.classList.contains('active')) {
        letterModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== HEART BURST EFFECT =====
function burstHearts() {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed; inset: 0; z-index: 9999; pointer-events: none; overflow: hidden;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        const emojis = ['❤️', '💖', '💕', '💗', '💝', '🌸', '✨'];
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            font-size: ${Math.random() * 24 + 16}px;
            pointer-events: none;
        `;
        container.appendChild(heart);

        const angle = (Math.PI * 2 * i) / 20;
        const distance = Math.random() * 250 + 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        gsap.to(heart, {
            x: x,
            y: y,
            opacity: 0,
            scale: Math.random() * 1.5 + 0.5,
            rotation: Math.random() * 360,
            duration: Math.random() * 1.5 + 1,
            ease: 'power2.out',
            onComplete: () => {
                heart.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }
        });
    }
}

// ===== GALLERY CARD PARALLAX TILT =====
document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -6;
        const rotateY = (x - centerX) / centerX * 6;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            transformPerspective: 800,
            ease: 'power2.out',
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out',
        });
    });
});

// ===== SMOOTH SECTION TRANSITIONS =====
document.querySelectorAll('.section').forEach((section, index) => {
    if (index === 0) return; // Skip hero
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1,
        },
        opacity: 0.5,
        y: 60,
    });
});

// ===== PERFORMANCE: Pause hearts when not visible =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animateHearts();
    }
});

console.log('💖 Site chargé avec amour! 💖');
