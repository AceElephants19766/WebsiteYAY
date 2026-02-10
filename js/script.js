// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-scroll]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Canvas Background Animation
const canvas = document.getElementById('bg-canvas');

if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(${Math.random() > 0.5 ? '157, 0, 255' : '189, 0, 255'}, ${Math.random() * 0.5})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(157, 0, 255, ${1 - distance / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

// --- Theme Switcher Logic ---
// --- Theme Switcher Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themes = [null, 'light', 'black']; // null is default (dark)
let currentThemeIndex = 0;

const getAssetsPath = () => {
    // Check if running from a sub-page
    const isSubPage = window.location.pathname.includes('/pages/') || window.location.pathname.includes('\\pages\\');
    return isSubPage ? '../assets/icons' : 'assets/icons';
};

const updateThemeIcon = (index) => {
    if (!themeToggleBtn) {
        // Try to fetch it again if it wasn't there initially (rare case)
        return;
    }
    const path = getAssetsPath();
    let iconSrc = `${path}/moon.png`; // Default (Dark)
    let altText = "Dark Mode";

    if (index === 1) {
        iconSrc = `${path}/sun.png`; // Light
        altText = "Light Mode";
    }
    if (index === 2) {
        iconSrc = `${path}/cloud.png`; // Black
        altText = "Black Mode";
    }

    // Using innerHTML to replace the icon
    themeToggleBtn.innerHTML = `<img src="${iconSrc}" alt="${altText}" class="theme-icon-img">`;
};

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    if (savedTheme === 'light') currentThemeIndex = 1;
    if (savedTheme === 'black') currentThemeIndex = 2;
    document.documentElement.setAttribute('data-theme', savedTheme);
}
updateThemeIcon(currentThemeIndex);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const theme = themes[currentThemeIndex];

        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('theme');
        }
        updateThemeIcon(currentThemeIndex);
    });
}



// --- Dynamic Floating Gallery ---
function initFloatingGallery() {
    const container = document.getElementById('floating-gallery');
    if (!container) return; // Guard clause

    // List of available images
    const images = [
        'assets/background-pics/DSC_3901.JPG',
        'assets/background-pics/DSC_4150.JPG',
        'assets/background-pics/DSC_4151.JPG',
        'assets/background-pics/DSC_4628.JPG',
        'assets/background-pics/DSC_4639.JPG'
    ];

    // Calibrate density: 1 image per roughly 1.5 screen heights
    const totalItems = 12;
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );

    // Explicitly set container height
    container.style.height = `${documentHeight}px`;

    // Divide page into LARGE sections to prevent clustering
    const sectionHeight = documentHeight / totalItems;

    for (let i = 0; i < totalItems; i++) {
        const item = document.createElement('div');
        item.classList.add('float-item');

        const img = document.createElement('img');
        img.src = images[i % images.length];
        item.appendChild(img);

        // Random Size
        const width = Math.floor(Math.random() * 200) + 150;
        const height = width * 0.66;

        item.style.width = `${width}px`;
        // Top: Each item gets its own "slot"
        const slotTop = i * sectionHeight;
        // Keep within the slot but centered
        const randomOffset = Math.random() * (sectionHeight * 0.5);
        let topPos = slotTop + randomOffset;

        // Ensure first item doesn't cover the main logo/title too much
        if (i === 0) topPos += 100;

        // Left: 5% to 80%
        const leftPos = Math.random() * 75 + 5;

        item.style.top = `${topPos}px`;
        item.style.left = `${leftPos}%`;

        // Random Z-Depth
        const zDepth = Math.floor(Math.random() * 400) - 200;

        // Animation
        const duration = Math.random() * 10 + 15; // Slower drift (15-25s)
        const delay = Math.random() * -20;

        item.style.transform = `translateZ(${zDepth}px)`;
        item.style.animation = `drift ${duration}s ease-in-out ${delay}s infinite alternate`;

        // Append
        container.appendChild(item);
    }
}

// Run after DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Recalculate height on load to ensure we cover full page
    setTimeout(initFloatingGallery, 100);
});

// --- Lightbox Modal Logic ---
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        lightboxImg.src = imgElement.src;
        lightbox.style.display = 'flex';
        // Small delay to trigger animation
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300); // Wait for transition
    }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// --- Auto-attach Lightbox to Gallery Images ---
document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
        img.style.cursor = 'pointer'; // Visual cue
    });
});

// --- Collapsible Code Toggle ---
function toggleCode() {
    const codeBlock = document.getElementById('codeBlock');
    if (codeBlock) {
        codeBlock.classList.toggle('collapsed');
    }
}

// --- Lenis Momentum Scrolling ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// --- Mobile Navigation Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');

            // Change icon based on state
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
});


// --- Smooth Scrolling for Navigation (using Lenis) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            lenis.scrollTo(targetElement);
        }
    });
});

