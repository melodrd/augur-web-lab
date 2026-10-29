# Prompt: arrival and scroll motion for the homepage review copies

Paste everything below the line into a fresh Claude Code session in this project, or say: “Read `docs/scroll-motion-prompt.md` and do it.”

---

Give the homepage review copies (`/ryan/`, `/ryan-augus/` and `/melo/`, which share the v2 UI) a considered arrival and scroll choreography. The hero assembles when the page opens. Each section settles into place as the reader reaches it, in the order it should be read.
- Follow `AGENTS.md`, `docs/plan.md` (**Rules every chat follows**, **Section review**) and `docs/motion.md`.
- Where this brief and those differ, this brief wins only where it says so.

**Setup**
- **Repo:** `C:\Users\edu45\Documents\augur-web-lab` (`main`). Dev server “augur-dev” on :4321 (`.claude/launch.json`), or “augur-dev-alt” on :4322 if another chat holds it.
- **Check every script in the build preview** (“augur-build-preview”, :4330). The review copies' scripts are inline strings hashed into each page's Content-Security-Policy (`src/components/home/review-inline.ts`), and that policy only exists in built pages. A script that works on :4321 can be silently blocked in the build.
- **Before:** https://augur-web-lab.vercel.app/melo/ is what's deployed. Before you change anything, scroll it top to bottom at 1440 × 900 and at 390 × 844, once in a fresh tab and once after F5.
- **Time:** there's no deadline. Take what great work needs. The research is already done (section 4), so spend the time on the page itself: try options, look at them at real speed, and cut what doesn't earn its place.

**How to work**
- Decide and build. Don't stop to ask about routine motion choices. Don't redo the research.
- When something in this brief conflicts with UX sense or with the research, say so in one line, name the principle and go with the better option.
- Don't commit, push or deploy.

## 1. The job

Today the hero arrives with motion and a few sections play their own scenes. Everything else is just there: headings, leads, cards, closers and links sit still as you scroll, so nothing marks where a section starts or what to read first.

After this pass:
- **On arrival:** the hero reads in one beat: the headline, the “decentralized” emphasis, the support line, then the actions. It's readable within about half a second and settled within about one.
- **On scroll:** each section settles in as it enters the screen. The heading comes first, then the lead, then the section's main block, then its foot. The eye is led through the section in reading order.
- **Second time round** (F5, back, or a return visit in the same tab session): everything is simply there.

Motion here has three jobs and no others:
- It **orients**: a new section has started.
- It **directs attention**: read this first, then this.
- It **shows continuity**: the How it works path leads to “Get paid”.

It is never decoration, and it never makes anyone wait to read.

## 2. The owner's ask, and where it stops

The owner's request (29 Oct 2026), in short:
- the hero text should appear with animation when the page opens
- the emphasis on “decentralized” should appear only one time
- content should appear little by little while scrolling
- motion may help make sure readers take in every part, for example in “Know what happened? Get paid to report it.”

How to read it:
- **“Little by little”** means one short settle per section, in reading order. It doesn't mean every element on its own, or text appearing word by word.
- **“Make sure the user reads all parts”** means guide, don't gate. Motion can lead the eye and give each part a beat. It can't make anyone read. Anything that holds text back, slows scrolling or makes the reader wait for the next part is out (`AGENTS.md`: never hide content behind animation). Section 6 has the allowed tools.
- **“Decentralized, only one time”:** the underline already draws once per load and retracts. Keep it to one sweep: never a loop, and never replayed by scrolling back up to the hero. The owner's 6 Oct rule that it also plays after F5 stands.

**Freedom, with balance (owner, 29 Oct 2026):**
- The current motion isn't sacred; the owner thinks it “sort of sucks”. You may redesign, retime, simplify, chain, merge or cut any existing animation on the review copies.
- What the owner wants is equilibrium, not more motion: “don't make this too weird like a bunch of animations”.
- **Rules for that balance:**
  - At most one thing draws the eye at a time on any screen. A reveal and a loop don't start together.
  - Cut before you add. If the page has more moving parts after this pass than before, justify each new one in the report.
  - Every section gets one entrance. Loops stay calm and secondary: slower, smaller and lower contrast than the entrance.
