// Which addresses may a store button point to? Shared by stores-link.mjs and check.mjs. Zero dependencies.
export const STORES = {
  steam: {
    label: 'Steam',
    hosts: ['store.steampowered.com', 's.team'],
    pathHint: 'Steam page addresses look like https://store.steampowered.com/app/123456/PULSE/',
    pathOk: u => u.hostname === 's.team' || /^\/app\/\d+/.test(u.pathname)
  },
  microsoft: {
    label: 'Microsoft Store',
    hosts: ['apps.microsoft.com', 'www.microsoft.com', 'microsoft.com', 'aka.ms'],
    pathHint: 'Microsoft Store page addresses look like https://apps.microsoft.com/detail/<product id>',
    pathOk: u => u.hostname === 'aka.ms' || /^\/(?:[a-z]{2}-[a-z]{2}\/)?(?:store\/)?(?:detail|apps|p)\//i.test(u.pathname)
  }
};
export const ALL_STORE_HOSTS = Object.values(STORES).flatMap(s => s.hosts);

/** returns { error } for an unacceptable address, { warning } for a suspicious one, {} when fine */
export function checkStoreUrl(store, value) {
  const s = STORES[store]; if (!s) return { error: `unknown store "${store}"` };
  let u; try { u = new URL(value); } catch { return { error: 'not a valid address' }; }
  if (u.protocol !== 'https:') return { error: 'must start with https://' };
  if (u.username || u.password) return { error: 'must not contain a user name or password' };
  if (!s.hosts.includes(u.hostname)) return { error: `host "${u.hostname}" is not a ${s.label} address (allowed: ${s.hosts.join(', ')})` };
  if (!s.pathOk(u)) return { warning: `that path does not look like a ${s.label} product page. ${s.pathHint}` };
  return {};
}
