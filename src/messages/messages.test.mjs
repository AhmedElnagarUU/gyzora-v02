import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const readMessages = (locale) =>
  JSON.parse(readFileSync(new URL(`./${locale}.json`, import.meta.url), 'utf8'));

const flattenKeys = (value, prefix = '') =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? flattenKeys(child, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );

test('en.json and ar.json expose the same message keys', () => {
  const en = new Set(flattenKeys(readMessages('en')));
  const ar = new Set(flattenKeys(readMessages('ar')));

  const missingInAr = [...en].filter((key) => !ar.has(key));
  const missingInEn = [...ar].filter((key) => !en.has(key));

  assert.deepEqual(missingInAr, [], `Keys missing in ar.json: ${missingInAr.join(', ')}`);
  assert.deepEqual(missingInEn, [], `Keys missing in en.json: ${missingInEn.join(', ')}`);
});
