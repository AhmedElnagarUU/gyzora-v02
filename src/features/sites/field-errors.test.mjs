import assert from 'node:assert/strict';
import test from 'node:test';
import {parseFieldErrors, serializeFieldErrors} from './field-errors.ts';

test('serializeFieldErrors keeps only schema-shaped names and codes', () => {
  assert.equal(serializeFieldErrors({companyName: 'too_small'}), 'companyName:too_small');
  assert.equal(
    serializeFieldErrors({companyName: 'too_small', 'bad name': 'too_small'}),
    'companyName:too_small'
  );
  assert.equal(serializeFieldErrors({companyName: 'NOT A CODE'}), '');
  assert.equal(serializeFieldErrors({}), '');
});

test('parseFieldErrors reads sanitized pairs and drops everything else', () => {
  assert.deepEqual(parseFieldErrors('companyName:too_small,category:invalid_type'), [
    {name: 'companyName', code: 'too_small'},
    {name: 'category', code: 'invalid_type'},
  ]);
  assert.deepEqual(parseFieldErrors('companyName'), []);
  assert.deepEqual(parseFieldErrors('<script>:x'), []);
  assert.deepEqual(parseFieldErrors(undefined), []);
  assert.deepEqual(parseFieldErrors(['companyName:too_small']), []);
});
