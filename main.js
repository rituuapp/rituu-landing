(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Hero: reveal immediately on load ---
  const heroReveals = document.querySelectorAll('.hero .reveal');
  requestAnimationFrame(() => {
    heroReveals.forEach(el => el.classList.add('is-visible'));
  });

  // --- "What is rituu" carousel: mouse drag-to-scroll + mobile dots ---
  // Runs regardless of reduced-motion since the controls are functional,
  // not decorative. Dot tracking no-ops on desktop (dots hidden).
  const cardScroller = document.getElementById('rituu-cards');
  const dotsWrap = document.querySelector('.cards__dots');
  if (cardScroller && dotsWrap) {
    const dots = Array.from(dotsWrap.querySelectorAll('.cards__dot'));
    const cards = Array.from(cardScroller.querySelectorAll('.card'));
    // Inset a settled card sits at — matches scroll-padding-inline (1.5rem).
    const SCROLL_PAD = 24;

    // Scroll ONLY the carousel to bring a card to the start inset.
    // (Deliberately NOT scrollIntoView: that scrolls every scrollable
    // ancestor — including <body>, which has overflow-x:hidden but is
    // still programmatically scrollable — yanking the whole page sideways.)
    const scrollToCard = (card) => {
      const offset = card.getBoundingClientRect().left
        - cardScroller.getBoundingClientRect().left;
      const target = cardScroller.scrollLeft + offset - SCROLL_PAD;
      cardScroller.scrollTo({
        left: Math.max(0, target),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    };

    // Tap a dot -> bring its card into view
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const card = cards[Number(dot.dataset.index)];
        if (card) scrollToCard(card);
      });
    });

    // Drag the cards left/right with a mouse (touch scrolls natively).
    // Pointer capture keeps the drag alive if the cursor moves fast or
    // leaves the element. Deliberately NO snap/settle on release — the
    // row stays exactly where you let go, so there's no post-release
    // movement (the "flick" that felt broken before).
    let isDown = false, startX = 0, startScroll = 0, moved = false, pid = null;
    cardScroller.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      isDown = true; moved = false; pid = e.pointerId;
      startX = e.clientX;
      startScroll = cardScroller.scrollLeft;
      cardScroller.setPointerCapture(pid);
      cardScroller.classList.add('is-dragging');
    });
    cardScroller.addEventListener('pointermove', (e) => {
      if (!isDown || e.pointerId !== pid) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      cardScroller.scrollLeft = startScroll - dx;
    });
    const endDrag = (e) => {
      if (!isDown || (e && e.pointerId !== pid)) return;
      isDown = false;
      cardScroller.classList.remove('is-dragging');
      try { cardScroller.releasePointerCapture(pid); } catch (_) { /* already released */ }
      pid = null;
    };
    cardScroller.addEventListener('pointerup', endDrag);
    cardScroller.addEventListener('pointercancel', endDrag);
    cardScroller.addEventListener('lostpointercapture', endDrag);
    // Swallow the click fired at the end of a drag so it can't trigger
    // anything inside a card.
    cardScroller.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // Highlight the dot for whichever card is closest to centre.
    // Dots are mobile-only, so skip the work entirely when they're
    // hidden (desktop). Re-checks per scroll, so resizing is handled.
    let dotTicking = false;
    const updateActiveDot = () => {
      dotTicking = false;
      if (getComputedStyle(dotsWrap).display === 'none') return;
      const scrollerRect = cardScroller.getBoundingClientRect();
      const center = scrollerRect.left + scrollerRect.width / 2;
      let best = 0, bestDist = Infinity;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const dist = Math.abs((r.left + r.width / 2) - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      dots.forEach((d, di) => d.classList.toggle('is-active', di === best));
    };
    cardScroller.addEventListener('scroll', () => {
      if (!dotTicking) {
        requestAnimationFrame(updateActiveDot);
        dotTicking = true;
      }
    }, { passive: true });
  }

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
  }, { threshold: 0.15 });

  document.querySelectorAll('main .reveal, .footer .reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // --- Parallax for blobs ---
  // Side blobs parallax RELATIVE to their own section so they stay local
  // and never travel across the page. (The old `scrollY * factor` used
  // absolute scroll, so a blob deep in the document got yanked ~1000px+
  // up into earlier sections — e.g. the connect blob landing in the
  // "What is rituu" section.) Hero blobs keep the simple top-anchored
  // behaviour: they rest at scroll 0 and only drift up as you leave.
  const docTop = (el) => {           // transform-independent document top
    let t = 0;
    for (let n = el; n; n = n.offsetParent) t += n.offsetTop;
    return t;
  };
  const blobs = Array.from(document.querySelectorAll('.blob[data-parallax]'))
    .map(el => ({
      el,
      factor: parseFloat(el.dataset.parallax) || 0,
      side: el.classList.contains('blob--side'),
      base: docTop(el),
    }));
  const recomputeBases = () => blobs.forEach(b => { b.base = docTop(b.el); });
  window.addEventListener('resize', recomputeBases, { passive: true });

  let ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    blobs.forEach(({ el, factor, side, base }) => {
      // Side blobs: 0 when their section is centred, clamped to <= 0 so
      // they only ever shift UP. A downward shift would push the blob
      // below the page and grow the document height — and since that
      // grows with scroll, it makes scrolling stutter/block. Shifting up
      // just moves off-screen (no height change), which is always safe.
      const py = side ? Math.min(0, -(y - (base - vh / 2)) * factor) : -y * factor;
      el.style.setProperty('--parallax-y', `${py}px`);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax(); // set initial positions (in case the page loads scrolled)
})();
