# PULSE — Visual Redesign

A redesigned static landing page for the PULSE desktop music player.

## Design direction
- Dark graphite canvas, high-contrast acid-lime identity and oversized kinetic typography.
- A custom abstract hero object and a conceptual desktop-player interface.
- Scroll reveals, GSAP/ScrollTrigger enhancement, CSS motion, ambient pointer glow and a looping brand ticker.
- Responsive layouts for desktop, tablet and mobile, plus `prefers-reduced-motion` support.
- Native scrolling is preserved; no scroll hijacking or forced horizontal scrolling.

## Files
- `index.html` — page structure, metadata, launch date, Instagram and support links
- `styles.css` — full visual system and responsive layouts
- `script.js` — motion, mobile navigation, visualizer details and countdown

## Deployment
For Cloudflare Pages:
- Framework preset: None
- Build command: leave empty
- Build output directory: `.`

## Important content notes
- The product window is a concept visualization, not a screenshot of the final application.
- The countdown targets November 22, 2026 at 00:00 in each visitor's local time.
- Instagram: https://www.instagram.com/pulse_officialy/
- Support: pulse.supportt@gmail.com
- No download URL was present in the source site, so no download button or invented URL has been added.
- Google Fonts and GSAP are loaded from external CDNs. Core layout and fallback reveal behavior still work if GSAP fails to load.
