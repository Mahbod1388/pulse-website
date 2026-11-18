(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile navigation (closes on link, Esc, outside click and when the layout switches to desktop).
  const menuButton = $(".menu-toggle");
  const nav = $(".desktop-nav");
  const setMenu = open => {
    if (!nav || !menuButton) return;
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };
  menuButton?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$(".desktop-nav a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav?.classList.contains("open")) { setMenu(false); menuButton?.focus(); }
  });
  document.addEventListener("click", event => {
    if (nav?.classList.contains("open") && !nav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  window.matchMedia("(min-width: 651px)").addEventListener?.("change", event => { if (event.matches) setMenu(false); });

  // Scroll reveal. Content is only hidden while JavaScript runs (html.js), so it never gets stuck invisible.
  const revealItems = $$(".reveal");
  $$(".principle").forEach((el, i) => { el.style.transitionDelay = `${i * 80}ms`; });
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

  // Scroll-linked motion of the hero object (replaces the former GSAP ScrollTrigger; one passive listener + rAF).
  const hero = $(".hero");
  if (hero && !reducedMotion) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight)));
      document.documentElement.style.setProperty("--hp", progress.toFixed(3));
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Infinite animations pause while their section is off-screen (saves battery and GPU).
  if ("IntersectionObserver" in window) {
    const watcher = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("is-off", !entry.isIntersecting));
    }, { rootMargin: "120px 0px" });
    $$(".hero, .ticker, .release").forEach(el => watcher.observe(el));
  }

  // Subtle pointer ambience, only on devices with a precise pointer (transform only, no layout work).
  const glow = $(".cursor-glow");
  if (glow && matchMedia("(hover:hover) and (pointer:fine)").matches && !reducedMotion) {
    let x = 0, y = 0, queued = false;
    window.addEventListener("pointermove", event => {
      x = event.clientX; y = event.clientY;
      if (!queued) {
        queued = true;
        requestAnimationFrame(() => { glow.style.transform = `translate3d(${x}px, ${y}px, 0)`; queued = false; });
      }
    }, { passive: true });
  }

  // Launch countdown. The date lives in the markup (data-launch, local time) so it can change without touching JS.
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const countdown = $("#countdown");
  let launch = new Date(countdown?.dataset.launch || "");
  if (Number.isNaN(launch.getTime())) launch = new Date(2026, 10, 22, 0, 0, 0);
  const launchAt = launch.getTime();
  const pad = n => String(n).padStart(2, "0");
  let timer = 0;
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
      const label = $("#release-label-text");
      if (label) label.textContent = "RELEASE DAY IS HERE";
      const cal = $("#add-calendar");
      if (cal) cal.hidden = true;
      clearInterval(timer); timer = 0;
    }
  }
  const startTimer = () => { if (!timer) timer = window.setInterval(updateCountdown, 1000); updateCountdown(); };
  const stopTimer = () => { clearInterval(timer); timer = 0; };
  startTimer();
  document.addEventListener("visibilitychange", () => (document.hidden ? stopTimer() : startTimer()));

  // "Add to calendar": builds an .ics file locally. No service, no tracking.
  $("#add-calendar")?.addEventListener("click", () => {
    const d = launch, p = (n, l = 2) => String(n).padStart(l, "0");
    const day = `${p(d.getFullYear(), 4)}${p(d.getMonth() + 1)}${p(d.getDate())}`;
    const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const nextDay = `${p(next.getFullYear(), 4)}${p(next.getMonth() + 1)}${p(next.getDate())}`;
    const now = new Date();
    const stamp = `${p(now.getUTCFullYear(), 4)}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}T${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}Z`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PULSE//Launch day//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      `UID:pulse-launch-${day}@pulse-website-d0n.pages.dev`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${nextDay}`,
      "SUMMARY:PULSE launch day", "DESCRIPTION:The first release of PULSE. Follow @pulse_officialy for the download announcement.",
      "URL:https://pulse-website-d0n.pages.dev/",
      "BEGIN:VALARM", "TRIGGER:-PT15H", "ACTION:DISPLAY", "DESCRIPTION:PULSE launches tomorrow", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "pulse-launch-day.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
})();
