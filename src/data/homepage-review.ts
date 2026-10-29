/** The homepage's review versions: which versions exist, the copy each reads, and their order.
 * "/" is the live homepage and renders v1 with no props. src/pages/[version].astro renders the review
 * copies from `reviewVersions`, and the version switch lists them in this order (owner, 26 Oct 2026:
 * "Ryan", "Ryan+Augus", "Melo"; v1's frozen copy at /1/ is gone, and the old numbered paths redirect in
 * vercel.json). Since 29 Oct 2026 (owner: "Remove the Augus only version") Augus's notes live in Ryan +
 * Augus, and /augus/ redirects there:
 * - /ryan/ (v3): Ryan's 17 notes, every section rewritten from them (homepage-v3.ts).
 * - /ryan-augus/ (v4): Ryan's notes as Augus marked them, his notes 1–3 and his 18 Oct section notes,
 *   every section rewritten from them (homepage-v4.ts).
 * - /melo/ (v2): the owner's version: Ryan's notes as Augus marked them, with fact checks, wording fixes
 *   and the owner's own design (homepage-v2.ts).
 * The variant ids stay v2 to v4 (their copy files, sheets and classes keep those names); `name` is what
 * the switch shows and `version` is the path.
 * Every version shares one UI system (owner, 26 Oct 2026: "all versions should now be similar to v2 in
 * terms of animations/motions/structure. except UI changes suggested by the team"): the v2 markup,
 * home-v2.css, home-v2-only.css and v2's scripts, so the comparison is about each reviewer's notes, not
 * polish. A component branches on the family: it asks `homeCopy(variant)` and renders the review markup
 * when that returns a copy (every version but v1), v1's literal markup otherwise, so "/" stays
 * byte-identical. A field only some versions have (Ryan's hero links and "?" tips, the builder block)
 * is tested where it is read: `'field' in copy.section`. `pageClass` gives <main> its classes: every
 * version has "home-v2", and Ryan's adds "home-v3", which his sheet (home-v3.css) prefixes every rule
 * with. */
import {homeV2} from './homepage-v2';
import {homeV3} from './homepage-v3';
import {homeV4} from './homepage-v4';

export type HomeVariant = 'v1' | 'v2' | 'v3' | 'v4';
export type ReviewVariant = Exclude<HomeVariant, 'v1'>;

// One list for the route's getStaticPaths and the switch's links, in the switch's order. `blurb` is the
// switch's one line on whose notes a version shows.
export const reviewVersions = [
  { version: 'ryan', variant: 'v3', name: 'Ryan', blurb: 'Ryan’s notes, in every section' },
  { version: 'ryan-augus', variant: 'v4', name: 'Ryan + Augus', blurb: 'Ryan’s notes as Augus marked them, plus Augus’s' },
  { version: 'melo', variant: 'v2', name: 'Melo', blurb: 'Melo’s version, with the notes that fit' },
] as const;
export type ReviewVersion = (typeof reviewVersions)[number]['version'];
/** Every path that renders the homepage: "/" and each review copy, from the list above, so a version
 * added or removed there needs no second edit. BaseLayout hashes the hero's arrival script into these
 * pages' CSP; scripts/check-links.ts checks that vercel.json redirects each copy's slashless path. */
export const homePaths: readonly string[] = ['/', ...reviewVersions.map(({ version }) => `/${version}/`)];

const copies = { v1: undefined, v2: homeV2, v3: homeV3, v4: homeV4 } as const;
/** The version's copy, or undefined for v1 (which keeps its copy in the components). */
export const homeCopy = (variant: HomeVariant) => copies[variant];

const classes = { v1: undefined, v2: 'home-v2', v3: 'home-v2 home-v3', v4: 'home-v2' } as const;
/** <main>'s class: none on "/", so v1's markup is unchanged. */
export const pageClass = (variant: HomeVariant) => classes[variant];

/** The review UI: every review version since 26 Oct 2026 (it was the owner's version alone from 22 Oct).
 * It carries the owner's design on top of each version's copy; "/" keeps what ships, so it stays
 * byte-identical. Their styles are home-v2-only.css, which every review version loads (review-inline.ts):
 * - Icons, signals only: Augur's square-cut glyphs (assets/icons/augur) replace Phosphor's arrows,
 *   chevron, close, check and plus; pictograms give way to Augur's square mark or nothing; the phone
 *   menu buttons read "Menu" and "Close"; the community logos stay Phosphor.
 * - The header logo at 128 px, a brand exception (CSS only).
 * - The Products lead card as one link, its action a text label, with no button inside it.
 * - The header hides while scrolling down and comes back on any scroll up (header-v2.js).
 * - The Why Augur cards draw isometric scenes (IsoScene.astro, tenets-iso.ts and its scene modules,
 *   tenets-iso-v2.js), under the closer's two readers.
 * - The hero draws the lituus flock in place of the square field (FlockArt.astro, hero-flock.ts,
 *   hero-flock-v2.js), and from 1024 px its live floor.
 * - The use cases as product cards, How it works as four steps over one stage, and Learn more's doors
 *   where a version's copy has them. */
export const ownerVersion = (variant: HomeVariant) => variant !== 'v1';
/** Melo's chrome, its header, footer and square-cut signals (owner, 26 Oct 2026: "Bring Melo's header and
 * footer … to every inner page. Keep / as it is."): every page but the live homepage. */
export const ownerChrome = (pathname: string) => pathname !== '/';
/** The homepage version a path renders, for components without a variant prop (Icon, SiteHeader). */
export const variantAt = (pathname: string): HomeVariant => reviewVersions.find(({ version }) => pathname === `/${version}/`)?.variant ?? 'v1';
