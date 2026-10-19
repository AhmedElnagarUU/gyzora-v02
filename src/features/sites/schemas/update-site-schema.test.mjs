import assert from 'node:assert/strict';
import test from 'node:test';
import {SITE_TEXT_LIMITS, updateSiteSchema} from './update-site-schema.ts';

const arCompanyName = {revision: 3, data: {profile: {companyName: {ar: 'كراون وستون'}}}};

test('an update carries the revision and only the edited section and locale', () => {
  const parsed = updateSiteSchema.safeParse(arCompanyName);

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.revision, 3);
    assert.deepEqual(parsed.data.data, {profile: {companyName: {ar: 'كراون وستون'}}});
  }
});

test('an edit may contain an empty data object', () => {
  assert.equal(updateSiteSchema.safeParse({revision: 0, data: {}}).success, true);
});

test('every editable section is accepted on its own', () => {
  const sections = [
    {profile: {category: {en: 'Real estate'}}},
    {profile: {description: {en: 'Prime developments'}}},
    {profile: {logoUrl: 'https://example.com/logo.png'}},
    {profile: {contact: {email: 'hello@example.com'}}},
    {profile: {contact: {phone: '+20 100 000 0000'}}},
    {profile: {contact: {address: {ar: 'الرياض'}}}},
    {profile: {contact: {workingHours: {ar: 'الأحد - الخميس'}}}},
    {profile: {services: [{en: 'Sales', ar: 'البيع'}]}},
    {profile: {features: [{en: 'Trusted', ar: 'موثوق'}]}},
    {profile: {languagePreferences: ['ar']}},
    {pageCopy: {about: {introduction: {en: 'We build'}}}},
    {pageCopy: {about: {story: {ar: 'منذ ٢٠٠١'}}}},
  ];

  for (const data of sections) {
    const parsed = updateSiteSchema.safeParse({revision: 1, data});

    assert.equal(parsed.success, true, `${JSON.stringify(data)} should be accepted`);
  }
});

test('the revision must be a non-negative integer', () => {
  for (const revision of [-1, 1.5, '1']) {
    assert.equal(
      updateSiteSchema.safeParse({revision, data: {}}).success,
      false,
      `revision ${revision} should be rejected`
    );
  }
});

test('text longer than the field limit is rejected with a message code', () => {
  const long = (max) => 'x'.repeat(max + 1);
  const cases = [
    {profile: {companyName: {en: long(SITE_TEXT_LIMITS.companyName)}}},
    {profile: {category: {ar: long(SITE_TEXT_LIMITS.category)}}},
    {profile: {description: {en: long(SITE_TEXT_LIMITS.description)}}},
    {profile: {contact: {address: {ar: long(SITE_TEXT_LIMITS.address)}}}},
    {profile: {contact: {workingHours: {en: long(SITE_TEXT_LIMITS.address)}}}},
    {pageCopy: {about: {introduction: {en: long(SITE_TEXT_LIMITS.about)}}}},
    {pageCopy: {about: {story: {ar: long(SITE_TEXT_LIMITS.about)}}}},
  ];

  for (const data of cases) {
    const parsed = updateSiteSchema.safeParse({revision: 0, data});

    assert.equal(parsed.success, false, `${JSON.stringify(data).slice(0, 60)} should be rejected`);
    if (!parsed.success) {
      assert.equal(
        parsed.error.issues.some((issue) => issue.message === 'siteSetup.validation.maxLength'),
        true
      );
    }
  }
});

