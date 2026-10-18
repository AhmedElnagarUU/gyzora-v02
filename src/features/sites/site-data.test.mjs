import assert from 'node:assert/strict';
import test from 'node:test';
import {
  mergeProfileEdit,
  siteDataFromValues,
  siteSetupValuesFromProfile,
} from './site-data.ts';

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

test('stored site data fills the edit form with the viewed locale', () => {
  const data = siteDataFromValues({...values, locale: 'ar'});
  const form = siteSetupValuesFromProfile(data.profile, 'ar');

  assert.equal(form.companyName, 'Crown & Stone');
  assert.equal(form.category, 'Real estate');
  assert.equal(form.contactEmail, 'hello@example.com');
  assert.equal(form.address, 'Riyadh');
  assert.equal(form.services, 'Sales\nLeasing');
  assert.equal(form.locale, 'ar');
});

test('edit form values come only from the viewed locale', () => {
  const data = siteDataFromValues(values);
  const form = siteSetupValuesFromProfile(data.profile, 'ar');

  assert.equal(form.companyName, '');
  assert.equal(form.services, '');
  assert.equal(form.address, '');
  assert.deepEqual(form.languagePreferences, ['en', 'ar']);
});

test('editing one locale never changes the other locale', () => {
  const stored = siteDataFromValues({...values, locale: 'ar'}).profile;
  const merged = mergeProfileEdit(stored, 'en', {
    ...values,
    companyName: 'Crown Stone',
    description: '',
    address: '',
    services: 'Leasing',
    features: '',
  });

  assert.deepEqual(merged.companyName, {en: 'Crown Stone', ar: 'Crown & Stone'});
  assert.deepEqual(merged.description, {en: '', ar: 'Prime developments'});
  assert.deepEqual(merged.services, [{en: 'Leasing', ar: 'Sales'}, {en: '', ar: 'Leasing'}]);
  assert.deepEqual(merged.features, [{en: '', ar: 'Trusted'}]);
  assert.equal(merged.contact?.email, 'hello@example.com');
  assert.equal(merged.contact?.address, undefined);
});

test('editing drops an emptied optional field and keeps other contact details', () => {
  const stored = siteDataFromValues(values).profile;
  const merged = mergeProfileEdit(stored, 'en', {
    ...values,
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });

  assert.equal(merged.logoUrl, undefined);
  assert.equal(merged.contact, undefined);
  assert.deepEqual(merged.languagePreferences, ['en', 'ar']);
});
