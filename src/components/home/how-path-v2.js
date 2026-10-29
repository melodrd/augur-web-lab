// /2/ only (owner, 25 Oct 2026, item 4: "build A on /2", sketch A of the item 4 board): How it works' four steps over
// one stage, and "Walk through an example" (HowItWorks.astro renders this right after the section, so it runs while
// the page parses). The steps are the shared tabs controller's (tabs.ts: press, arrows, Home/End, automatic
// activation); this adds the stage's swap, each scene's act and the section's entrance ("paid", then the scene). The markup is the
// rest state: without JavaScript, or if the CSP blocked this, the first step shows with its scene drawn, the example
// stays open and the button stays hidden; reduced motion and print show the same. Timings and easings come from
// timelines.ts (howPathTimeline, easing, revealTimeline.ready) and each scene's act from how-scenes.ts (howActs),
// written in at build time (review-inline.ts). Transform and opacity only.
(() => {
const T = __HOW_PATH__, E = T.easing, L = T.timeline, ACTS = T.acts, html = document.documentElement;
// page-field.ts sizes its layer to the page's scrollHeight, which counts the layer itself, so the layer can
// grow but never shrink. Opening or closing the example changes the page's height, so when the content
// changes height the layer drops to it first.
new ResizeObserver(() => { const field = document.querySelector('[data-page-field]'); if (!field) return; field.style.height = '0'; field.style.height = html.scrollHeight + 'px'; }).observe(document.body);
const section = document.getElementById('how-it-works');
if (!section) return;
const root = section.querySelector('[data-how-path]'), toggle = section.querySelector('[data-how-more]'), example = document.getElementById('how-example');
const reduced = matchMedia('(prefers-reduced-motion: reduce)'), animates = typeof Element.prototype.animate === 'function';
// The example. Closed, it is hidden="until-found", so find in page can still open it (plainly hidden where
// that isn't supported); aria-expanded follows, and the button's words say what a press does next. Opening
// moves what follows down at once (no height animation) while the story's sentences rise in, `stagger` apart,
// in the order they happened. Closing is instant, and focus stays on the button.
if (toggle && example) {
let rows = [];
const still = () => { rows.forEach(a => a.cancel()); rows = []; };
const set = open => { example.hidden = !open && 'until-found'; toggle.setAttribute('aria-expanded', String(open)); };
const enter = () => {
if (reduced.matches || !animates) return;
example.querySelectorAll('[data-example-row]').forEach((row, i) => rows.push(row.animate([{ opacity: 0, transform: `translateY(${L.rise}px)` }, { opacity: 1, transform: 'none' }], { duration: L.row, delay: i * L.stagger, easing: E.settle, fill: 'backwards' })));
};
toggle.addEventListener('click', () => { const open = !!example.hidden; still(); set(open); if (open) enter(); });
example.addEventListener('beforematch', () => toggle.setAttribute('aria-expanded', 'true'));
set(false);
toggle.hidden = false;
}
if (!root) return;
// A step is picked only by a press or a key, never by hover (owner, 26 Oct 2026).
const tabs = [...root.querySelectorAll('[role="tab"]')], panels = [...root.querySelectorAll('[role="tabpanel"]')], stage = root.querySelector('.how-path-stage');
const rails = tabs.map(tab => tab.querySelector('[data-how-rail]')), squares = tabs.map(tab => tab.querySelector('.how-path-index'));
if (!animates || !('IntersectionObserver' in window)) return;
// The entrance follows seen.ts: a reload or a history visit skips it, and a fresh visit records it once it starts.
const STORE = 'augur:motion-seen', nav = performance.getEntriesByType?.('navigation')[0];
const revisit = nav?.type === 'reload' || nav?.type === 'back_forward';
const key = name => `${location.pathname}:how-path:${name}`;
const read = () => { try { return JSON.parse(sessionStorage.getItem(STORE) ?? '[]'); } catch { return []; } };
const seen = name => revisit || read().includes(key(name));
const mark = name => { try { const keys = read(); if (!keys.includes(key(name))) sessionStorage.setItem(STORE, JSON.stringify([...keys, key(name)])); } catch { /* Storage blocked: it may play again. */ } };
const step = i => panels[i]?.dataset.howStep;
let motion = [], open = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
const go = (el, frames, delay, duration, easing = E.settle, fill = 'backwards') => { if (el) motion.push(el.animate(frames, { delay, duration, easing, fill })); };
const settle = () => { motion.forEach(a => a.cancel()); motion = []; };
// One step's act, from `at`: how-scenes.ts's tracks for that step, each [part, delay, duration, keyframes] from the
// state before it, eased per keyframe. The scene's markup is the state after it, so a settled act leaves it as drawn.
// Ask: the answers' signs light in turn and the reward lands on the sled. Report: their block lands on Yes and the
// reward rides over to it while the clock runs. Challenge: your two blocks land on No, the hand goes back to twelve
// and the reward rides over. Get paid: the clock runs out, a fifth of their block burns, the rest flies onto yours
// and the reward jumps on top.
const act = (i, at) => {
(ACTS[step(i)] || []).forEach(([name, delay, duration, frames]) => go(panels[i]?.querySelector(`[data-how-part="${name}"]`), frames, at + delay, duration, 'linear'));
};
// The entrance, once per tab session, in the section's reading order (scroll-motion brief, 29 Oct 2026), one thing at
// a time: "paid" in the heading draws as the lead lands (the section reveal, reveal-v2.js), while the heading is on
// screen; then, once the stage has stayed on screen for `dwell` and "paid" is in, the shown step's scene acts. A walk
// down the steps was built first and cut the same day: in two cold reads, light passing through the steps while the
// stage stayed on Ask read as a stepper that had lost its content, or as focus moving on its own. "paid" waits undrawn
// from the first paint, so it never shows, vanishes and draws again. A pick or print before then stands in for the
// entrance, and "paid" simply shows; the stage leaving the screen, a hidden page or reduced motion settle it.
const underline = section.querySelector('.paid-mark'), heading = section.querySelector('[data-paid-heading]'), lead = section.querySelector('.section-heading .lead');
let paid = seen('paid') || reduced.matches ? 'done' : 'waiting', state = seen('entrance') || reduced.matches ? 'done' : 'waiting';
let wait, ready = false, timer = 0, inAt = 0;
if (paid === 'waiting' && underline) { wait = underline.animate([{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: L.underline }); wait.pause(); }
const show = () => { paid = 'done'; wait?.cancel(); wait = undefined; mark('paid'); };
const done = () => { show(); state = 'done'; mark('entrance'); };
// "paid" draws once the heading is in view and the lead above the steps has landed.
const draw = () => {
if (paid !== 'waiting' || document.hidden) return;
const group = lead?.closest('[data-armed]');
if (group) { group.addEventListener('revealed', draw, { once: true }); return; }
show();
go(underline, [{ transform: 'scaleX(0)' }, { transform: 'none' }], 0, L.underline, E.draw);
inAt = performance.now() + L.underline;
begin();
};
// The scene waits for the stage to stay on screen for `dwell`, so a fly-by (End, a jump) never spends it off screen,
// and for "paid" to be in.
const begin = () => {
clearTimeout(timer);
if (state !== 'waiting' || !ready || document.hidden || paid === 'waiting') return;
timer = setTimeout(() => { if (state !== 'waiting' || !ready || document.hidden) return; state = 'done'; mark('entrance'); act(open, 0); }, Math.max(T.dwell, inAt - performance.now()));
};
const observer = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting, intersectionRatio, intersectionRect, rootBounds }) => {
if (target === heading) { if (intersectionRatio >= L.threshold) draw(); return; }
ready = isIntersecting && (intersectionRatio >= T.ready || intersectionRect.height >= (rootBounds?.height ?? innerHeight) * T.ready);
if (!isIntersecting) settle();
begin();
}), { threshold: [0, .25, .5, L.threshold, .75, T.ready] });
observer.observe(stage);
if (heading && paid === 'waiting') observer.observe(heading);
// A pick swaps the stage: the shown step fades out while it still holds the shared cell (a hidden panel there is
// only invisible), then the picked one fades in and its scene acts. Every pick plays it, after a reload too
// (owner, 26 Oct 2026: changing steps "doesn't show any motion"): a pick is the reader asking for that step.
// The links between the two steps draw in order with it (a step's rail is its link down to the next step), one run
// down the timeline (owner, 29 Oct 2026: the green line going down): forward they fill top to bottom, each square
// lighting as the line reaches it, the picked one last; back they empty bottom to top and the picked square lights
// at once. Each link holds where it was until its turn, so a pick while they draw carries on from there, and the CSS
// (aria-selected) is the state after. Where a link was is read as its scale, never its matrix: an empty link's
// matrix is singular, and browsers step between singular matrices at the halfway mark instead of drawing.
let drawn = [];
root.addEventListener('tabsbeforechange', () => { drawn = rails.map(rail => { const m = rail ? getComputedStyle(rail).transform : 'none'; return m === 'none' ? 1 : new DOMMatrix(m).d; }); settle(); });
root.addEventListener('tabschange', ({ detail: { index, previous } }) => {
open = index;
if (state === 'waiting' || paid === 'waiting') done();
if (reduced.matches) return;
go(panels[previous], [{ visibility: 'visible', opacity: 1 }, { visibility: 'visible', opacity: 0 }], 0, L.out, 'linear', 'none');
go(panels[index], [{ opacity: 0 }, { opacity: 1 }], L.at, L.in, E.reveal);
const forward = index > previous, light = [{ opacity: .3, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }];
for (let k = Math.min(index, previous), last = Math.max(index, previous); k < last; k++) go(rails[k], [{ transform: `scaleY(${drawn[k]})` }, { transform: `scaleY(${forward ? 1 : 0})` }], (forward ? k - previous : previous - 1 - k) * L.railStagger, L.rail, E.draw);
if (forward) for (let k = previous + 1; k <= index; k++) go(squares[k], light, (k - 1 - previous) * L.railStagger + L.lightAt, L.light, E.newcomer);
else go(squares[index], light, 0, L.light, E.newcomer);
act(index, L.pick);
});
// A press, focus or key in the stage, a resize or print (the controller's tabssettled), a hidden page, reduced
// motion or the stage leaving the screen settles everything on the final frame.
['pointerdown', 'focusin', 'keydown'].forEach(type => stage.addEventListener(type, settle));
root.addEventListener('tabssettled', settle);
reduced.addEventListener('change', () => { if (state === 'waiting' || paid === 'waiting') done(); settle(); });
addEventListener('beforeprint', () => { if (state === 'waiting' || paid === 'waiting') done(); settle(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
addEventListener('pagehide', settle);
})();
