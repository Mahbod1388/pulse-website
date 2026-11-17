# PULSE — Official website

A marketing and product-discovery website for the PULSE desktop application. This is **not** a browser music player.

## File map (intentionally separated)

- `index.html` — main homepage only.
- `assets/css/home.css` — homepage styles.
- `assets/js/home.js` — homepage interactions and launch countdown.
- `downloads/index-download.html` — Download Center page (named explicitly to avoid confusion with the homepage).
- `downloads/download-center.css` — Download Center styles.
- `downloads/download-center.js` — Download Center behavior.
- `downloads/releases.json` — release feed. Add real approved release records here when files are ready.

All Download Center assets use absolute `/downloads/...` paths, and its Home links return to `/index.html`. The root homepage does not load Download Center CSS or JavaScript.

## Publishing releases

Add a release object to `downloads/releases.json` only after the real file is available. Suggested fields: `name`, `version`, `platform`, `size`, `date`, `channel`, `notes`, `url`, `sha256`. Never publish placeholder files or invented checksums. Current desktop source identifies the application version as `2.44.12`; the download feed intentionally remains empty until a distributable installer is provided.

## Design and interaction

- Dark graphite and acid-lime PULSE identity, editorial typography and abstract motion artwork.
- Animated orbital hero, scroll progress, reveal transitions, moving marquees, hover tilt and magnetic links.
- Responsive mobile navigation and reduced-motion support.
- The artwork is abstract brand artwork, not represented as an authentic application screenshot.

## Hosting

Static site; no build step. Deploy the repository root as the output directory. Ensure the host serves root-relative paths and `downloads/releases.json` as JSON.
