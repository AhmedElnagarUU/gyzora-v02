import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildKey,
  extensionForContentType,
  isKeyOwnedBySite,
  parseKey,
} from './keys.ts';

const SITE_ID = '64b7c1f2a1b2c3d4e5f60718';
const OTHER_SITE_ID = '64b7c1f2a1b2c3d4e5f60719';

test('extensionForContentType accepts jpeg, png and webp only', () => {
  assert.equal(extensionForContentType('image/jpeg'), 'jpg');
  assert.equal(extensionForContentType('image/png'), 'png');
  assert.equal(extensionForContentType('image/webp'), 'webp');
  assert.equal(extensionForContentType('image/gif'), null);
  assert.equal(extensionForContentType('image/svg+xml'), null);
});

test('buildKey produces sites/{siteId}/{kind}/{uuid}.{ext}', () => {
  const key = buildKey(SITE_ID, 'cover', 'png');

  assert.match(key, /^sites\/[0-9a-f]{24}\/cover\/[0-9a-f-]{36}\.png$/);
  assert.ok(key.startsWith(`sites/${SITE_ID}/cover/`));
});

test('buildKey normalises jpeg to jpg and rejects other extensions', () => {
  assert.ok(buildKey(SITE_ID, 'gallery', 'jpeg').endsWith('.jpg'));
  assert.throws(() => buildKey(SITE_ID, 'gallery', 'gif'));
});

test('parseKey reads the site, kind and extension', () => {
  const key = `sites/${SITE_ID}/logo/3f2504e0-4f89-41d3-9a0c-0305e82c3301.webp`;

  assert.deepEqual(parseKey(key), {siteId: SITE_ID, kind: 'logo', extension: 'webp'});
});

test('parseKey rejects malformed keys', () => {
  for (const key of [
    '',
    'logo.png',
    `sites/${SITE_ID}/cover/logo.png`,
    `receipts/${SITE_ID}/3f2504e0-4f89-41d3-9a0c-0305e82c3301.png`,
    `sites/${SITE_ID}/cover/3f2504e0-4f89-41d3-9a0c-0305e82c3301.gif`,
    `sites/not-an-id/cover/3f2504e0-4f89-41d3-9a0c-0305e82c3301.png`,
    `sites/${SITE_ID}/cover/../secret.png`,
  ]) {
    assert.equal(parseKey(key), null, `${key} should be rejected`);
  }
});

test('isKeyOwnedBySite compares the key site with the given site', () => {
  const key = buildKey(SITE_ID, 'cover', 'jpg');

  assert.equal(isKeyOwnedBySite(key, SITE_ID), true);
  assert.equal(isKeyOwnedBySite(key, OTHER_SITE_ID), false);
  assert.equal(isKeyOwnedBySite('not-a-key', SITE_ID), false);
});
