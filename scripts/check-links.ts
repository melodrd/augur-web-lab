import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { links } from '../src/data/links';
import { reviewVersions } from '../src/data/homepage-review';

const root = resolve('dist');
const htmlFiles: string[] = [];
async function scan(path: string): Promise<void> { for (const entry of await readdir(path, { withFileTypes: true })) { const full = join(path, entry.name); if (entry.isDirectory()) await scan(full); else if (full.endsWith('.html')) htmlFiles.push(full); } }
await scan(root);
const failures: string[] = [];
const registered = Object.values(links).map(link => link.url);
const content = new Map(await Promise.all(htmlFiles.map(async path => [path, await readFile(path, 'utf8')] as const)));
let count = 0;
for (const [path, html] of content) {
  const route = '/' + path.slice(root.length + 1).replace(/index\.html$/, '');
  for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']*)["']/gi)) {
    const href = match[1]!.replace(/&amp;/g, '&'); count++;
    if (!href || href === '#') { failures.push(`${route}: empty destination`); continue; }
    if (/^(https?:|mailto:)/i.test(href)) {
      if (!registered.some(url => href === url || href.startsWith(url + '?') || href.startsWith(url + '#'))) failures.push(`${route}: external destination missing from registry: ${href}`);
      continue;
    }
    if (/^[a-z][a-z\d+.-]*:/i.test(href)) { failures.push(`${route}: unexpected URL scheme: ${href}`); continue; }
    const target = new URL(href, `https://www.augur.net${route}`);
    let file = join(root, decodeURIComponent(target.pathname));
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); }
    catch { if (!target.pathname.endsWith('/')) file = `${file}.html`; }
    try { await stat(file); } catch { failures.push(`${route}: unresolved ${href}`); continue; }
    if (target.hash && file.endsWith('.html')) {
      const targetHtml = content.get(file) ?? await readFile(file, 'utf8');
      const fragment = decodeURIComponent(target.hash.slice(1)).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid=["']${fragment}["']`).test(targetHtml)) failures.push(`${route}: missing fragment ${href}`);
    }
  }
}
// The homepage's versions (reviewVersions; named for whose notes they show since 26 Oct 2026): each is
// built at its path, and vercel.json redirects its slashless name to it (/ryan → /ryan/, /melo → /), as
// trailingSlash 'always' would otherwise answer 404 there. Every redirect, the retired numbered paths (/1/ to
// /4/) included, must land on a page that is built, so a removed version leaves no redirect to nowhere.
const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8')) as { redirects?: { source: string; destination: string }[] };
const redirects = vercel.redirects ?? [];
for (const { version, path } of reviewVersions) {
  if (!redirects.some(({ source, destination }) => source === `/${version}` && destination === path)) failures.push(`vercel.json: no redirect /${version} → ${path} for the homepage version`);
  try { await stat(join(root, path.replace(/^\/|\/$/g, ''), 'index.html')); } catch { failures.push(`${path}: homepage version missing from dist`); }
}
for (const { source, destination } of redirects) {
  try { await stat(join(root, destination.replace(/^\/|\/$/g, ''), 'index.html')); } catch { failures.push(`vercel.json: redirect ${source} → ${destination} lands on no built page`); }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`${htmlFiles.length} pages, ${count} anchor destinations resolve and external URLs come from the registry; ${reviewVersions.length} homepage versions built, each with its vercel.json redirect.`);
