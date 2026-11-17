(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  // Releases are intentionally empty until real, approved files and checksums are supplied.
  // The JSON feed is kept separate so publishing files never requires editing the page.
  const list = document.getElementById('release-list');
  fetch('/downloads/releases.json', { cache: 'no-store' }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }).then(data => {
    if (!Array.isArray(data.releases) || data.releases.length === 0) return;
    list.innerHTML = data.releases.map(release => {
      const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const href = /^https:\/\//i.test(release.url || '') || (release.url || '').startsWith('/') ? release.url : '#';
      return `<article class="release-card"><div><span>${safe(release.channel || 'OFFICIAL RELEASE')}</span><h3>${safe(release.name || 'PULSE')}</h3><p>${safe(release.notes || '')}</p></div><dl><div><dt>VERSION</dt><dd>${safe(release.version || '—')}</dd></div><div><dt>PLATFORM</dt><dd>${safe(release.platform || '—')}</dd></div><div><dt>SIZE</dt><dd>${safe(release.size || '—')}</dd></div><div><dt>RELEASED</dt><dd>${safe(release.date || '—')}</dd></div><div class="checksum"><dt>SHA-256</dt><dd>${safe(release.sha256 || 'PUBLISHED WITH FILE')}</dd></div></dl><a href="${safe(href)}" ${href === '#' ? 'aria-disabled="true"' : 'download'}>DOWNLOAD ↧</a></article>`;
    }).join('');
  }).catch(() => { /* Keep the designed empty state visible if the feed is unavailable. */ });
})();
