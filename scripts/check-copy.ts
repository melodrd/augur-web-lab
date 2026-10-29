import { readFile } from 'node:fs/promises';
import { homepageCopySource as source } from '../src/data/homepage-copy';

function normalize(value: string): string {
  return value.replace(/&(?:#39|apos);/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/↗/g, '')
    .replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
}

// The copy source (homepage-copy-source.json) is kept apart from the rendering data. Since Melo's version became
// the homepage (29 Oct 2026) it holds that page's draft copy; text that is unchanged keeps its Figma 28:7 node or
// earlier draft id. Compare the default desktop state; state transitions have separate browser QA.
const selectors = ['.announcement', '.site-header', '.home-hero', '.tenets', '.applications', '.how-it-works', '.roadmap', '.home-learn', '.site-footer'];
const excluded = [
  'script', 'style', 'svg', 'noscript', '[hidden]', '.sr-only', 'dialog', '.nav-panel', '.roadmap-plus',
  'details:not([open]) > div',
];
const html = await readFile(process.argv[2] ?? 'dist/index.html', 'utf8');
let cleaner = new HTMLRewriter();
for (const selector of excluded) cleaner = cleaner.on(selector, { element(element) { element.remove(); } });
const visible = await cleaner.transform(new Response(html)).text();
const sections = selectors.map(selector => ({ selector, count: 0, text: '' }));
let extractor = new HTMLRewriter();
for (const section of sections) extractor = extractor.on(section.selector, {
  element() { section.count++; },
  text(chunk) { section.text += chunk.text + (chunk.lastInTextNode ? ' ' : ''); },
});
await extractor.transform(new Response(visible)).text();

let failures = 0;
let passageCount = 0;
for (const [index, section] of sections.entries()) {
  const canonical = source.sections[index];
  let expected = canonical.text.map(([node, text]) => ({ node, text: normalize(text) }));
  const errors: string[] = [];
  // The newsletter field is restored as a visual prototype (owner polish brief, 5 Oct 2026).
  // Its Figma placeholder TEXT node is an input attribute on the website, checked below.
  if (section.selector === '.site-footer') {
    expected = expected.filter(({ text }) => text !== 'you@example.com');
    if (!/<input[^>]*id="newsletter-email"[^>]*placeholder="you@example\.com"/.test(html)) errors.push('Missing or changed newsletter placeholder: you@example.com');
  }
  let remaining = ` ${normalize(section.text)} `;
  if (section.count !== 1) errors.push(`Expected one section; found ${section.count}.`);
  // Match complete phrases with occurrence counts. Longer phrases first prevent
  // labels such as "REP" from consuming a word inside another approved passage.
  // DOM order may differ for accessible tablists; word order within copy may not.
  for (const { node, text } of expected.sort((a, b) => b.text.length - a.text.length)) {
    const phrase = ` ${text} `;
    if (!remaining.includes(phrase)) errors.push(`Missing or changed ${node}: ${text}`);
    else remaining = remaining.replace(phrase, ' ');
  }
  if (remaining.trim()) errors.push(`Unexpected copy: ${remaining.trim()}`);
  passageCount += expected.length;
  if (errors.length) {
    failures += errors.length;
    console.error(`${canonical.name} (${canonical.id})\n${errors.map(error => `  ${error}`).join('\n')}`);
  }
}
if (failures) process.exitCode = 1;
else console.log(`Homepage copy: ${passageCount} visible text passages across all ${sections.length} sections match the copy source, including the restored newsletter field; no extra copy.`);
