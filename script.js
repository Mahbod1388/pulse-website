const bars = document.querySelector(".waveform");
if (bars) {
  for (let i = 0; i < 43; i++) {
    const bar = document.createElement("i");
    bar.style.setProperty("--h", `${12 + Math.random() * 88}%`);
    bar.style.setProperty("--d", `${Math.random() * -.9}s`);
    bars.appendChild(bar);
  }
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));
document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelectorAll(".magnetic").forEach(el => {
  el.addEventListener("pointermove", e => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .08;
    const y = (e.clientY - r.top - r.height / 2) * .12;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener("pointerleave", () => el.style.transform = "");
});
