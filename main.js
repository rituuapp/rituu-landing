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

  // --- Per-element reveal observer ---
  // Each .reveal element below the hero animates when IT enters the
  // viewport — not when its parent section does. Avoids the bug where
  // a tall section (e.g. Playground with 4 stacked cards on mobile)
  // would fire all reveals at once the moment the section top peeked
  // into view, leaving nothing to animate by the time the user
  // actually scrolled to the cards.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('main .reveal, .footer .reveal').forEach(el => {
    revealObserver.observe(el);
  });

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
