#!/usr/bin/env node
// Switch a store button on (or off) without touching HTML by hand.
//   node tools/stores-link.mjs steam     https://store.steampowered.com/app/123456/PULSE/
//   node tools/stores-link.mjs microsoft https://apps.microsoft.com/detail/XXXXXXXXXXXX
//   node tools/stores-link.mjs clear steam          (back to "COMING SOON")
//   node tools/stores-link.mjs show
// It only accepts https addresses on the store's own domains and always writes target="_blank" rel="noopener noreferrer".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORES, checkStoreUrl } from './stores-hosts.mjs';

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const die = m => { console.error('\n  ✖ ' + m + '\n'); process.exit(1); };
const tagRe = store => new RegExp(`<a\\b[^>]*\\bdata-store="${store}"[^>]*>`);
const strip = tag => tag.replace(/\s(?:href|target|rel)="[^"]*"/g, '');
const [a, b, c] = process.argv.slice(2);

let html = fs.readFileSync(file, 'utf8');
const current = store => { const t = html.match(tagRe(store)); return t ? (t[0].match(/\shref="([^"]*)"/) || [])[1] || null : undefined; };
const edit = (store, href) => {
  const m = html.match(tagRe(store)); if (!m) die(`could not find the ${STORES[store].label} button (data-store="${store}") in index.html`);
  const base = strip(m[0]);
  const next = href ? base.replace(/>$/, ` href="${href.replace(/&/g, '&amp;').replace(/"/g, '%22')}" target="_blank" rel="noopener noreferrer">`) : base;
  html = html.replace(m[0], next); fs.writeFileSync(file, html);
};

if (a === 'show' || !a) {
  for (const s of Object.keys(STORES)) { const v = current(s); console.log(`  ${STORES[s].label.padEnd(16)} ${v === undefined ? 'button missing!' : v ? v.replace(/&amp;/g, '&') : 'COMING SOON (no link yet)'}`); }
} else if (a === 'clear') {
  if (!STORES[b]) die('usage: clear <steam|microsoft>'); edit(b, null); console.log(`\n  ✔ ${STORES[b].label} is back to "COMING SOON"\n`);
} else if (STORES[a]) {
  if (!b) die(`usage: node tools/stores-link.mjs ${a} <https address of the ${STORES[a].label} page>`);
  const r = checkStoreUrl(a, b); if (r.error) die(`${STORES[a].label}: ${r.error}`);
  if (r.warning) console.log('  ! warning: ' + r.warning);
  edit(a, new URL(b).href); console.log(`\n  ✔ ${STORES[a].label} button is live → ${new URL(b).href}\n  Next: node tools/check.mjs , then deploy.\n`);
} else die('unknown command. Use: steam <url> | microsoft <url> | clear <store> | show');
