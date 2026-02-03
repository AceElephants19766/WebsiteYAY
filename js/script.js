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

// --- Context-Aware Language Switcher ---
const langSwitchLink = document.querySelector('.lang-switch');

if (langSwitchLink) {
    langSwitchLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetUrl = langSwitchLink.getAttribute('href');
        const currentHash = window.location.hash;
        window.location.href = targetUrl + currentHash;
    });
}
