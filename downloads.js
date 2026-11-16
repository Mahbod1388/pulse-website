(() => {
  const status = document.getElementById('manifest-status');
  const list = document.getElementById('release-list');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.desktop-nav');
  menuButton?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open') ?? false;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));
  const safeText = (value, max = 500) => typeof value === 'string' ? value.slice(0, max) : '';
  const safeUrl = (value) => {
    if (typeof value !== 'string') return null;
    try { const url = new URL(value, window.location.origin); return url.protocol === 'https:' || (url.origin === window.location.origin && url.protocol === 'http:') ? url.href : null; } catch { return null; }
  };
  const formatBytes = bytes => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '';
    const units = ['B', 'KB', 'MB', 'GB']; let size = bytes, unit = 0;
    while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit++; }
    return `${size.toFixed(unit ? 1 : 0)} ${units[unit]}`;
  };
  function node(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; }
  function render(releases) {
    const published = releases.filter(r => r && r.status === 'published' && Array.isArray(r.files) && r.files.length);
    if (!published.length) {
      const empty = node('div', 'downloads-empty'); empty.append(node('span', 'empty-symbol', '↧'));
      empty.append(node('h3', '', 'THE FIRST DROP IS ON ITS WAY.'));
      empty.append(node('p', '', 'There are no public downloads yet. Official files will appear here when a release is published.'));
      list.replaceChildren(empty); status.textContent = 'NO PUBLIC RELEASES YET'; return;
    }
    list.replaceChildren(); status.textContent = `${published.length} OFFICIAL RELEASE${published.length === 1 ? '' : 'S'}`;
    published.sort((a,b) => String(b.releaseDate || '').localeCompare(String(a.releaseDate || '')));
    for (const release of published) {
      const card = node('article', 'release-card'); const details = node('div', '');
      details.append(node('h3', '', `${safeText(release.name, 100)}${release.version ? ` · ${safeText(release.version, 40)}` : ''}`));
      const meta = node('div', 'release-meta');
      for (const value of [safeText(release.platform, 50), safeText(release.releaseDate, 30), safeText(release.channel, 30)]) if (value) meta.append(node('span', '', value));
      details.append(meta); if (release.notes) details.append(node('p', 'release-notes', safeText(release.notes, 1800)));
      const actions = node('div', 'release-actions');
      for (const file of release.files) {
        const url = safeUrl(file && file.url); if (!url) continue;
        const a = node('a', 'release-download'); a.href = url; a.rel = 'noopener noreferrer';
        a.append(node('span', '', `DOWNLOAD ${safeText(file.label || file.name || 'FILE', 60).toUpperCase()}`)); a.append(node('b', '', '↓'));
        if (new URL(url).origin !== window.location.origin) a.target = '_blank';
        actions.append(a);
        if (file.sha256 && /^[a-f0-9]{64}$/i.test(file.sha256)) actions.append(node('div', 'checksum', `SHA-256  ${file.sha256.toLowerCase()}`));
      }
      if (!actions.children.length) continue; card.append(details, actions); list.append(card);
    }
    if (!list.children.length) { status.textContent = 'NO VALID DOWNLOAD LINKS'; render([]); }
  }
  fetch('/downloads/releases.json', { cache: 'no-cache', headers: { 'Accept': 'application/json' } })
    .then(response => { if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`); return response.json(); })
    .then(data => { if (!data || data.schemaVersion !== 1 || !Array.isArray(data.releases)) throw new Error('Unsupported release manifest'); render(data.releases); })
    .catch(() => { status.textContent = 'RELEASE LIST UNAVAILABLE'; const msg = node('div', 'downloads-empty'); msg.append(node('span','empty-symbol','!'), node('h3','','COULD NOT LOAD RELEASES.'), node('p','','Please try again in a moment, or contact PULSE support if the issue continues.')); list.replaceChildren(msg); });
})();
