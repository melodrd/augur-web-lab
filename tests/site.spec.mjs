import { readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
function routeFiles(root) { return readdirSync(root, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? routeFiles(join(root, entry.name)) : entry.name.endsWith('.html') ? [join(root, entry.name)] : []); }
const routes = routeFiles('dist').map(path => '/' + path.slice(5).replace(/index\.html$/, '')).filter(path => path !== '/404.html');
mkdirSync('artifacts/qa/screenshots', { recursive: true });

for (const route of routes) {
  test(`${route} renders, has no browser errors, and passes axe`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `artifacts/qa/screenshots/${route.replace(/\W+/g, '-') || 'home'}-1440.png`, fullPage: true });
  });
}

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1280 ? 720 : 900 });
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const list of await page.getByRole('tablist').all()) {
      for (const tab of await list.getByRole('tab').all()) {
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }
    }
    await page.screenshot({ path: `artifacts/qa/screenshots/home-${width}.png`, fullPage: true });
  });
}

test('all tabs support focus movement, manual activation and roving tabindex', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const list of await page.getByRole('tablist').all()) {
    const tabs = list.getByRole('tab');
    await tabs.first().focus();
    await page.keyboard.press('End');
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
    // The first controlled id is the tab's panel.
    const panel = page.locator(`[id="${(await tabs.last().getAttribute('aria-controls')).split(' ')[0]}"]`);
    await expect(panel).toBeVisible();
    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press('Space');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await expect(list.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  }
});

test('FAQ uses exclusive native disclosure and first is open', async ({ page }) => {
  await page.goto('/faq/');
  const faq = page.locator('main details[name]').filter({ has: page.locator('summary') });
  expect(await faq.count()).toBeGreaterThanOrEqual(5);
  await expect(faq.first()).toHaveAttribute('open', '');
  await faq.nth(1).locator('summary').click();
  await expect(faq.nth(1)).toHaveAttribute('open', '');
  await expect(faq.first()).not.toHaveAttribute('open', '');
});

test('desktop navigation closes on Escape and restores trigger focus', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Products', 'Resources', 'Community']) {
    // Native summary is a disclosure control; Chromium does not expose it to
    // Playwright's button role matcher even though its keyboard behaviour is native.
    const trigger = page.locator('header nav summary').filter({ hasText: name }).first();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  }
});

test('mobile navigation is a modal dialog with Escape restoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /open.*menu|open.*navigation|menu/i }).first();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('contact validates required fields without claiming delivery', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(3);
  await expect(page.locator('[aria-live="polite"]').filter({ hasText: /required|check|correct/i }).first()).toBeVisible();
  await page.getByLabel('Name', { exact: true }).fill('Test Reader');
  await page.getByLabel('Email', { exact: true }).fill('invalid');
  await page.getByLabel('Message', { exact: true }).fill('Testing validation only.');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText(/message sent|delivered successfully/i)).toHaveCount(0);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
});

test('no JavaScript keeps primary content and default states visible', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: process.env.AUGUR_TEST_URL ?? 'http://127.0.0.1:4321', javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByText('With Augur, no one controls the oracle.', { exact: true })).toBeVisible();
  for (const panel of await page.locator('[role="tabpanel"]:not([hidden])').all()) await expect(panel).toBeVisible();
  await page.screenshot({ path: 'artifacts/qa/screenshots/home-no-javascript.png', fullPage: true });
  await context.close();
});

test('reduced motion renders settled content without running animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
});

test('hero occupies the first desktop viewport at the required sizes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[1440, 900], [1280, 720], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const bounds = await page.locator('[data-home-hero]').boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds.y + bounds.height).toBeGreaterThanOrEqual(height - 1);
    if (width === 1440) expect(Math.abs(bounds.y + bounds.height - height)).toBeLessThanOrEqual(1);
  }
});

test('skip link and forced-colors retain keyboard access', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeVisible();
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('main');
  await page.screenshot({ path: 'artifacts/qa/screenshots/home-forced-colors.png', fullPage: true });
});

test('unknown routes show the designed 404 and working recovery links', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main a[href="/"]')).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
});

