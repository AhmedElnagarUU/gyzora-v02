import assert from 'node:assert/strict';
import test from 'node:test';
import {buildSlugBase, findAvailableSlug, slugCandidate, slugify} from './slug.ts';

test('slugify lowercases, keeps latin letters and digits and collapses the rest to single dashes', () => {
  assert.equal(slugify('Crown & Stone Developments'), 'crown-stone-developments');
  assert.equal(slugify('  Modern   Build!! '), 'modern-build');
  assert.equal(slugify('A--B'), 'a-b');
});

test('slugify trims separators and never exceeds 40 characters', () => {
  assert.equal(slugify('***'), '');
  assert.equal(slugify('a'.repeat(60)), 'a'.repeat(40));
  assert.equal(slugify(`${'a'.repeat(39)}-b`), 'a'.repeat(39));
});

test('names without latin characters fall back to site- plus six random characters', () => {
  assert.match(buildSlugBase('مجموعة كراون آند ستون'), /^site-[a-z0-9]{6}$/);
  assert.match(buildSlugBase('AB'), /^site-[a-z0-9]{6}$/);
});

test('reserved words receive the -site suffix', () => {
  assert.equal(buildSlugBase('Admin'), 'admin-site');
  assert.equal(buildSlugBase('dashboard'), 'dashboard-site');
  assert.equal(buildSlugBase('Gyzora'), 'gyzora');
});

test('candidate suffixes follow the -2, -3 order and stay within 40 characters', () => {
  assert.equal(slugCandidate('crown', 0), 'crown');
  assert.equal(slugCandidate('crown', 1), 'crown-2');
  assert.equal(slugCandidate('crown', 4), 'crown-5');

  const longest = 'a'.repeat(40);
  assert.equal(slugCandidate(longest, 1).length, 40);
  assert.equal(slugCandidate(longest, 1).endsWith('-2'), true);
});

test('availability is decided by the injected lookup', async () => {
  const taken = new Set(['crown', 'crown-2']);

  assert.equal(await findAvailableSlug('crown', async (slug) => taken.has(slug)), 'crown-3');
  assert.equal(await findAvailableSlug('crown', async () => false), 'crown');
  assert.equal(await findAvailableSlug('crown', async () => true), null);
});
