(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Animated equalizer bars in the product concept.
  $$(".player-wave").forEach(wave => {
    for (let i = 0; i < 15; i++) {
      const bar = document.createElement("i");
      bar.style.setProperty("--bar", `${5 + Math.random() * 22}px`);
      bar.style.setProperty("--delay", `${Math.random() * -0.9}s`);
      wave.appendChild(bar);
    }
  });

  // Mobile navigation.
  const menuButton = $(".menu-toggle");
  const nav = $(".desktop-nav");
  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  $$(".desktop-nav a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  // Reveal fallback: works even if the animation CDN is unavailable.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  // GSAP scroll choreography, progressively enhanced.
  window.addEventListener("load", () => {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hero-title .title-line", {
      yPercent: 115, opacity: 0, duration: 1.05, stagger: 0.13,
      ease: "power4.out", delay: 0.12, clearProps: "all"
    });
    gsap.from(".hero-visual", {
      opacity: 0, scale: .88, rotate: -5, duration: 1.35,
      ease: "power3.out", delay: .25
    });
    gsap.utils.toArray(".principle").forEach((item, i) => {
      gsap.from(item, {
        y: 35, opacity: 0, duration: .8, delay: i * .08,
        ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 88%" }
      });
    });
    gsap.to(".visual-core", {
      rotate: 12, y: -18, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.to(".ticker-track", {
      xPercent: -12, ease: "none",
      scrollTrigger: { trigger: ".ticker", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  });

  // Subtle pointer ambience, only on devices with a precise pointer.
  const glow = $(".cursor-glow");
  if (glow && matchMedia("(hover:hover) and (pointer:fine)").matches && !reducedMotion) {
    window.addEventListener("pointermove", event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  // Launch countdown; date remains November 22, 2026 at midnight visitor-local time.
  $("#year").textContent = new Date().getFullYear();
  const launchAt = new Date(2026, 10, 22, 0, 0, 0).getTime();
  const pad = n => String(n).padStart(2, "0");
  function updateCountdown() {
    const remaining = Math.max(0, launchAt - Date.now());
    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(value);
    });
    if (remaining <= 0) {
      const label = $(".release-label");
      if (label) label.innerHTML = '<i class="live-dot"></i> RELEASE DAY IS HERE';
    }
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();