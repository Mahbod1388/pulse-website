# PULSE — Landing page (v4)

The same page and the same design as v3 — dark graphite canvas, acid-lime identity, oversized kinetic type —
hardened, made faster and filled with a **real screenshot of the application** instead of a drawing.

## What changed in v4 (and what did not)
**Did not change:** layout, copy voice, colors, typefaces (Space Grotesk / Manrope / DM Mono), sections, links.

| Area | v3 | v4 |
|---|---|---|
| App imagery | HTML-drawn "concept" window | **Real screenshot** of PULSE 2.44.9 (demo library, original artwork) |
| Third-party code | Google Fonts + GSAP + ScrollTrigger (3 requests) | Google Fonts only (1 request). GSAP removed — same motion in CSS + ~100 lines of JS |
| Security headers | none | `_headers`: strict CSP (no inline script/style, no `unsafe-*`), nosniff, frame-ancestors none, referrer/permissions policy, COOP/CORP, HSTS |
| Text size | 44 elements under 9 px (7–8 px labels) | **0** elements under 11 px; body copy 13–16 px |
| Contrast | 11 colour pairs under 4.5:1 | 2 left — both decorative (the cream full-stop on the lime section, and the outlined hero word, which has no fill) |
| Without JavaScript | 16 of 16 reveal blocks invisible | everything visible (`html.js` gate) |
| Animation cost | 54 infinite animations, never paused | hero / ticker / release pause when off-screen; heavy 200 %-size SVG-noise layer replaced by an 8 KB tile |
| Keyboard / screen reader | default focus ring, no skip link | skip link, visible focus, Esc closes the menu, `aria-controls`, decorative glyphs hidden |
| Link previews & SEO | none | canonical, Open Graph + Twitter card (`og-image.png`), JSON-LD, favicon set, manifest, `robots.txt`, `sitemap.xml`, `404.html`, `security.txt` |
| Small additions | — | "Add launch day to calendar" (builds an `.ics` in the browser, no service) |

## Files
- `index.html`, `styles.css`, `script.js`, `boot.js` — the page (`boot.js` is 1 line: marks the page as JS-enabled)
- `assets/img/` — real screenshot, content-hashed names (safe to cache forever); `assets/noise.png` — texture tile
- `_headers` — Cloudflare Pages response headers · `robots.txt`, `sitemap.xml`, `.well-known/security.txt`, `site.webmanifest`, `404.html`
- `PLAN.md` — the plan I worked from, with measured before/after numbers
- `tools/check.mjs` — regression gate · `tools/serve.mjs` — local server that applies `_headers`

## Deployment (Cloudflare Pages) — unchanged
- Framework preset: None · Build command: empty · Build output directory: `.`
- `_headers` is picked up automatically. Changing `data-launch` on `#countdown` in `index.html` changes the countdown (local time).

## Before every release
```
node tools/check.mjs          # static gate: links, alt/size on images, CSP-friendliness, 11 px floor, budgets, image hashes
node tools/serve.mjs 8788     # then open http://localhost:8788 — served WITH the real headers, so CSP problems show up in the console
```

## Notes you should know
- Screenshot shows **PULSE 2.44.9** (sidebar label). If the shipped version differs, retake it (scripts are in the screenshots pack).
- **Fonts are still loaded from Google** to keep your typography exactly. To reach zero third-party requests: download the three families
  (OFL licence) into `assets/fonts/`, add `@font-face` rules, delete the 3 Google `<link>` tags and remove `fonts.googleapis.com` / `fonts.gstatic.com`
  from `style-src` / `font-src` in `_headers`.
- No download URL exists yet, so there is no download button (nothing invented). Add it when the file exists.
- Support address is used exactly as given: `pulse.supportt@gmail.com` (double "t") — please confirm it is intended.
- Canonical / OG / sitemap use `https://pulse-website-d0n.pages.dev/`. If you move to a custom domain, change those four places.
- Instagram: https://www.instagram.com/pulse_officialy/
