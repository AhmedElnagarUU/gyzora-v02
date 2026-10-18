import assert from 'node:assert/strict';
import test from 'node:test';
import {createSiteSchema, siteSetupSchema} from './create-site-schema.ts';
import {TEMPLATES} from '../../templates/catalog.ts';

const validSetup = {
  companyName: 'Example Company',
  category: 'Interior design',
  locale: 'en',
};

test('Site creation schema accepts and retains every supported catalog ID', () => {
  for (const template of TEMPLATES) {
    const parsed = createSiteSchema.safeParse({
      ...validSetup,
      templateId: template.id,
    });

    assert.equal(parsed.success, true, `${template.id} should be accepted`);
    if (parsed.success) assert.equal(parsed.data.templateId, template.id);
  }
});

test('unsupported template IDs are rejected independently of required-field validation', () => {
  for (const templateId of ['modern', 'boutique', 'not-a-template']) {
    const parsed = createSiteSchema.safeParse({
      ...validSetup,
      templateId,
    });

    assert.equal(parsed.success, false, `${templateId} should be rejected`);
    if (!parsed.success) {
      assert.equal(
        parsed.error.issues.some((issue) => issue.message === 'siteSetup.validation.templateInvalid'),
        true
      );
    }
  }
});

test('empty first-step data is rejected independently of template selection', () => {
  const parsed = siteSetupSchema.safeParse({
    companyName: '',
    category: '',
    locale: 'en',
  });

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.equal(parsed.error.issues.some((issue) => issue.path[0] === 'companyName'), true);
    assert.equal(parsed.error.issues.some((issue) => issue.path[0] === 'category'), true);
  }
});

test('optional profile fields survive creation validation', () => {
  const parsed = createSiteSchema.safeParse({
    ...validSetup,
    templateId: 'atelier',
    description: 'Company overview',
    logoUrl: 'https://example.com/logo.png',
    contactEmail: 'hello@example.com',
    contactPhone: '+1 555 0100',
    address: 'Main Street',
    services: 'Design\nPlanning',
    features: 'Bilingual support',
    languagePreferences: ['en', 'ar'],
  });

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.description, 'Company overview');
    assert.equal(parsed.data.logoUrl, 'https://example.com/logo.png');
    assert.equal(parsed.data.contactEmail, 'hello@example.com');
    assert.equal(parsed.data.address, 'Main Street');
    assert.equal(parsed.data.services, 'Design\nPlanning');
    assert.equal(parsed.data.features, 'Bilingual support');
    assert.deepEqual(parsed.data.languagePreferences, ['en', 'ar']);
  }
});

test('unknown body fields are rejected for site creation', () => {
  const parsed = createSiteSchema.safeParse({
    ...validSetup,
    templateId: 'atelier',
    ownerUserId: 'someone-else',
  });

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.equal(
      parsed.error.issues.some((issue) => issue.code === 'unrecognized_keys'),
      true
    );
  }
});