test('article copy link announces success and copies its canonical address', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/blog/why-disagreement-makes-an-oracle-stronger/');
  await page.getByRole('button', { name: 'Copy link', exact: true }).first().click();
  await expect(page.getByRole('status').filter({ hasText: 'Link copied' })).toHaveText('Link copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('https://www.augur.net/blog/why-disagreement-makes-an-oracle-stronger/');
});

// Polish brief (5 Oct 2026): hover navigation, the restored newsletter field and row hover states.
test('opening a FAQ question animates; the open question on load does not', async ({ page }) => {
  await page.goto('/faq/');
  const items = page.locator('main .faq-item');
  await items.first().scrollIntoViewIfNeeded();
  expect(await items.first().locator('.faq-answer p').evaluate(element => element.getAnimations().length)).toBe(0);
  const started = await items.nth(2).evaluate(item => {
    item.querySelector('summary').click();
    return { transition: 'faqTransition' in document.documentElement.dataset, opening: 'faqOpening' in item.dataset };
  });
  expect(started).toEqual({ transition: true, opening: true });
  await expect(items.nth(2)).toHaveAttribute('open', '');
  await expect(items.first()).not.toHaveAttribute('open', '');
  await expect.poll(() => page.evaluate(() => 'faqTransition' in document.documentElement.dataset)).toBe(false);
});

test('switching header panels glides the panel instead of reopening it', async ({ page }) => {
  await page.goto('/');
  const trigger = name => page.locator('header nav summary').filter({ hasText: name }).first();
  await trigger('Products').hover();
  await expect(trigger('Products')).toHaveAttribute('aria-expanded', 'true');
  const glide = await page.evaluate(() => {
    const resources = document.querySelectorAll('[data-nav-disclosure]')[1];
    resources.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    return { open: resources.open, animations: resources.querySelector('.nav-panel').getAnimations({ subtree: true }).length };
  });
  expect(glide.open).toBe(true);
  expect(glide.animations).toBeGreaterThan(0);
  await expect(trigger('Products')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-nav-highlight]')).toHaveAttribute('data-visible', '');
});

test('the header highlight is a Green line that draws in under the label and retracts', async ({ page }) => {
  await page.goto('/');
  const line = await page.evaluate(() => {
    const nav = document.querySelector('header .desktop-nav'), item = nav.querySelector('.nav-link'), rule = nav.querySelector('[data-nav-highlight]');
    const frames = () => rule.getAnimations()[0].effect.getKeyframes().map(frame => { const matrix = new DOMMatrix(frame.transform); return { scale: matrix.a, x: matrix.e }; });
    const probe = document.createElement('span');
    probe.style.color = 'var(--primary)';
    document.body.append(probe);
    const green = getComputedStyle(probe).color;
    probe.remove();
    item.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    const draw = frames();
    rule.getAnimations().forEach(animation => animation.finish());
    const box = rule.getBoundingClientRect(), label = item.querySelector('.nav-item-label').getBoundingClientRect();
    nav.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    return { draw, retract: frames(), origin: getComputedStyle(rule).transformOrigin, height: box.height, offsets: [box.left - label.left, box.width - label.width, box.top - label.bottom], green: getComputedStyle(rule).backgroundColor === green, fill: getComputedStyle(item).backgroundColor };
  });
  // Both run from the label's left edge: in left to right, out right to left.
  expect(line.origin.startsWith('0px')).toBe(true);
  expect([line.draw[0].scale, line.retract[1].scale]).toEqual([0, 0]);
  expect(line.draw[1].scale).toBeGreaterThan(0);
  expect(line.retract[0].scale).toBe(line.draw[1].scale);
  for (const frames of [line.draw, line.retract]) expect(frames[0].x).toBe(frames[1].x);
  expect(line.height).toBe(2);
  for (const offset of line.offsets) expect(Math.abs(offset)).toBeLessThan(0.5);
  expect(line.green).toBe(true);
  expect(line.fill).toBe('rgba(0, 0, 0, 0)');
});

test('social destinations carry their logos', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Discord', 'Telegram', 'X', 'GitHub']) await expect(page.locator('.site-footer nav').getByRole('link', { name, exact: true }).locator('.social-logo svg')).toHaveCount(1);
});

