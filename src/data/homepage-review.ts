/** The homepage's versions: which exist, the copy each reads, where each lives, and their order.
 * src/pages/[...version].astro renders every one from `reviewVersions`, and the version switch lists them
 * in this order. Since 29 Oct 2026 (owner: "remove the live homepage keep only the other three … melo is
 * the default one") Melo's version is the homepage at "/" and comes first; v1, the live homepage, and its code are
 * gone, and /melo/ and the old numbered paths redirect in vercel.json. Augus's notes live in Ryan +
 * Augus, and /augus/ redirects there (owner, 29 Oct 2026: "Remove the Augus only version"):
 * - / (v2): the owner's version: Ryan's notes as Augus marked them, with fact checks, wording fixes
 *   and the owner's own design (homepage-v2.ts).
 * - /ryan/ (v3): Ryan's 17 notes, every section rewritten from them (homepage-v3.ts).
 * - /ryan-augus/ (v4): Ryan's notes as Augus marked them, his notes 1–3 and his 18 Oct section notes,
 *   every section rewritten from them (homepage-v4.ts).
 * The variant ids stay v2 to v4 (their copy files, sheets and classes keep those names); `name` is what
 * the switch shows, `version` the route's name for it and `path` where it lives.
 * Every version shares one UI system (owner, 26 Oct 2026: "all versions should now be similar to v2 in
 * terms of animations/motions/structure. except UI changes suggested by the team"): the v2 markup,
 * home-v2.css, home-v2-only.css and v2's scripts, so the comparison is about each reviewer's notes, not
 * polish. A component asks `homeCopy(variant)` for the version's copy. A field only some versions have
 * (Ryan's hero links and "?" tips, the builder block) is tested where it is read: `'field' in
 * copy.section`. `pageClass` gives <main> its classes: every version has "home-v2", and Ryan's adds
 * "home-v3", which his sheet (home-v3.css) prefixes every rule with.
 * The UI carries the owner's design on top of each version's copy (every version since 26 Oct 2026; the
 * owner's version alone from 22 Oct). Its styles are home-v2-only.css (review-inline.ts):
 * - Icons, signals only: Augur's square-cut glyphs (assets/icons/augur) replace Phosphor's arrows,
 *   chevron, close, check and plus; pictograms give way to Augur's square mark or nothing; the phone
 *   menu buttons read "Menu" and "Close"; the community logos stay Phosphor. These and the header and
 *   footer rules below are Melo's chrome, on every page (chrome-v2.css).
 * - The header logo at 128 px, a brand exception (CSS only).
 * - The Products lead card as one link, its action a text label, with no button inside it.
 * - The header hides while scrolling down and comes back on any scroll up (header-v2.js).
 * - The Why Augur cards draw isometric scenes (IsoScene.astro, tenets-iso.ts and its scene modules,
 *   tenets-iso-v2.js), under the closer's two readers.
 * - The hero draws the lituus flock (FlockArt.astro, hero-flock.ts, hero-flock-v2.js), and from 1024 px
 *   its live floor.
 * - The use cases as product cards, How it works as four steps over one stage, and Learn more's doors. */
import {homeV2} from './homepage-v2';
import {homeV3} from './homepage-v3';
import {homeV4} from './homepage-v4';

export type ReviewVariant = 'v2' | 'v3' | 'v4';

// One list for the route's getStaticPaths and the switch's links, in the switch's order. `blurb` is the
// switch's one line on whose notes a version shows.
export const reviewVersions = [
  { version: 'melo', path: '/', variant: 'v2', name: 'Melo', blurb: 'Melo’s version, with the notes that fit' },
  { version: 'ryan', path: '/ryan/', variant: 'v3', name: 'Ryan', blurb: 'Ryan’s notes, in every section' },
  { version: 'ryan-augus', path: '/ryan-augus/', variant: 'v4', name: 'Ryan + Augus', blurb: 'Ryan’s notes as Augus marked them, plus Augus’s' },
] as const;
export type ReviewVersion = (typeof reviewVersions)[number]['version'];
/** Every path that renders the homepage, from the list above, so a version added or removed there needs
 * no second edit. BaseLayout hashes the hero's arrival script into these pages' CSP; scripts/check-links.ts
 * checks that vercel.json redirects each version's slashless name to its path. */
export const homePaths: readonly string[] = reviewVersions.map(({ path }) => path);

const copies = { v2: homeV2, v3: homeV3, v4: homeV4 } as const;
/** The version's copy. */
export const homeCopy = <V extends ReviewVariant>(variant: V) => copies[variant];

const classes = { v2: 'home-v2', v3: 'home-v2 home-v3', v4: 'home-v2' } as const;
/** <main>'s class. */
export const pageClass = (variant: ReviewVariant) => classes[variant];

/** The homepage version a path renders, or undefined off the homepage, for components without a variant
 * prop (SiteFooter). */
export const variantAt = (pathname: string): ReviewVariant | undefined => reviewVersions.find(({ path }) => pathname === path)?.variant;
