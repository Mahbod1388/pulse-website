// Zero-dependency static server that APPLIES the rules in ../_headers, so the CSP can be tested for real.
// usage: node tools/serve.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2]) || 8788;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.woff': 'font/woff', '.woff2': 'font/woff2' };

function rules() {
  const out = []; let cur = null;
  for (const line of fs.readFileSync(path.join(root, '_headers'), 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { cur = { pattern: line.trim(), headers: [] }; out.push(cur); }
    else { const i = line.indexOf(':'); cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]); }
  }
  return out;
}
const re = p => new RegExp('^' + p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
const R = rules().map(r => ({ ...r, re: re(r.pattern) }));

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  const send = (code, body, type, urlPath) => {
    const h = { 'Content-Type': type };
    for (const r of R) if (r.re.test(urlPath)) for (const [k, v] of r.headers) h[k] = v;   // later rules override earlier ones
    res.writeHead(code, h); res.end(body);
  };
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const nf = path.join(root, '404.html');
    return send(404, fs.readFileSync(nf), 'text/html; charset=utf-8', '/404.html');
  }
  send(200, fs.readFileSync(file), types[path.extname(file)] || 'application/octet-stream', p);
}).listen(port, () => console.log('serving', root, 'on http://localhost:' + port));
