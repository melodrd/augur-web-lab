// Every inline <style> and <script> the homepage versions render (owner, 21 Oct 2026), and Melo's chrome, which
// every other page renders too (26 Oct 2026). They are imported as strings (?inline is processed and minified
// CSS, ?raw is the file as written) and rendered is:inline; [...version].astro hashes each one into its own page's
// CSP. (They began as strings so that the review copies left the old "/" byte-identical.)
import type {ReviewVariant} from '../../data/homepage-review';
import switchScript from './version-switch.js?raw';
import switchStyle from './version-switch.css?inline';
import v2Style from '../../styles/home-v2.css?inline';
import v2OnlyStyle from '../../styles/home-v2-only.css?inline';
import v3Style from '../../styles/home-v3.css?inline';
import chromeStyle from '../../styles/chrome-v2.css?inline';
import tipsScript from './tenet-tips-v3.js?raw';
import headerScript from './header-v2.js?raw';
import tenetsIsoScript from './tenets-iso-v2.js?raw';
import flockScript from './hero-flock-v2.js?raw';
import videoScript from './hero-video-v2.js?raw';
import floorScript from './hero-floor-v2.js?raw';
import useCasesScript from './use-cases-v2.js?raw';
import howPathScript from './how-path-v2.js?raw';
import roadmapScript from './roadmap-v2.js?raw';
import ribbonScript from './ribbon-v2.js?raw';
import revealScript from './reveal-v2.js?raw';
import {flockMotion} from '../../data/hero-flock';
import {isoTracks} from '../../data/tenets-iso';
import {howActs} from '../../data/how-scenes';
import {easing,timing,useCaseTimeline,howPathTimeline,roadmapTimeline,ribbonTimeline,revealTimeline} from '../../motion/timelines';
// Comment lines and indentation are dropped; the line breaks stay, so the script parses as written.
const compact = (js: string) => js.replace(/^\s*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '').trim();
export const switchInline = { style: switchStyle, script: compact(switchScript) };
// Melo's chrome (owner, 26 Oct 2026: on every page): the header and footer rules (chrome-v2.css) and
// `header`, which hides the header on the way down and brings it back on the way up (SiteHeader.astro
// renders it after the header). The homepage versions list both below; PageLayout renders the sheet and hashes
// both on every other page.
export const chromeInline = { style: chromeStyle, header: compact(headerScript) };
// Per version: its stylesheets in order, and every script its page renders (for the page's CSP).
// The sheets render before the announcement bar, so their rules follow the page's own and win ties.
// Every version loads the review UI (owner, 26 Oct 2026: every version shares v2's motion and structure):
// home-v2.css, then home-v2-only.css (the owner's design: scenes, cards, steps), then the chrome sheet, and
// the scripts below. Only Ryan's version (v3) adds a sheet, last, for his hero links and "?" tips, the UI
// he asked for (every rule under .home-v3, the class pageClass() adds). The other versions set their
// words in v2's layouts unchanged. A script only one version renders goes in that version's `scripts` as well, so its page
// hashes it. `header` is the chrome's (above); `tenets` plays the isometric Why Augur scenes, with every scene's
// keyframes from tenets-iso.ts written in (Tenets.astro renders it after the section); `flock` plays the
// hero's lituus flock, with the keys from hero-flock.ts written in (Hero.astro renders it after the hero);
// `floor` draws the hero's live floor and `video` plays its generated loop, from 1024 px (Hero.astro
// renders the one its `layer` picks after the flock's); `useCases` plays the use cases' product cards,
// with the timings from timelines.ts written in (Applications.astro renders it after the section);
// `howPath` adds hover to How it works' four steps and plays its stage and its entrance ("paid", then the scene), with how-scenes.ts's
// acts written in, and opens its example (HowItWorks.astro renders it after the section);
// `roadmap` runs the roadmap's picker motion and plays its track's entrance (Roadmap.astro renders it after the
// section); `ribbon` sweeps the Why Augur answer band once its lead has landed, with ribbonTimeline written in
// (Tenets.astro renders it after the section); `reveal` settles each section in as the reader reaches it, with
// revealTimeline written in ([...version].astro renders it once, after the footer, through PageLayout's "end" slot).
// Ryan's `tips` adds hover and focus to the Why Augur "?" toggletips (Tenets.astro renders it after the
// section). The components embed the shared scripts as reviewInline.v2's strings, which are the same
// strings every version lists, so each page's hashes match.
type Inline = { styles: string[]; scripts: Record<string, string> };
const ui = { styles: [v2Style, v2OnlyStyle, chromeInline.style], scripts: { header: chromeInline.header, tenets: compact(tenetsIsoScript).replace('__SCENES__', JSON.stringify(isoTracks)), flock: compact(flockScript).replace('__FLOCK__', JSON.stringify(flockMotion)), video: compact(videoScript), floor: compact(floorScript), useCases: compact(useCasesScript).replace('__USE_CASES__', JSON.stringify({ easing, timeline: useCaseTimeline })), howPath: compact(howPathScript).replace('__HOW_PATH__', JSON.stringify({ easing, timeline: howPathTimeline, ready: revealTimeline.ready, dwell: revealTimeline.dwell, acts: howActs })), roadmap: compact(roadmapScript).replace('__ROADMAP__', JSON.stringify({ easing, timeline: roadmapTimeline, fadeOut: timing.fadeOut, ready: revealTimeline.ready, dwell: revealTimeline.dwell })), ribbon: compact(ribbonScript).replace('__RIBBON__', JSON.stringify({ easing, timeline: ribbonTimeline })), reveal: compact(revealScript).replace('__REVEAL__', JSON.stringify({ easing, timeline: revealTimeline, duration: timing.panel })) } };
export const reviewInline: Record<ReviewVariant, Inline> = {
  v2: { styles: ui.styles.filter(Boolean), scripts: ui.scripts },
  v3: { styles: [...ui.styles, v3Style].filter(Boolean), scripts: { ...ui.scripts, tips: compact(tipsScript) } },
  v4: { styles: ui.styles.filter(Boolean), scripts: ui.scripts },
};
