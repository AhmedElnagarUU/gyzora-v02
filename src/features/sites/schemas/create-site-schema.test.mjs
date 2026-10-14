import assert from 'node:assert/strict';
import test from 'node:test';
import {createSiteSchema} from './create-site-schema.ts';
import {TEMPLATES} from '../../templates/catalog.ts';
import {buildTemplateContent} from '../templates.ts';

const validSiteRequest = {
  companyName: 'Example Company',
  category: 'Interior design',
  description: 'A company description with more than twenty characters.',
  languagePreferences: ['en'],
};

test('Site creation schema accepts and retains every supported catalog ID', () => {
  for (const template of TEMPLATES) {
    const parsed = createSiteSchema.safeParse({
      ...validSiteRequest,
      templateId: template.id,
    });

    assert.equal(parsed.success, true, `${template.id} should be accepted`);
    if (parsed.success) assert.equal(parsed.data.templateId, template.id);
  }
});

test('Site creation schema rejects legacy and unknown template IDs', () => {
  for (const templateId of ['modern', 'boutique', 'not-a-template']) {
    const parsed = createSiteSchema.safeParse({
      ...validSiteRequest,
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

test('required Site fields remain required independently of template validation', () => {
  const parsed = createSiteSchema.safeParse({
    templateId: TEMPLATES[0].id,
    companyName: '',
    category: '',
    description: '',
    languagePreferences: [],
  });

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.equal(parsed.error.issues.some((issue) => issue.path[0] === 'companyName'), true);
    assert.equal(parsed.error.issues.some((issue) => issue.path[0] === 'category'), true);
    assert.equal(parsed.error.issues.some((issue) => issue.path[0] === 'description'), true);
    assert.equal(parsed.error.issues.some((issue) => issue.path[0] === 'languagePreferences'), true);
  }
});

test('template content is seeded per Site without mutating customer input', () => {
  const profile = {
    companyName: 'Example Company',
    category: 'Interior design',
    description: 'A company description with more than twenty characters.',
  };
  const content = buildTemplateContent('atelier', profile);

  assert.equal(content.templateId, 'atelier');
  assert.equal(content.sections.hero.heading.en, profile.companyName);
  assert.notEqual(content.sections.hero.heading, profile);
  assert.deepEqual(profile, {
    companyName: 'Example Company',
    category: 'Interior design',
    description: 'A company description with more than twenty characters.',
  });
});