test('list items and list size have their own limits', () => {
  const longItem = updateSiteSchema.safeParse({
    revision: 0,
    data: {profile: {services: [{en: 'x'.repeat(SITE_TEXT_LIMITS.listItem + 1), ar: ''}]}},
  });
  const tooManyServices = updateSiteSchema.safeParse({
    revision: 0,
    data: {
      profile: {
        services: Array.from({length: SITE_TEXT_LIMITS.services + 1}, () => ({en: 'Sales', ar: ''})),
      },
    },
  });
  const tooManyFeatures = updateSiteSchema.safeParse({
    revision: 0,
    data: {
      profile: {
        features: Array.from({length: SITE_TEXT_LIMITS.features + 1}, () => ({en: 'Fast', ar: ''})),
      },
    },
  });

  assert.equal(longItem.success, false);
  assert.equal(tooManyServices.success, false);
  assert.equal(tooManyFeatures.success, false);
  if (!tooManyServices.success) {
    assert.equal(
      tooManyServices.error.issues.some(
        (issue) => issue.message === 'siteSetup.validation.listTooMany'
      ),
      true
    );
  }
});

test('language preferences must name at least one language', () => {
  const parsed = updateSiteSchema.safeParse({
    revision: 0,
    data: {profile: {languagePreferences: []}},
  });

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.equal(
      parsed.error.issues.some(
        (issue) => issue.message === 'siteSetup.validation.languageRequired'
      ),
      true
    );
  }
});

test('only http and https URLs are accepted for the logo', () => {
  for (const logoUrl of ['https://example.com/logo.png', 'http://example.com/a.png', '']) {
    assert.equal(
      updateSiteSchema.safeParse({revision: 0, data: {profile: {logoUrl}}}).success,
      true,
      `${logoUrl} should be accepted`
    );
  }

  for (const logoUrl of ['ftp://example.com/logo.png', 'javascript:alert(1)', 'example.com']) {
    assert.equal(
      updateSiteSchema.safeParse({revision: 0, data: {profile: {logoUrl}}}).success,
      false,
      `${logoUrl} should be rejected`
    );
  }
});

test('email and phone stay lenient but reject obvious nonsense', () => {
  const email = (value) =>
    updateSiteSchema.safeParse({revision: 0, data: {profile: {contact: {email: value}}}}).success;
  const phone = (value) =>
    updateSiteSchema.safeParse({revision: 0, data: {profile: {contact: {phone: value}}}}).success;

  assert.equal(email('hello@example.com'), true);
  assert.equal(email(''), true);
  assert.equal(email('not-an-email'), false);
  assert.equal(phone('+20 100 000 0000'), true);
  assert.equal(phone('(0555) 123-4567'), true);
  assert.equal(phone(''), true);
  assert.equal(phone('call me'), false);
});

test('text is trimmed and newlines are normalised', () => {
  const parsed = updateSiteSchema.safeParse({
    revision: 0,
    data: {
      profile: {
        companyName: {en: '  Crown & Stone  '},
        description: {ar: 'سطر\r\nثانٍ'},
        services: [{en: ' Sales ', ar: '\r\nالبيع'}],
      },
    },
  });

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.deepEqual(parsed.data.data.profile?.companyName, {en: 'Crown & Stone'});
    assert.deepEqual(parsed.data.data.profile?.description, {ar: 'سطر\nثانٍ'});
    assert.deepEqual(parsed.data.data.profile?.services, [{en: 'Sales', ar: 'البيع'}]);
  }
});

test('unknown keys are rejected at every level', () => {
  const cases = [
    {revision: 0, data: {}, ownerUserId: 'someone-else'},
    {revision: 0, data: {}, siteId: 'someone-elses-site'},
    {revision: 0, data: {profile: {companyName: {en: 'A'}}, projects: []}},
    {revision: 0, data: {profile: {companyName: {en: 'A'}, slug: 'taken'}}},
    {revision: 0, data: {profile: {services: [{id: 'from-the-client', en: 'Sales', ar: ''}]}}},
    {revision: 0, data: {pageCopy: {about: {introduction: {en: 'A'}, extra: ''}}}},
  ];

  for (const payload of cases) {
    const parsed = updateSiteSchema.safeParse(payload);

    assert.equal(parsed.success, false, `${JSON.stringify(payload)} should be rejected`);
    if (!parsed.success) {
      assert.equal(
        parsed.error.issues.some((issue) => issue.code === 'unrecognized_keys'),
        true
      );
    }
  }
});
