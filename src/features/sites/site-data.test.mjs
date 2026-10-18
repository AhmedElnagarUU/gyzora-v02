import assert from 'node:assert/strict';
import test from 'node:test';
import {siteDataFromValues} from './site-data.ts';

const values = {
  companyName: 'Crown & Stone',
  category: 'Real estate',
  description: 'Prime developments',
  logoUrl: '',
  contactEmail: 'hello@example.com',
  contactPhone: '',
  address: 'Riyadh',
  services: 'Sales\nLeasing',
  features: 'Trusted\n',
  languagePreferences: ['en', 'ar'],
  locale: 'en',
};

test('wizard input becomes stored site data with explicit en/ar values', () => {
  const data = siteDataFromValues(values);

  assert.deepEqual(data.profile.companyName, {en: 'Crown & Stone', ar: ''});
  assert.deepEqual(data.profile.category, {en: 'Real estate', ar: ''});
  assert.deepEqual(data.profile.services, [{en: 'Sales', ar: ''}, {en: 'Leasing', ar: ''}]);
  assert.deepEqual(data.profile.features, [{en: 'Trusted', ar: ''}]);
  assert.equal(data.profile.contact?.address?.en, 'Riyadh');
  assert.equal(data.profile.contact?.email, 'hello@example.com');
  assert.equal('projects' in data, false);
});

test('Arabic input fills only the Arabic values and empty contact details are dropped', () => {
  const data = siteDataFromValues({
    ...values,
    locale: 'ar',
    contactEmail: '',
    address: '',
  });

  assert.deepEqual(data.profile.companyName, {en: '', ar: 'Crown & Stone'});
  assert.equal(data.profile.contact, undefined);
});

test('missing language preferences fall back to the entered locale', () => {
  const data = siteDataFromValues({...values, languagePreferences: []});

  assert.deepEqual(data.profile.languagePreferences, ['en']);
});
