import assert from 'node:assert/strict';
import test from 'node:test';
import {updateSiteSchema} from './update-site-schema.ts';

const profile = {
  companyName: {en: 'Example Company', ar: ''},
  category: {en: 'Interior design', ar: ''},
  description: {en: '', ar: ''},
  services: [{en: 'Design', ar: ''}],
  features: [],
  languagePreferences: ['en'],
};

test('an update carries the revision and the full profile', () => {
  const parsed = updateSiteSchema.safeParse({revision: 3, data: {profile}});

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.revision, 3);
    assert.deepEqual(parsed.data.data.profile, profile);
  }
});

test('a company name that is empty in both locales is rejected', () => {
  const parsed = updateSiteSchema.safeParse({
    revision: 0,
    data: {profile: {...profile, companyName: {en: '   ', ar: ''}}},
  });

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.equal(
      parsed.error.issues.some(
        (issue) => issue.message === 'siteSetup.validation.companyNameMin'
      ),
      true
    );
  }
});

test('the revision must be a non-negative integer', () => {
  for (const revision of [-1, 1.5, '1']) {
    assert.equal(
      updateSiteSchema.safeParse({revision, data: {profile}}).success,
      false,
      `revision ${revision} should be rejected`
    );
  }
});

test('unknown keys are rejected at every level', () => {
  const cases = [
    {revision: 0, data: {profile}, ownerUserId: 'someone-else'},
    {revision: 0, data: {profile, projects: []}},
    {revision: 0, data: {profile: {...profile, slug: 'taken'}}},
  ];

  for (const payload of cases) {
    const parsed = updateSiteSchema.safeParse(payload);

    assert.equal(parsed.success, false);
    if (!parsed.success) {
      assert.equal(
        parsed.error.issues.some((issue) => issue.code === 'unrecognized_keys'),
        true
      );
    }
  }
});

test('language preferences must name at least one language', () => {
  const parsed = updateSiteSchema.safeParse({
    revision: 0,
    data: {profile: {...profile, languagePreferences: []}},
  });

  assert.equal(parsed.success, false);
});
