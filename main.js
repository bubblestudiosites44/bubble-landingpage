const notice = document.querySelector('.notice');
const closeBtn = document.querySelector('.notice__close');
const NOTICE_KEY = 'bubble_notice_dismissed';

if (localStorage.getItem(NOTICE_KEY) === '1') {
  notice.style.display = 'none';
}

closeBtn.addEventListener('click', () => {
  notice.style.display = 'none';
  localStorage.setItem(NOTICE_KEY, '1');
});

// Bubble animation with enhanced glass effect
const canvas = document.querySelector('.hero__canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let bubbles = [];
let running = false;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resize() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createBubbles() {
  const rect = canvas.getBoundingClientRect();
  const count = Math.max(12, Math.floor(rect.width / 80));
  bubbles = new Array(count).fill(0).map(() => ({
    x: Math.random() * rect.width,
    y: rect.height + Math.random() * rect.height * 0.5,
    r: 8 + Math.random() * 20,
    speed: 0.15 + Math.random() * 0.4,
    drift: (Math.random() - 0.5) * 0.2,
    alpha: 0.08 + Math.random() * 0.12,
    shimmer: Math.random()
  }));
}

function draw() {
  if (!running) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  for (const b of bubbles) {
    b.y -= b.speed;
    b.x += b.drift * 0.4;
    b.shimmer = (b.shimmer + 0.02) % (Math.PI * 2);

    if (b.y < -b.r) {
      b.y = height / dpr + b.r;
      b.x = Math.random() * (width / dpr);
    }

    // Bubble outline (glass effect)
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${b.alpha * 0.5 + Math.sin(b.shimmer) * 0.1})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Subtle inner glow
    const gradient = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${b.alpha * 0.6})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
  }

  requestAnimationFrame(draw);
}

function start() {
  resize();
  createBubbles();
  if (!running) {
    running = true;
    requestAnimationFrame(draw);
  }
}

const onResize = () => {
  resize();
  createBubbles();
};

window.addEventListener('resize', onResize, { passive: true });
window.addEventListener('orientationchange', onResize);

start();

// App card navigation
const appCards = document.querySelectorAll('.app-card');
appCards.forEach(card => {
  card.addEventListener('click', () => {
    if (card.getAttribute('data-disabled') !== 'true') {
      const href = card.getAttribute('data-href');
      if (href) window.location.href = href;
    }
  });
});