// === Navigation & Toast Logic ===
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Details Toggle (if used in future)
  const detailItems = document.querySelectorAll('details');
  detailItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        detailItems.forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  // Global Button Shine Effect (Mouse Movement)
  const buttons = document.querySelectorAll('.btn, .btn-duck, .btn-download');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--x', `${x}px`);
      btn.style.setProperty('--y', `${y}px`);
    });
  });
});

// Ambient Light Animation
const canvas = document.createElement('canvas');
canvas.id = 'ambient-lights';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let width, height;
const lights = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Light {
  constructor() {
    this.init();
  }

  init() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 300 + 200;
    this.color = Math.random() > 0.5 ? 'rgba(100, 100, 255, 0.15)' : 'rgba(255, 255, 100, 0.1)';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;
  }

  draw() {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 6; i++) {
  lights.push(new Light());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  lights.forEach(light => {
    light.update();
    light.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// Duck Interaction (Patting)
function patDuck() {
  const duck = document.querySelector('.duck');
  if (!duck) return;

  // Add class for CSS animation
  duck.classList.add('patted');

  // Play quack sound
  const quack = new Audio('assets/quack.mp3');
  quack.volume = 0.4;
  quack.play().catch(() => { }); // Ignore auto-play errors

  // Remove class after animation
  setTimeout(() => {
    duck.classList.remove('patted');
  }, 600);
}

// === Modal Logic ===
function openModal(src) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  modal.style.display = "flex";
  modalImg.src = src;
}

function closeModal() {
  document.getElementById('imageModal').style.display = "none";
}

// Close modal on Esc key
document.addEventListener('keydown', function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// === Toast Notification System ===
function showToast(message, icon = 'check') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';

  // Icon content
  let iconSvg = '';
  if (icon === 'check') {
    iconSvg = `<svg viewBox="0 0 24 24" fill="none" class="toast-icon" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (icon === 'info') {
    iconSvg = `<svg viewBox="0 0 24 24" fill="none" class="toast-icon" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  // Toast HTML Structure
  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;

  // Append to body
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400); // Wait for fade-out
  }, 4000);
}

// Integrate checks for plugin downloads
document.addEventListener('DOMContentLoaded', () => {
  const downloadBtns = document.querySelectorAll('.btn-download');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Allow default download behavior but show toast
      // e.preventDefault(); // Uncomment if you want to block default and handle manually
      showToast("Download started! Check your downloads.");
    });
  });

  // === Discord ID Copy Logic ===
  const discordIdCard = document.getElementById('discord-id-card');
  if (discordIdCard) {
    discordIdCard.addEventListener('click', () => {
      const idElement = discordIdCard.querySelector('.value');
      const idText = idElement ? idElement.innerText : '1095204076280631396';

      navigator.clipboard.writeText(idText).then(() => {
        showToast('Copied Discord ID!', 'check');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy ID', 'info');
      });
    });
  }

  // === Scroll Fade-In Animation ===
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Elements to animate
  const animatedElements = document.querySelectorAll('section, article, .card, .project-hero, .project-text, .gallery, .plugin-details');

  animatedElements.forEach(el => {
    el.classList.add('fade-on-scroll');
    observer.observe(el);
  });
});

function copyCode(btn) {
  const wrapper = btn.closest('.code-wrapper');
  const code = wrapper.querySelector('code').innerText;

  navigator.clipboard.writeText(code).then(() => {
    const originalContent = btn.innerHTML;

    // Show Checkmark + "Copied!"
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span style="color: #4ade80;">Copied!</span>
    `;

    setTimeout(() => {
      btn.innerHTML = originalContent;
    }, 2000);
  });
}

// === Page Load Animation ===
window.addEventListener('load', () => {
  // Small delay to ensure styles are ready
  requestAnimationFrame(() => {
    document.documentElement.classList.add('page-enter-active');

    // Optional: Clean up classes after animation
    setTimeout(() => {
      document.documentElement.classList.remove('page-enter', 'page-enter-active');
    }, 600);
  });
});
