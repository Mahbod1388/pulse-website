# PULSE — Landing page (v4.1)

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
- `stores-styles.css`, `tools/stores-link.mjs`, `tools/stores-hosts.mjs` — the "Get it" section (Steam + Microsoft Store)
- `assets/img/` — real screenshot, content-hashed names (safe to cache forever); `assets/noise.png` — texture tile
- `_headers` — Cloudflare Pages response headers · `robots.txt`, `sitemap.xml`, `.well-known/security.txt`, `site.webmanifest`, `404.html`
- `PLAN.md` — the plan I worked from, with measured before/after numbers
- `tools/check.mjs` — regression gate · `tools/serve.mjs` — local server that applies `_headers`


## Get it: Steam + Microsoft Store (section 04, `#get`)
PULSE ships through two stores, so there is no direct-download page. The section has two cards that read **COMING SOON** and are not clickable
until you give each one its store address. Nothing else on the page needs to change.

**Easiest (recommended):**
```
node tools/stores-link.mjs steam     https://store.steampowered.com/app/123456/PULSE/
node tools/stores-link.mjs microsoft https://apps.microsoft.com/detail/XXXXXXXXXXXX
node tools/stores-link.mjs show                    # what is live right now
node tools/stores-link.mjs clear steam             # back to COMING SOON
node tools/check.mjs
```
The tool accepts only `https://` addresses on the store's own domains (Steam: `store.steampowered.com`, `s.team` · Microsoft: `apps.microsoft.com`,
`www.microsoft.com`, `microsoft.com`, `aka.ms`) and always writes `target="_blank" rel="noopener noreferrer"`.

**By hand:** open `index.html`, find `data-store="steam"` / `data-store="microsoft"` and add three attributes to that `<a>`:
`href="<store page address>" target="_blank" rel="noopener noreferrer"`. `check.mjs` verifies what you typed.

Official Steam / Microsoft badges and logos are **not** used (both companies publish brand rules for them). Add them when the store pages are live.

## File naming
Files that belong to one section carry its name: `stores-styles.css`, `stores-link.mjs`, `stores-hosts.mjs`.
Shared files keep generic names (`index.html`, `styles.css`, `script.js`, `boot.js`). `check.mjs` enforces both rules.

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
- No store address exists yet, so both store cards say COMING SOON (nothing invented). The footer says "GET IT" and the release text points to the store section.
- Support address is used exactly as given: `pulse.supportt@gmail.com` (double "t") — please confirm it is intended.
- Canonical / OG / sitemap use `https://pulse-website-d0n.pages.dev/`. If you move to a custom domain, change those four places.
- Instagram: https://www.instagram.com/pulse_officialy/