- **The loops** the owner asked for by name keep looping. They can be made calmer or simpler. That's the Why Augur diagrams (“alive”, 5–6 Oct) and the use-case cards (“all animations should be going in a loop”, 28 Oct). Stop one only if you name why, in the report.
- When you change an owner rule, update `AGENTS.md` and `docs/motion.md` in the same pass, citing this note.

## 3. What already moves (yours to change)

All three review copies share this. Confirm each row against the built page, because `docs/motion.md` may lag.

| Where | What moves now | Rule |
| --- | --- | --- |
| Hero (`Hero.astro`, `src/motion/hero-arrival.js`, `heroTimeline` and `heroTimeline.v2`) | Three headline lines rise 16 px and fade in (0 → 900 ms), then the support line (400 → 900) and the actions (650 → 950). The “decentralized” underline draws 450 → 1020 and retracts 1900 → 2400. The lituus flock fades in 500 → 2100. The scroll cue starts at 2400. From 1024 px there's the live canvas floor. | Arrival once per tab session. Underline on every load. Flock and floor loop. |
| Header (`header-v2.js`) | Hides on scroll down and comes back on scroll up. | Ongoing |
| Why Augur (`Tenets.astro`, `tenets-iso-v2.js`, `home-art.ts`) | The isometric scenes loop while visible. The answer band's ribbon sweeps at 60% in view (`ribbonTimeline`). | Loop. Ribbon on every load. |
| What can Augur Lituus power? (`Applications.astro`, `use-cases-v2.js`) | The card loops on the 12 s cycle while on screen. | Loop |
| Know what happened? (`HowItWorks.astro`, `how-path-v2.js`, `howPathTimeline`) | The path entrance at 50% in view, the “paid” underline, and a step's scene each time it's picked. | Entrance once. Pick every time. |
| Roadmap (`Roadmap.astro`, `home-interactions.ts`, `roadmapTimeline`) | The track draws, the stops pop 110 ms apart, and Now pulses. | Once. The pulse loops. |
| Learn more (`LearnMore.astro`) | Opening transitions only. | On interaction |
| Footer (`SiteFooter.astro`) | Nothing | |

**The gap** is everything outside those scenes:
- the `.section-heading` row (`h2` and `.lead`) in every section
- the cards and closers around the scenes
- Learn more's doors
- the footer

This pass adds a calm entrance to those and rebalances the rest: retime, chain or cut what competes.

## 4. Research (done; use it, don't redo it)

Gathered on 29 Oct 2026. Use it as given. Only open a source if a decision hangs on it.

**Baseline (29 Oct 2026)**
- **Timing (NN/g):**
  - Most UI motion runs 100–400 ms. Above about 500 ms it starts to feel like a drag.
  - Entrances can run a little longer than exits.
  - Use ease-out (decelerate), never linear.
  - The more often people see an animation, the shorter and subtler it should be.
  - Source: “Executing UX Animations: Duration and Motion Characteristics”, https://www.nngroup.com/articles/animation-duration/
- **Attention (NN/g):**
  - A slide pulls the eye harder than a fade in place.
  - Motion the reader didn't trigger, on load or on scroll, should be gentle, with little change of position.
  - Repeats annoy, often by the third time.
  - Several animations at once compete with each other.
  - Sources: https://www.nngroup.com/articles/animation-usability/ and https://www.nngroup.com/articles/animation-purpose-ux/
- **Scroll effects (NN/g):**
  - Fast scrollers skip animated content.
  - Leave elements in their final state rather than replaying them.
  - Short, purposeful reveals below the fold tested fine.
  - Text chunks that appear and disappear strain memory.
  - Sources: https://www.nngroup.com/articles/parallax-usability/ and https://www.nngroup.com/articles/scrolljacking-101/
- **The critique to design against:**
  - David Bushell calls the generic “1 s fade, 100 px rise on scroll” tacky.
  - It only looks right at a slow, steady scroll, and it hurts LCP.
  - It isn't a quick win to bolt on at the end.
  - Source: https://dbushell.com/2026/01/09/death-to-scroll-fade/
