// Homepage version switch (owner, 21 Oct 2026; a list since 26 Oct 2026), inlined right after its nav on every
// homepage version.
// Each link carries the section in view, so switching lands on the same part of the other version:
// the last anchor whose top is in the top third of the screen. Only anchors that every version
// renders are listed, so a carried anchor always resolves. A block only some versions have (Ryan's links
// under the hero, the builder block) carries the nearest shared anchor above it, or none above Why Augur,
// which opens the other version at the top. Without JavaScript the links open each version at the top.
// How it works carries its heading, #how-heading, so a reader at the section (or at Holding REP?,
// further down it) lands on the section rather than on its example.
// The list closes on Escape (focus returns to the version's name) and on a press outside the switch.
// The switch stays in view at all times (owner, 22 Oct 2026). It steps aside only while a focused control
// lies under it (data-cover). Focus inside it, or its open list, always shows it (CSS).
(() => {
  const nav = document.currentScript?.previousElementSibling;
  if (!nav) return;
  const menu = nav.querySelector('[data-vs-menu]');
  const ids = ['why-augur', 'applications-heading', 'how-heading', 'roadmap', 'learn-more', 'contact-title'];
  const carry = () => {
    let id = '';
    const third = innerHeight / 3;
    for (const at of ids) {
      const el = document.getElementById(at);
      if (el && el.getBoundingClientRect().top <= third) id = at;
    }
    nav.querySelectorAll('[data-vs-link]').forEach(link => { link.hash = id; });
  };
  for (const type of ['pointerdown', 'focusin', 'click']) nav.addEventListener(type, carry);
  if (menu) {
    const close = focus => { if (!menu.open) return; menu.open = false; if (focus) menu.querySelector('summary')?.focus(); };
    nav.addEventListener('keydown', event => { if (event.key === 'Escape') close(true); });
    document.addEventListener('pointerdown', event => { if (!nav.contains(event.target)) close(false); });
  }
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; cover(); });
  }, { passive: true });
  // The switch's own corner, where it rests even while it is slid out: from 4 px above its top edge to
  // the bottom of the screen, and from 4 px left of its left edge to the right.
  const band = () => [nav.getBoundingClientRect().left - 4, innerHeight - parseFloat(getComputedStyle(nav).bottom) - nav.offsetHeight - 4];
  // A focused control in that corner sends it aside too (data-cover), where scroll padding can't lift
  // the control above it (the footer's last links at the end of the page, at 360), so no focused
  // control or its ring is ever under it (WCAG 2.4.12).
  const cover = () => {
    const el = document.activeElement, [left, top] = band(), box = el && el !== document.body && !nav.contains(el) && el.getBoundingClientRect();
    nav.toggleAttribute('data-cover', !!box && box.height < innerHeight / 2 && box.bottom > top && box.right > left && box.top < innerHeight);
  };
  for (const type of ['focusin', 'focusout']) document.addEventListener(type, () => requestAnimationFrame(cover));
})();