test('desktop navigation opens on hover and switches panels without closing', async ({ page }) => {
  await page.goto('/');
  const trigger = name => page.locator('header nav summary').filter({ hasText: name }).first();
  await trigger('Products').hover();
  await expect(trigger('Products')).toHaveAttribute('aria-expanded', 'true');
  await trigger('Resources').hover();
  await expect(trigger('Resources')).toHaveAttribute('aria-expanded', 'true');
  await expect(trigger('Products')).toHaveAttribute('aria-expanded', 'false');
  const panel = await page.locator('#nav-1').boundingBox();
  await page.mouse.move(panel.x + 40, panel.y + 30, { steps: 6 });
  await expect(trigger('Resources')).toHaveAttribute('aria-expanded', 'true');
  await page.mouse.move(700, 700);
  await expect(trigger('Resources')).toHaveAttribute('aria-expanded', 'false');
});

test('Augur Lituus leads the products panel as one link across its card', async ({ page }) => {
  await page.goto('/');
  await page.locator('header nav summary').filter({ hasText: 'Products' }).first().click();
  const panel = page.locator('#nav-0');
  await expect(panel.locator('li .nav-label')).toHaveText(['Augur Lituus', 'Zoltar', 'Augur Stratoblast']);
  // The lead card is itself the one link, with no button inside it (owner, 22 Oct 2026).
  const lead = panel.locator('.nav-lead');
  await expect(lead.getByRole('link')).toHaveCount(1);
  await expect(lead.getByRole('link')).toHaveAttribute('href', '/products/#augur-lituus');
  await expect(lead.locator('button')).toHaveCount(0);
  // Keyboard order follows the emphasis: Augur Lituus, then Zoltar and Augur Stratoblast.
  for (const name of [/^Augur Lituus/, /^Zoltar/, /^Augur Stratoblast/]) {
    await page.keyboard.press('Tab');
    await expect(panel.getByRole('link', { name })).toBeFocused();
  }
});

test('newsletter field validates locally and never sends or claims a subscription', async ({ page }) => {
  const posts = [];
  page.on('request', request => { if (request.method() !== 'GET' || request.url().includes('email=')) posts.push(request.url()); });
  await page.goto('/');
  const field = page.getByLabel('Email address');
  await expect(field).toHaveAttribute('placeholder', 'you@example.com');
  await page.getByRole('button', { name: 'Subscribe' }).click();
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#newsletter-email-error')).toHaveText('Enter your email address.');
  await field.fill('reader@example.org');
  await field.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'nothing was sent or saved' })).toBeVisible();
  await expect(page.getByText(/subscribed|you're in|thanks for subscribing/i)).toHaveCount(0);
  expect(posts).toEqual([]);
  expect(page.url()).not.toContain('email=');
});

