# PULSE website — the plan I worked from

A working plan for me, not a pitch. **Every number was measured** (headless Chromium; v3 = your upload, v4 = this delivery).

## Rule zero (corrected mid-way)
The site stays **a website with its own identity**. My first attempt drifted: a song picker, an app gallery, new fonts and a rewritten
stylesheet made it feel like a player. That was wrong and was thrown away. v4 starts again from your v3 files and changes only what is
broken or missing. Anything that made the page look or behave like an app was removed.

## 1. Measured baseline (v3)
| Area | Finding |
|---|---|
| App imagery | 0 images — the "product window" was HTML drawn to look like an app |
| Third parties | 3 requests (Google Fonts, GSAP, ScrollTrigger) |
| Tiny text | 68 of 138 text elements < 11 px; 44 < 9 px |
| Contrast | 11 of 78 colour pairs < 4.5:1 |
| No JavaScript | 16 of 16 reveal blocks stay invisible |
| Animation | 54 infinite animations, never paused |
| Meta | no favicon / OG image / canonical / twitter card / JSON-LD / skip link / 404 |
| Headers | none |
| Sideways scroll | overflow is clipped (checked: `scrollX` stays 0) — **not** a bug, not changed |

## 2. Done (✔ = verified by a test, not by reading code)
**Imagery**
- ✔ Real Now Playing screenshot of PULSE 2.44.9 replaces the drawn window (WebP, 800 + 1600 w, explicit size, alt text, lazy, hashed name).
- ✔ Copy corrected: it no longer says "concept visualization, not a screenshot".

**Security**
- ✔ `_headers` with strict CSP — tested by serving the site *with* those headers: 0 violations; the test even proved it blocks injected inline CSS.
- ✔ No inline script/style/handlers anywhere; GSAP removed (supply-chain risk gone). External requests 3 → 1 (your Google Fonts, kept on purpose).
- ✔ `security.txt`, `rel=noopener noreferrer` kept on outbound links.

**Performance**
- ✔ Off-screen sections pause their infinite animations (hero, ticker, release).
- ✔ 200 %-size SVG-filter noise layer → 8 KB static tile; pointer glow uses `transform` + rAF; hero scroll motion = one passive listener + rAF.
- ✔ Fonts trimmed from 11 weights to 6 (only the weights the CSS uses). HTML+CSS+JS = 38 KB; page images 75 KB.
- ✔ Immutable caching for hashed images (hash ↔ content verified by `check.mjs`).

**Accessibility & stability**
- ✔ 0 text under 11 px; body copy 13–16 px. Contrast failures 11 → 2, both decorative (the cream full-stop after "OVER", and the outlined hero word which has no fill).
- ✔ Skip link, visible focus, Esc/outside-click closes the menu, `aria-controls`, decorative glyphs `aria-hidden`.
- ✔ Content visible without JS. Reduced-motion respected.
- ✔ Real bug found and fixed during testing: raising text to 11 px pushed the menu button off-screen at 320 px. Layout then stress-tested with a *wider* font (DejaVu) at 320 / 360 / 390 / 768 / 1024 / 1440 — no overflow.
- ✔ Countdown reads `data-launch`, pauses in hidden tabs, never negative, switches to "RELEASE DAY IS HERE".
- ✔ `404.html`, `robots.txt`, `sitemap.xml`, canonical, Open Graph + Twitter card (`og-image.png` built from the real screenshot), JSON-LD, favicon set, manifest.

**Innovation (kept small and un-app-like)**
- ✔ "Add launch day to calendar" — builds an `.ics` locally (CRLF, all-day, reminder the evening before). Verified by downloading it in the test.

## 2b. Added after the plan changed: stores, not downloads
The product ships on **Steam** and the **Microsoft Store**, so a self-hosted download page would have been wrong. I built one first (release
manifest, SHA-256 tool, state machine, browser tests), then **deleted all of it** — a store handles installs, updates and integrity.
What exists instead is small on purpose:
- ✔ Section 04 "Get it": two cards, COMING SOON until each gets an `href`; with `href` they become real links. No JavaScript involved, so it also works with JS off and is crawlable.
- ✔ `tools/stores-link.mjs`: one command per store; refuses non-https, wrong domain, credentials; always writes `target=_blank rel="noopener noreferrer"`.
- ✔ Tested in a browser in both states: no CSP violations, Tab skips cards without a link and reaches both once linked, visible focus ring, opens in a new tab, no `window.opener`, no overflow at 320 / 390 / 768 / 1440 px, and `check.mjs` catches a hand-edited bad link.
- ✔ Naming rule applied: `stores-styles.css`, `tools/stores-link.mjs`, `tools/stores-hosts.mjs` (enforced by `check.mjs`).
- Not done on purpose: official Steam / Microsoft logos and badges (brand rules apply — add them once the pages are live), structured-data `installUrl` (no address yet).

## 3. Deliberately not done
- Song/vibe picker, feature gallery, specs strip, new typefaces — they turned the site into a player/app showcase.
- Self-hosting your three fonts — I have no network and not the files; README has the exact 4-step recipe.
- Persian version — needs your approved wording; I won't machine-translate your brand.
- Analytics, cookies, forms — each would break the "no cookies, no analytics" line now in the footer.

## 4. Needs you
1. The two store addresses (Steam page, Microsoft Store page) — then run the two commands in README.
2. Support e-mail `pulse.supportt@gmail.com` (double "t") — intended?
3. Final domain (canonical, OG, sitemap use `pulse-website-d0n.pages.dev`).
4. Screenshot shows **PULSE 2.44.9** — retake if the shipped build differs.

## 5. Limits of my verification
- Google Fonts cannot load in my sandbox, so I judged layout with fallback fonts plus the wider-font stress test; I did **not** see the page in Space Grotesk / Manrope / DM Mono.
- Not Lighthouse: no network. Measurements are from Chromium APIs and my own checks.
- Not tested on real phones or in Safari/Firefox.
