import { afterAll, expect, test } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const original = await readFile('dist/index.html', 'utf8');
const temporary = await mkdtemp(join(tmpdir(), 'augur-copy-check-'));
afterAll(() => rm(temporary, { recursive: true }));

async function check(name: string, html: string) {
  const path = join(temporary, `${name}.html`);
  await writeFile(path, html);
  return Bun.spawnSync([process.execPath, 'scripts/check-copy.ts', path]);
}

test('accepts every canonical section with the restored newsletter field', async () => {
  expect((await check('original', original)).exitCode).toBe(0);
});
test('rejects a changed answer-band claim', async () => {
  const changed = original.replace('With Augur, no one controls the oracle.', 'With Augur, no one controls the answer.');
  expect(changed).not.toBe(original);
  const result = await check('changed', changed);
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain('Missing or changed melo:why/4');
});
test('rejects additional visible prose', async () => {
  const changed = original.replace('With Augur, no one controls the oracle.', 'With Augur, no one controls the oracle. Guaranteed truth for every application.');
  const result = await check('extra', changed);
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain('Unexpected copy: Guaranteed truth for every application.');
});
test('rejects a missing short control label', async () => {
  const changed = original.replace('>Catch up</span> →', '></span>');
  expect(changed).not.toBe(original);
  const result = await check('missing', changed);
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain('Missing or changed 208:1210');
});
test('rejects a changed newsletter placeholder', async () => {
  const changed = original.replace('placeholder="you@example.com"', 'placeholder="Email"');
  expect(changed).not.toBe(original);
  const result = await check('placeholder', changed);
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain('newsletter placeholder');
});
test('rejects a changed How it works title', async () => {
  const changed = original.replace('Know what happened?', 'Saw what happened?');
  expect(changed).not.toBe(original);
  const result = await check('how-title', changed);
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toString()).toContain('Missing or changed draft:how/title');
});