test('closed FAQ questions respond to hover and keyboard focus', async ({ page }) => {
  await page.goto('/faq/');
  const item = page.locator('main .faq-item').nth(1);
  await item.scrollIntoViewIfNeeded();
  const before = await item.evaluate(element => getComputedStyle(element).backgroundColor);
  await item.locator('summary').hover();
  await expect.poll(() => item.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(before);
  await page.mouse.move(5, 5);
  await item.locator('summary').focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect.poll(() => item.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
});

// Owner iteration (6 Oct 2026): the hero underline sits under the letters with no glow and is temporary; past
// roadmap milestones read as done.
test('the decentralized underline sweeps in and out on every load and on hover, just under the letters', async ({ page }) => {
  await page.goto('/');
  await page.reload();
  const emphasis = page.locator('.hero-emphasis');
  const sweep = await emphasis.evaluate(element => {
    const scale = transform => transform === 'none' ? 1 : new DOMMatrix(transform).a;
    const animations = element.getAnimations({ subtree: true }).filter(animation => animation.effect.pseudoElement === '::after');
    const timing = animations.map(animation => ({ name: animation.animationName, delay: animation.effect.getTiming().delay, frames: animation.effect.getKeyframes().map(frame => scale(frame.transform)) }));
    animations.forEach(animation => animation.finish());
    const probe = document.createElement('span');
    probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    element.prepend(probe);
    const baseline = probe.getBoundingClientRect().top - element.getBoundingClientRect().top;
    probe.remove();
    const line = getComputedStyle(element, '::after'), hover = getComputedStyle(element, '::before');
    return { timing, settled: scale(line.transform), origin: line.transformOrigin, gap: parseFloat(line.top) - baseline, size: parseFloat(getComputedStyle(element).fontSize), sameSpot: [hover.top, hover.height, hover.width].join() === [line.top, line.height, line.width].join() };
  });
  // In left to right, then out right to left to the same left edge; nothing stays behind.
  expect(sweep.timing.map(animation => animation.name)).toEqual(['hero-underline-in', 'hero-underline-out']);
  expect(sweep.timing.map(animation => animation.frames)).toEqual([[0, 1], [1, 0]]);
  expect(sweep.timing[1].delay).toBeGreaterThan(sweep.timing[0].delay);
  expect(sweep.settled).toBe(0);
  expect(sweep.origin.startsWith('0px')).toBe(true);
  expect(sweep.gap).toBeGreaterThan(0);
  expect(sweep.gap).toBeLessThan(sweep.size * .15);
  expect(sweep.sameSpot).toBe(true);
  const hoverScale = () => emphasis.evaluate(element => { const transform = getComputedStyle(element, '::before').transform; return transform === 'none' ? 1 : new DOMMatrix(transform).a; });
  await emphasis.hover();
  await expect.poll(hoverScale).toBe(1);
  await page.mouse.move(4, 600);
  await expect.poll(hoverScale).toBe(0);
  expect(await page.locator('.home-hero [style*="filter"], .home-hero [style*="blur"]').count()).toBe(0);
});

test('text actions draw a line under the label on hover and retract it', async ({ page }) => {
  await page.goto('/');
  const action = page.locator('.hero-actions .button.text');
  const line = () => action.evaluate(element => {
    const label = element.querySelector('.button-label'), style = getComputedStyle(label, '::after');
    return { scale: style.transform === 'none' ? 1 : new DOMMatrix(style.transform).a, origin: style.transformOrigin, height: style.height, labelWidth: label.getBoundingClientRect().width, width: parseFloat(style.width), decoration: getComputedStyle(element).textDecorationLine };
  });
  expect((await line()).scale).toBe(0);
  await action.hover();
  await expect.poll(async () => (await line()).scale).toBe(1);
  const drawn = await line();
  expect(drawn.origin.startsWith('0px')).toBe(true);
  expect(drawn.height).toBe('2px');
  expect(Math.abs(drawn.width - drawn.labelWidth)).toBeLessThan(.5);
  expect(drawn.decoration).toBe('none');
  await page.mouse.move(4, 600);
  await expect.poll(async () => (await line()).scale).toBe(0);
});

test('a small scroll cue sits under the hero content, loops at the top and goes once the page scrolls', async ({ page }) => {
  await page.goto('/');
  const cue = page.locator('[data-scroll-cue]');
  await expect(cue).toHaveAttribute('aria-hidden', 'true');
  const state = () => cue.evaluate(element => {
    const box = element.getBoundingClientRect(), hit = other => { const b = document.querySelector(other).getBoundingClientRect(); return !(box.right <= b.left || b.right <= box.left || box.bottom <= b.top || b.bottom <= box.top); };
    const loop = element.querySelector('.hero-scroll-dot').getAnimations()[0];
    return { inView: box.bottom <= innerHeight, overlaps: hit('.hero-copy') || hit('.hero-visual'), loop: loop && { iterations: loop.effect.getTiming().iterations, state: loop.playState }, opacity: getComputedStyle(element).opacity };
  });
  const top = await state();
  expect(top.inView).toBe(true);
  expect(top.overlaps).toBe(false);
  expect(top.loop).toEqual({ iterations: Infinity, state: 'running' });
  await page.mouse.wheel(0, 400);
  await expect(cue).toHaveAttribute('data-scrolled', '');
  await expect.poll(async () => (await state()).opacity).toBe('0');
  expect((await state()).loop.state).toBe('paused');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(cue).toBeHidden();
});

test('past roadmap milestones read as done and only the current leg is Green', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.roadmap-stop.is-completed .web-icon')).toHaveCount(3);
  await expect(page.locator('[data-track-live]')).toHaveCount(1);
  const colours = await page.locator('.roadmap-tabs .roadmap-label').evaluateAll(labels => labels.map(label => getComputedStyle(label).color));
  expect(colours[0]).toBe(colours[1]);
  expect(colours[0]).not.toBe(colours[3]);
});

test('the footer links to brand assets, whose downloads resolve and whose colors copy', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Brand assets' }).click();
  await expect(page).toHaveURL(/\/brand\/$/);
  const downloads = await page.locator('main a[download]').evaluateAll(links => [...new Set(links.map(link => link.getAttribute('href')))]);
  expect(downloads.length).toBe(27);
  for (const href of downloads) expect((await page.request.get(href)).status(), href).toBe(200);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const green = page.getByRole('button', { name: 'Copy Augur Green hex #2AE7A8' });
  await green.click();
  await expect(green).toContainText('Copied');
  await expect(page.locator('[data-copy-status]')).toHaveText('Copied #2AE7A8');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('#2AE7A8');
  for (const width of [1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}px`).toBe(true);
  }
});

// REP page rebuilt (19 Oct 2026): the contract reference, the comparison, the lineage and holders' questions.
test('/rep/ is the token page and the contract reference', async ({ page, context }) => {
  const address = '0xCf6A0A7826fa124B7705d6f3c675eAD76f1e540D';
  await page.goto('/rep/');
  await expect(page.locator('h1')).toHaveText('REP makes lying expensive.');
  const card = page.locator('#contract');
  await expect(card.getByRole('heading', { level: 2 })).toHaveText('REPv2_Yes_1');
  await expect(card.locator('.token-address')).toHaveText(address);
  await expect(card.getByRole('link', { name: /View on Etherscan/ })).toHaveAttribute('href', `https://etherscan.io/token/${address}`);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const copy = card.getByRole('button', { name: 'Copy address' });
  const width = (await copy.boundingBox()).width;
  await copy.click();
  await expect(page.locator('[data-copy-address-status]')).toHaveText('Contract address copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(address);
  expect((await copy.boundingBox()).width).toBeCloseTo(width, 0);
  // In-page anchors from the hero.
  for (const id of ['versions', 'fork', 'taking-part']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  // Hold, Report, Challenge: the gains are the whitepaper's §4.5 example.
  await expect(page.locator('.option h3')).toHaveText(['Hold', 'Report', 'Challenge']);
  await expect(page.locator('.option-cell strong.gain')).toHaveText(['+2.5 REP', '+12 REP']);
  // Four versions, one current, and only the current one shows an address.
  await expect(page.locator('.version h3')).toHaveText(['REPv1', 'REPv2', 'REPv2_Yes_1', 'REPv2_No_1']);
  await expect(page.locator('.version.is-current h3')).toHaveText('REPv2_Yes_1');
  expect(await page.locator('main').evaluate(node => (node.textContent.match(/0x[0-9a-fA-F]{40}/g) ?? []).every(match => match === '0xCf6A0A7826fa124B7705d6f3c675eAD76f1e540D'))).toBe(true);
  await expect(page.getByRole('heading', { name: 'Migration is closed' })).toBeVisible();
  // Holders' questions; the answer that links to /rep/ itself shows no link here.
  await expect(page.locator('#questions summary')).toHaveText(['What role does REP play?', 'Do I earn anything just for holding REP?', 'Is AUGUR the same token as REPv2_Yes_1?', "Why doesn't my wallet show my REP?", "I didn't move my REP in the Moon Fork. Can I still?", 'Why would REP holders choose the honest fork?']);
  await expect(page.locator('#faq-rep-role .faq-answer a')).toHaveCount(0);
  // Settled without motion, and no horizontal overflow at any width.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.effect?.target?.closest?.('[data-ladder],[data-fork-diagram]')).length)).toBe(0);
  for (const viewport of [1440, 1280, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width: viewport, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${viewport}px`).toBe(true);
  }
});
