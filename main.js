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
})();
