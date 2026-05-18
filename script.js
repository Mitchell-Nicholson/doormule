// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(8,8,8,0.97)';
  } else {
    nav.style.background = 'rgba(8,8,8,0.85)';
  }
}, { passive: true });

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Scroll-triggered fade-in animations
const fadeEls = document.querySelectorAll('[data-fade]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// Add data-fade to key elements dynamically
function addFadeAttrs() {
  const groups = [
    { selector: '.feature-card', baseDelay: 0, step: 80 },
    { selector: '.problem-item', baseDelay: 0, step: 80 },
    { selector: '.step', baseDelay: 0, step: 120 },
    { selector: '.testimonial-card', baseDelay: 0, step: 100 },
    { selector: '.product-card', baseDelay: 0, step: 100 },
  ];

  groups.forEach(({ selector, baseDelay, step }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.setAttribute('data-fade', '');
      el.setAttribute('data-delay', baseDelay + i * step);
    });
  });

  const singleFades = [
    '.section-title', '.section-eyebrow', '.hero-badge',
    '.hero-headline', '.hero-sub', '.hero-ctas', '.hero-stats',
    '.founder-inner', '.final-cta-inner', '.payment-banner',
    '.problem-cta-text',
  ];
  singleFades.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.setAttribute('data-fade', '');
    });
  });

  // Re-observe all newly attributed elements
  document.querySelectorAll('[data-fade]').forEach(el => observer.observe(el));
}

addFadeAttrs();

// Smooth anchor scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Animated number counters on scroll
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const text = counter.textContent.trim();
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');
    if (isNaN(num)) return;

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);
      counter.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  });
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}
