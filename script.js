const bars = document.querySelector(".bars");
if (bars) {
  for (let i = 0; i < 45; i++) {
    const bar = document.createElement("i");
    bar.style.setProperty("--h", `${18 + Math.random() * 82}%`);
    bar.style.setProperty("--delay", `${Math.random() * -1}s`);
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

// Launch date: November 22, 2026. Uses the visitor's local clock.
const launchAt = new Date(2026, 10, 22, 0, 0, 0).getTime();
const pad = value => String(value).padStart(2, "0");
function updateCountdown() {
  const remaining = Math.max(0, launchAt - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  document.querySelector("#days").textContent = pad(days);
  document.querySelector("#hours").textContent = pad(hours);
  document.querySelector("#minutes").textContent = pad(minutes);
  document.querySelector("#seconds").textContent = pad(seconds);
  if (remaining <= 0) {
    document.querySelector(".launch-pill").innerHTML = "<i></i> RELEASE DAY IS HERE";
    document.querySelector(".release-status").textContent = "CHECK BACK FOR THE DOWNLOAD";
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);