- **WCAG 2.2:**
  - 2.3.3 Animation from Interactions: motion added to scrolling must be possible to turn off. `prefers-reduced-motion` is the technique (C39).
  - 2.2.2 Pause, Stop, Hide (Level A): moving content that starts automatically, sits beside other content and lasts more than 5 s needs a pause, stop or hide control. Scrolling an element into view counts as starting automatically.
  - Short reveals pass. The page's 12 s loops are another matter: see section 12.
  - Sources: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html and https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- **Reduced motion:**
  - Remove non-essential motion entirely. A short opacity dissolve is the most it may keep.
  - Listen for `change` and settle running Web Animations.
  - Source: https://web.dev/articles/prefers-reduced-motion
- **LCP:**
  - Chrome ignores elements at opacity 0 as LCP candidates. An element counts once it's rendered and visible, and a transform alone doesn't create a new candidate.
  - So a headline that fades in from 0 delays LCP, while one that's visible from the first paint and only moves doesn't.
  - Shopify's theme guidance: never hide the LCP element behind a reveal. If the hero must animate, use CSS `@keyframes` under about 300 ms, not a JavaScript-gated reveal.
  - Sources: https://web.dev/articles/lcp, https://chromium.googlesource.com/chromium/src/+/main/docs/speed/metrics_changelog/lcp.md and https://shopify.dev/docs/storefronts/themes/best-practices/performance/dont-hide-lcp-image-behind-animations
- **CLS:**
  - Composited transform animations don't count toward CLS.
  - Animating top or left drops frames.
  - Sources: https://web.dev/articles/optimize-cls and https://web.dev/articles/animations-guide
