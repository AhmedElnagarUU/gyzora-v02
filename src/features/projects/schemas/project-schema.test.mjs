import assert from 'node:assert/strict';
import test from 'node:test';

import {projectSchema} from './project-schema.ts';

const key =
  'sites/64b7c1f2a1b2c3d4e5f60718/cover/3f2504e0-4f89-41d3-9a0c-0305e82c3301.jpg';

function values(extra = {}) {
  return {
    title: {en: 'Villa Cairo', ar: ''},
    description: {en: '', ar: ''},
    category: {en: '', ar: ''},
    location: {en: '', ar: ''},
    ...extra,
  };
}

test('a minimal project is accepted and optional parts get defaults', () => {
  const parsed = projectSchema.safeParse(values());

  assert.equal(parsed.success, true);
  assert.deepEqual(parsed.data.gallery, []);
  assert.deepEqual(parsed.data.metadata, {});
  assert.equal(parsed.data.featured, false);
  assert.equal(parsed.data.coverImage, undefined);
});

test('text is trimmed and newlines are normalised', () => {
  const parsed = projectSchema.parse(
    values({title: {en: '  Villa\r\nCairo  ', ar: ''}, description: {en: 'Line 1\r\nLine 2', ar: ''}})
  );

  assert.equal(parsed.title.en, 'Villa\nCairo');
  assert.equal(parsed.description.en, 'Line 1\nLine 2');
});

test('unknown keys are rejected', () => {
  const parsed = projectSchema.safeParse(values({siteId: '64b7c1f2a1b2c3d4e5f60718'}));

  assert.equal(parsed.success, false);
});

test('image keys must use the site image key format', () => {
  for (const badKey of [
    'https://example.com/cover.jpg',
    'sites/64b7c1f2a1b2c3d4e5f60718/cover/cover.gif',
    'receipts/64b7c1f2a1b2c3d4e5f60718/3f2504e0-4f89-41d3-9a0c-0305e82c3301.jpg',
    'sites/64b7c1f2a1b2c3d4e5f60718/cover/../cover.jpg',
  ]) {
    const parsed = projectSchema.safeParse(
      values({coverImage: {key: badKey, alt: {en: '', ar: ''}}})
    );

    assert.equal(parsed.success, false, `${badKey} should be rejected`);
  }

  const parsed = projectSchema.safeParse(
    values({coverImage: {key, alt: {en: 'Facade', ar: ''}}})
  );

  assert.equal(parsed.success, true);
});

test('the gallery accepts at most 12 images', () => {
  const gallery = Array.from({length: 13}, () => ({key, alt: {en: '', ar: ''}}));

  assert.equal(projectSchema.safeParse(values({gallery})).success, false);
  assert.equal(projectSchema.safeParse(values({gallery: gallery.slice(0, 12)})).success, true);
});

test('a title longer than 80 characters is rejected', () => {
  assert.equal(
    projectSchema.safeParse(values({title: {en: 'a'.repeat(81), ar: ''}})).success,
    false
  );
});

test('metadata requires a year between 1900 and 2100 and a positive area', () => {
  assert.equal(projectSchema.safeParse(values({metadata: {year: 2024}})).success, true);
  assert.equal(projectSchema.safeParse(values({metadata: {year: 1899}})).success, false);
  assert.equal(projectSchema.safeParse(values({metadata: {year: 2101}})).success, false);
  assert.equal(projectSchema.safeParse(values({metadata: {areaSqm: 120}})).success, true);
  assert.equal(projectSchema.safeParse(values({metadata: {areaSqm: 0}})).success, false);
  assert.equal(projectSchema.safeParse(values({metadata: {areaSqm: -5}})).success, false);
});
