// Zero-dependency regression gate for the PULSE site.  usage: node tools/check.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists = f => fs.existsSync(path.join(root, f));
let fails = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log('  FAIL  ' + msg); } else console.log('  ok    ' + msg); };

const pages = ['index.html', '404.html'];
const css = read('styles.css');
const allowedHosts = ['www.instagram.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'pulse-website-d0n.pages.dev', 'schema.org', 'www.w3.org', 'www.sitemaps.org'];

for (const page of pages) {
  console.log('\n' + page);
  const h = read(page);
  // local references exist
  const refs = [...h.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|mailto:|data:|#)/.test(u));
  const missing = refs.map(u => u.split('?')[0].split('#')[0]).filter(u => u && !exists(u.replace(/^\//, '')));
  ok(missing.length === 0, `all ${refs.length} local references exist` + (missing.length ? ' — missing: ' + missing.join(', ') : ''));
  // anchors & aria-controls
  const ids = new Set([...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const anchors = [...h.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  ok(anchors.every(a => ids.has(a)), 'all #anchors point to an existing id');
  ok([...h.matchAll(/aria-controls="([^"]+)"/g)].every(m => ids.has(m[1])), 'aria-controls targets exist');
  // images
  const imgs = [...h.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  ok(imgs.every(i => /\salt="/.test(i) && /\swidth="\d+"/.test(i) && /\sheight="\d+"/.test(i)), `all ${imgs.length} <img> have alt, width and height (no layout shift)`);
  // CSP friendliness
  ok(!/\sstyle="/.test(h), 'no inline style attributes (CSP)');
  ok(![...h.matchAll(/<script\b([^>]*)>/g)].some(m => !/\bsrc=/.test(m[1]) && !/application\/ld\+json/.test(m[1])), 'no inline scripts (CSP)');
  ok(!/\son[a-z]+="/.test(h), 'no inline event handlers (CSP)');
  // external hosts
  const hosts = new Set([...h.matchAll(/https?:\/\/([^/"'\s)]+)/g)].map(m => m[1]));
  const bad = [...hosts].filter(x => !allowedHosts.includes(x));
  ok(bad.length === 0, 'only allow-listed external hosts' + (bad.length ? ': ' + bad.join(', ') : ''));
  ok(!/<a [^>]*target="_blank"(?![^>]*rel="[^"]*noopener)/.test(h), 'every target=_blank has rel=noopener');
}

console.log('\nindex.html — head & content');
const idx = read('index.html');
ok(/<html lang="en">/.test(idx), 'lang attribute set');
ok(/<link rel="canonical"/.test(idx) && /property="og:image"/.test(idx) && /name="twitter:card"/.test(idx), 'canonical + Open Graph + Twitter card');
try { JSON.parse(idx.match(/application\/ld\+json">([\s\S]*?)<\/script>/)[1]); ok(true, 'JSON-LD is valid JSON'); } catch { ok(false, 'JSON-LD is valid JSON'); }
ok((idx.match(/<h1\b/g) || []).length === 1, 'exactly one <h1>');
ok(/class="skip-link"/.test(idx), 'skip link present');
ok(!/gsap|cdnjs/.test(idx), 'no CDN scripts');

console.log('\nstyles.css');
const small = [...css.matchAll(/font(?:-size)?:\s*(?:\d{3}\s+)?(\d+(?:\.\d+)?)px/g)].filter(m => Number(m[1]) < 11);
ok(small.length === 0, 'no text smaller than 11px' + (small.length ? ` (${small.length} found)` : ''));
ok(/\.js \.reveal\{/.test(css) && !/(^|\})\.reveal\{opacity:0/.test(css), 'scroll-reveal only hides content when JS runs');
ok(/prefers-reduced-motion/.test(css), 'prefers-reduced-motion handled');
ok(/:focus-visible/.test(css), 'visible keyboard focus style');

console.log('\n_headers');
const hdr = read('_headers');
for (const d of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'", "form-action 'none'"]) ok(hdr.includes(d), 'CSP has ' + d);
for (const n of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security', 'Cross-Origin-Opener-Policy']) ok(hdr.includes(n), 'header ' + n);
ok(!/unsafe-inline|unsafe-eval/.test(hdr), 'CSP has no unsafe-inline / unsafe-eval');

console.log('\nfiles & assets');
for (const f of ['robots.txt', 'sitemap.xml', '.well-known/security.txt', 'site.webmanifest', 'favicon.svg', 'apple-touch-icon.png', 'og-image.png', 'icon-192.png', 'icon-512.png', 'boot.js', 'script.js']) ok(exists(f), f + ' exists');
try { const m = JSON.parse(read('site.webmanifest')); ok(m.icons.every(i => exists(i.src.replace(/^\//, ''))), 'manifest icons exist'); } catch { ok(false, 'manifest parses'); }
// content-hashed image names must match their bytes (immutable caching depends on it)
const imgDir = path.join(root, 'assets/img');
const badHash = fs.readdirSync(imgDir).filter(f => { const m = f.match(/\.([0-9a-f]{8})\.webp$/); return !m || crypto.createHash('sha256').update(fs.readFileSync(path.join(imgDir, f))).digest('hex').slice(0, 8) !== m[1]; });
ok(badHash.length === 0, 'image file names match their content hash' + (badHash.length ? ': ' + badHash.join(', ') : ''));
const kb = f => fs.statSync(path.join(root, f)).size / 1024;
const code = kb('index.html') + kb('styles.css') + kb('script.js') + kb('boot.js');
ok(code < 60, `HTML+CSS+JS = ${code.toFixed(1)} KB (budget 60 KB)`);
const shown = [...idx.matchAll(/assets\/img\/([^"\s,]+)/g)].map(m => m[1]);
const imgKB = [...new Set(shown)].reduce((a, f) => a + kb('assets/img/' + f), 0);
ok(imgKB < 400, `page images (all srcset candidates) = ${imgKB.toFixed(0)} KB (budget 400 KB)`);
ok(kb('assets/noise.png') < 16, `noise tile = ${kb('assets/noise.png').toFixed(1)} KB`);

console.log(fails ? `\n${fails} check(s) FAILED` : '\nOK — all checks passed');
process.exit(fails ? 1 : 0);