- **Scroll-driven CSS:**
  - `animation-timeline: view()` is in Chrome and Edge, Safari 26, and Firefox from late October 2026 (MDN's compatibility data). Older Firefox, ESR included, lacks it.
  - It scrubs with the scroll, so it plays backwards on the way up.
  - Scroll-triggered `animation-trigger` (with a play-once option) is Chromium-only, and Chrome's own demo falls back to IntersectionObserver.
  - Use IntersectionObserver with the Web Animations API for one-shot reveals.
  - Sources: https://developer.chrome.com/docs/css-ui/scroll-driven-animations and https://developer.chrome.com/blog/scroll-triggered-animations
- **IntersectionObserver:**
  - The callback fires straight away for targets already on screen.
  - A target taller than the viewport can never reach a high threshold, so use threshold 0 with a negative bottom `rootMargin`.
  - Source: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- **Scrollytelling:**
  - Mike Bostock: prefer motion tied to the reader's own scroll, let the reader interrupt anything time-based, never make readers sit through animation, and design for skimming. https://bost.ocks.org/mike/scroll/
  - The Pudding: keep scrolly parts short with few steps, use transitions only where they carry meaning, and remember that a pace that's fine on desktop tires people on phones. https://pudding.cool/process/responsive-scrollytelling/
  - Cueing the active step helps attention. Dimming the inactive steps can break contrast, so mark the active step with an indicator instead.
- **Real sites (top of page only, checked in a throttled pane):**
  - Stripe's and Vercel's headlines are static. Their motion lives in art and carousels.
  - Linear's headline ships at opacity 0 with blur and waits for JavaScript. In the throttled pane it stayed invisible: the failure mode to avoid.
  - Vercel's Web Interface Guidelines: respect reduced motion; prefer CSS, then the Web Animations API, then libraries; keep motion interruptible; anything over 5 s needs a pause. https://vercel.com/design/guidelines
  - Rauno Freiberg: repeated actions get little or no motion. https://rauno.me/craft/interaction-design
- **Unverified:**
  - find-in-page, anchor-jump and print behaviour of armed content
  - stagger values (only secondary design-system notes: 20–80 ms per item, about 5 items at most)
  - the exact Chrome version for scroll-triggered animations

## 5. Direction: one reveal system

**The pattern is “settle in”:** opacity 0 → 1 with a short rise, played once when the group reaches the screen.
- **Rise:** 12 px for the heading, 8 px for everything else. No sideways travel, no scale, no blur, no rotation, no overshoot on text.
- **Duration:** about 400 ms for the heading and `timing.panel` (320 ms) for the rest.
  - Use a decelerating curve: `easing.settle`, which How it works' rows already use, or `easing.reveal`.
  - Stay within 250 to 500 ms (NN/g).
- **Stagger:**
  - 80 ms between groups (heading, lead, main block, foot), and 60 ms between the items in a row of cards.
  - Never stagger every element.
  - At most four groups and five items. Anything later arrives with the last one.
- **Budget:** each section is settled within about 700 ms of its trigger.
- **Trigger:**
  - Use an `IntersectionObserver` with threshold 0 and `rootMargin: 0px 0px -10% 0px`, unobserving each group once it fires.
  - The group starts as its top passes about 90% of the viewport height, so the reader sees it happen and never scrolls onto a blank block.
  - Tall groups still fire.
- **Once per tab session**, through `seen.ts`'s rules: never on F5 or a back/forward visit (read the navigation type), and never twice on a return visit. The review copies run inline scripts, so mirror `seen.ts` inline the way `applications-folder-v2.js` already does, under the same storage key. Don't import it.
- **One code path:** a single small script (for example `reveal-v2.js`), registered in `review-inline.ts` and rendered once per page. Put its timings in `src/motion/timelines.ts` as one `revealTimeline` entry, and write it into the script the way `useCases` and `howPath` are. Use the Web Animations API with `fill: 'backwards'` and cancel each animation when it finishes, as `playOnce` does, so settling is just `finish()`.
- **Markup hook:** `data-reveal` on the groups, plus an order number only where the visual order differs from the DOM order.

**What arrives in what order, in every section:**
1. the heading (`h2`)
2. the lead (`.lead`)
3. the section's main block: the card grid, the stage or the doors. In a row of cards, go left to right in reading order.
4. the foot: the closer, a link row or the holder bar

**Never hidden, whatever happens:**
- **Without JavaScript,** with reduced motion, in print and in forced colours, everything is visible and nothing is armed. The armed state lives under one attribute that the script sets; it is never in the HTML or in CSS alone. If the script fails after arming, it removes that attribute. Add an `@media print` rule that forces the final state as well, so armed groups print.
- **Arm only what's below the fold** when the script runs. A group already on screen, whether from a hash link, a restored scroll position or a tall screen, never animates.
- **Fast scroll:** a group that's already above the viewport when it's observed shows at once. When several groups enter in one frame (the End key, an anchor jump, find-in-page), they show together with no stagger, or instantly.
- **Settle on intent:** keyboard focus moving into an armed group, a `hashchange`, `beforeprint`, `pagehide` and a switch to reduced motion all settle everything at once.
- **Opacity only hides visually.** Screen readers and find-in-page still reach the text. When find-in-page scrolls to armed text, the reveal plays as it enters (about 400 ms). That's acceptable; check it.
- **No layout shift:** transform and opacity only, with space reserved from the first paint. CLS stays at its baseline.

**Don't double-animate:**
- A block with its own scene gets one entrance, not two. That's the answer ribbon, the iso scenes, the use-case card, the How it works path, and the roadmap track and stops.
  - Either keep the scene's entrance and let the reveal move only the heading row above it, or replace the scene's entrance with the reveal. Pick whichever reads calmer.
- Where a scene sits inside a revealed group, put the reveal on a wrapper, never on an element that already has a transform track. In Chromium a second animation of the same property on an element pushes a loop onto the main thread (`docs/motion.md`, Permissionless). Measure with `RecalcStyleCount`.
- Chain, don't overlap: a section's own entrance starts as its heading row settles. For example, How it works' path starts after its lead, not on its own 50% trigger, and the roadmap track starts after its lead. One choreography per section.
- The loops (iso scenes, use-case card) keep running from their resting frame. A reveal on their wrapper only fades it in.

**CSS scroll-driven animations** (`animation-timeline: view()`): don't use them for the one-shot reveals. They scrub with the scroll, play backwards on the way up and replay after F5, which breaks the once-per-session rule. They're only a candidate for the reading guide in section 6.

## 6. The reading guide (“make sure they read every part”)

The aim: a reader who scrolls at normal speed meets every part of a section, in order, and the section's point lands. The tools, in the order to reach for them:
1. **Reading order** (section 5): heading, then lead, then content. Chunking and the serial-position effect do most of the work.
2. **How it works: the path is the guide.** As its entrance plays, the line runs stop to stop (Ask → Report → Challenge → Get paid) and each stop lights as the line reaches it, ending on “Get paid” and the “paid” underline on the same beat. That's the goal-gradient effect and the peak–end rule. Tighten what `how-path-v2.js` already does so it reads as one walk, chained after the lead. Keep it under 2.4 s.
3. **Optional, evaluate then decide:** a scroll-linked fill on that path's rail, with `animation-timeline: view()` as progressive enhancement. It would be `scaleX` on one fill element. Text is never touched. Without support, under reduced motion and in print, it shows the full rail. Build it only if it clearly helps a reader follow the steps, not just that it looks nice. If you build it, it's a new exception to “scenes play once”: record it in `AGENTS.md`'s motion paragraph and `docs/motion.md` with the owner's 29 Oct ask as the reason.

**Out, whatever the research says:**
- scroll hijacking, pinned or sticky scrollytelling, snap, and smooth-scroll scripts (native scroll only, owner, 19 Oct 2026)
- text held back until the reader has scrolled or waited “enough”
- picking or advancing How it works' steps by scroll or hover (steps are picked by press or key, never hover, and never by scroll)
- read-progress gates, “3 of 6 read” counters and anything that feels like homework
- dimming or blurring text that isn't “active” yet

## 7. The hero, on arrival

- Audit `heroTimeline` and `heroTimeline.v2` against the research. The first headline line should be readable by about 300 ms. The actions should be usable by about 950 ms; they're disabled only while fully transparent.
- **The “decentralized” emphasis:** one sweep, timed so it lands as the word settles and retracts before the scroll cue. It never loops and never replays on scrolling back. The 6 Oct every-load rule stands, and hover keeps redrawing it on fine pointers.
- **LCP:** the headline is likely the page's Largest Contentful Paint element, and today its lines fade in from opacity 0, which Chrome doesn't count until they're visible. Measure LCP on the baseline first.
  - If the headline is the LCP element and the fade delays it, apply the research's LCP-safe pattern:
    - The headline is visible from the first paint and only rises, 8 px or less, under 300 ms, in CSS `@keyframes`.
    - The support line, the actions, the underline and the flock may still fade.
  - This keeps the owner's “the hero text appears with animation” and costs nothing in LCP.
  - Scope it to the review copies (`heroTimeline.v2` and rules under `.home-v2`), because `/` stays byte-identical.
- Don't add hero motion. The flock, the floor, the lens, the underline and the scroll cue are already a lot. Rebalance them if they compete with the headline. For example, the flock could fade in after the text has landed, not alongside it.
- The hero is not part of the scroll reveal. It has its own arrival.

## 8. Section by section

Every section uses `.section-heading` (an `h2` and `.lead`), which is the shared hook.
- **Why Augur** (`Tenets.astro`): the heading row, then the three tenet cards left to right (on wrappers; the iso scenes keep looping), then the closer. The answer band keeps its own ribbon and gets no generic reveal.
- **What can Augur Lituus power?** (`Applications.astro`): the heading row, then the picker and the card stage as one group. The loop starts from rest as it does now.
- **Know what happened? Get paid to report it.** (`HowItWorks.astro`): the heading row, then the path walk from section 6, then the holder bar. Step scenes on pick are unchanged.
- **Roadmap** (`Roadmap.astro`): the heading row, then the existing track draw and stops, chained.
- **Learn more** (`LearnMore.astro`): the heading row, then the doors left to right, then the foot.
- **Footer** (`SiteFooter.astro`): one group fades in, with no stagger. Leave the logo animation idea (`docs/plan.md`, item 7) alone; it's still flagged.

Ryan's copy (`/ryan/`) adds the “?” tips and hero links (`home-v3.css`). Check that they ride along with their section and never animate on their own.

## 9. Subagents

Three agents, each launched in the background so you never wait on them. You're the only writer. They report; they don't edit.

- **Baseline (at the start, while you look at the page):**
  - Build, then measure `/melo/` before any change in headless Edge over CDP, at 1440 × 900.
  - Record LCP, CLS, and `RecalcStyleCount` during a scripted 5 s scroll from top to bottom.
  - Save the numbers to the scratchpad.
- **QA (after the build):**
  - The same numbers again.
  - A keyframe strip per section at 0, 200 and 600 ms after its trigger, at 1440 and 390.
  - These edge cases: End key from the top, a hash link to `#how-it-works`, F5 halfway down, reduced motion, print emulation and no JavaScript.
  - Pass means nothing is ever invisible once on screen, LCP is within 100 ms of baseline, CLS is unchanged, and there's no ongoing style work once a section has settled. No console errors or CSP violations in the build preview.
- **Cold read (after QA):**
  - A fresh agent gets only the keyframe strips: no code and no brief.
  - Per section, it answers: what did your eye go to first, second and third? Did anything feel slow, busy, gimmicky or hard to read? Did you ever have to wait to read?
  - If it reports waiting or gimmickry, cut, then run it again.

**Notes for the agents:**
- Playwright doesn't start on this machine. Use headless Edge over CDP with a Bun WebSocket.
- A hidden Browser pane stops `requestAnimationFrame`, scroll events and transitions, so don't trust timing measured there.

## 10. Build order

1. **The reveal system,** section by section (sections 5 and 8), including the arming and settling rules.
2. **Rebalance:** cut, retime or chain the existing motion that competes with it (section 2's balance rules).
3. **The How it works walk** (section 6, step 2).
4. **The hero** (section 7).
5. **Optional:** the scroll-linked rail (section 6, step 3), only if it earns its place.

## 11. Rules (from `AGENTS.md`, restated)

- Transform and opacity only, plus SVG stroke draws. No animation library (GSAP, AOS, Motion One, Lenis and the like), no client framework and no hydration directives.
- Timings and easings come from `src/motion/timelines.ts` and the tokens in `docs/motion.md`. No ad-hoc values.
- No-JavaScript, reduced motion and print show the final frame. Pause anything ongoing when it's off-screen or the tab is hidden.
- Native scroll only.
- `/` stays byte-identical: put nothing in `index.astro`'s processed script or in v1's markup. The dist diff should show only the three review copies' pages changed.
- Never hand-edit `vendor/augur/**`, `scripts/design-system.ts`, `src/components/ui/*`, `src/lib/utils.ts`, `src/styles/augur.css` or `src/styles/augur-typography.css`.
- Don't change copy or layout. Motion only.
- **Figma:** add one pending entry to `docs/figma-workflow.md` for the reveal choreography. Don't touch Figma itself.
- **Docs:** add a “Section reveal” entry to `docs/motion.md` (trigger, order, values, settle rules, measured cost) and update the hero rows if they change. Record the reasons in the report. There's no decisions log, so don't create one.

## 12. Done means

- **Numbers, before and after** at 1440 × 900: LCP, CLS and scroll `RecalcStyleCount`.
- **The count of moving parts** on the page, before and after.
- **Keyframe strips** per section, and the hero's arrival at 0, 300, 600 and 1000 ms.
- **Edge cases:** each one in the QA list, marked pass or fail.
- **Checks:**
  - `bun run check` and `bun run build` pass.
  - The dist diff shows only the review copies changed.
- **Honesty:** report only the checks you actually ran, and name the ones you couldn't run.
- **Flag, don't build:** WCAG 2.2.2 (Level A) asks for a pause, stop or hide control on motion that starts by itself and runs more than 5 s. The iso scenes, the use-case card and the hero flock loop on 12 s cycles. Say whether the page meets 2.2.2 today. List it as an open question for the owner, with the smallest fix you'd suggest (for example, one page-level “Pause motion” control). Building it is out of scope.
- **Report in this order:**
  1. the keyframe strips and numbers
  2. what changed, section by section, including what you cut
  3. anything you declined from this brief, and why
  4. open questions, only if they're real

## 13. Don't

- Animate every element, split text into words or letters, or reveal a paragraph line by line. The answer ribbon is the one existing exception.
- Slide anything in from the side, scale it up from zero, blur it in, add parallax or bounce text.
- Replay a reveal on scroll up, or reverse it when a section leaves the screen.
- Put a reveal on anything the reader is already looking at, on a control under the pointer, or on the hero.
- Delay the hero's text or actions to make room for an effect.
- Hold the next section back until the last one has been “read”.
- Add a glow (only the Peer mesh glows), a shadow or a new colour.
- Bring back a section-settle or smooth-scroll script.
