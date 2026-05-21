(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Hero: reveal immediately on load ---
  const heroReveals = document.querySelectorAll('.hero .reveal');
  requestAnimationFrame(() => {
    heroReveals.forEach(el => el.classList.add('is-visible'));
  });

  if (prefersReducedMotion) {
    // Show everything immediately; skip observer + parallax
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  // --- Sections: reveal on scroll, with per-child stagger ---
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const reveals = entry.target.querySelectorAll('.reveal');
      reveals.forEach((el, i) => {
        if (!el.style.getPropertyValue('--reveal-delay')) {
          el.style.setProperty('--reveal-delay', `${i * 0.1}s`);
        }
        el.classList.add('is-visible');
      });
      sectionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('main .section, .footer').forEach(s => sectionObserver.observe(s));

  // --- Parallax for blobs ---
  const blobs = Array.from(document.querySelectorAll('.blob[data-parallax]'))
    .map(el => ({ el, factor: parseFloat(el.dataset.parallax) || 0 }));

  let ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    blobs.forEach(({ el, factor }) => {
      el.style.setProperty('--parallax-y', `${y * factor * -1}px`);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();
