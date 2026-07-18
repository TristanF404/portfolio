// =============================================================
// Footer year
// =============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =============================================================
// Mobile nav toggle
// =============================================================
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =============================================================
// Active nav link on scroll
// =============================================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);
sections.forEach((section) => sectionObserver.observe(section));

// =============================================================
// Reveal-on-scroll
// =============================================================
const revealTargets = document.querySelectorAll(
  '.section-inner, .channel, .project-card, .skill-group'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// =============================================================
// Ambient dual-waveform backdrop
// Two overlapping signals (cyan + pink) drifting behind the hero,
// representing the two "channels" of work — in-person and online.
// =============================================================
const canvas = document.getElementById('signal-canvas');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let width, height, dpr;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

function drawWave(t, {
  baseY, amplitude, frequency, speed, color, lineWidth, phase
}) {
  ctx.beginPath();
  const step = 6;
  for (let x = 0; x <= width; x += step) {
    const y =
      baseY +
      Math.sin(x * frequency + t * speed + phase) * amplitude +
      Math.sin(x * frequency * 2.3 + t * speed * 1.6 + phase) * (amplitude * 0.25);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.stroke();
}

let raf;
function render(t) {
  ctx.clearRect(0, 0, width, height);

  const midY = height * 0.32;

  drawWave(t * 0.001, {
    baseY: midY - 14,
    amplitude: 26,
    frequency: 0.0021,
    speed: 0.55,
    color: 'rgba(255, 63, 168, 0.55)',
    lineWidth: 1.4,
    phase: 0,
  });

  drawWave(t * 0.001, {
    baseY: midY + 14,
    amplitude: 30,
    frequency: 0.0017,
    speed: 0.4,
    color: 'rgba(46, 230, 255, 0.5)',
    lineWidth: 1.4,
    phase: Math.PI / 3,
  });

  raf = requestAnimationFrame(render);
}

if (!prefersReducedMotion) {
  raf = requestAnimationFrame(render);
} else {
  // Draw a single static frame so the backdrop isn't blank.
  render(0);
  cancelAnimationFrame(raf);
}
