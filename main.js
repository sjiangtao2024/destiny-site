const scrollLinks = document.querySelectorAll('a[href^="#"], button[data-scroll-target]');

const scrollToTarget = (target) => {
  const el = document.querySelector(target);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

scrollLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = link.dataset.scrollTarget || link.getAttribute('href');
    if (target && target.startsWith('#')) {
      event.preventDefault();
      scrollToTarget(target);
    }
  });
});

// Add a light fade-in for sections on load
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((section) => {
  section.classList.add('fade-ready');
  observer.observe(section);
});
