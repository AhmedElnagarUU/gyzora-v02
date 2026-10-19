import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyEdit,
  buildEdit,
  missingRequiredFields,
  normalizeDraft,
  toEditorDraft,
} from './apply-edit.ts';
import {updateSiteSchema} from './schemas/update-site-schema.ts';

const stored = {
  profile: {
    companyName: {en: 'Crown & Stone', ar: 'كراون وستون'},
    category: {en: 'Real estate', ar: 'عقارات'},
    description: {en: 'Prime developments', ar: ''},
    logoUrl: 'https://example.com/logo.png',
    contact: {
      email: 'hello@example.com',
      phone: '+20 100 000 0000',
      address: {en: 'Riyadh', ar: ''},
      workingHours: {en: 'Sun-Thu', ar: ''},
    },
    services: [
      {en: 'Sales', ar: 'البيع'},
      {en: 'Leasing', ar: ''},
    ],
    features: [{en: 'Trusted', ar: ''}],
    languagePreferences: ['en', 'ar'],
  },
  pageCopy: {
    home: {introduction: {en: 'Welcome', ar: ''}},
    about: {introduction: {en: 'We build', ar: ''}, story: {en: 'Since 2001', ar: ''}},
  },
};

const englishOnly = (data) => ({
  profile: {
    companyName: data.profile.companyName.en,
    category: data.profile.category.en,
    description: data.profile.description.en,
    logoUrl: data.profile.logoUrl,
    contact: {
      email: data.profile.contact?.email,
      phone: data.profile.contact?.phone,
      address: data.profile.contact?.address?.en,
      workingHours: data.profile.contact?.workingHours?.en,
    },
    services: data.profile.services.map((item) => item.en),
    features: data.profile.features.map((item) => item.en),
    languagePreferences: data.profile.languagePreferences,
  },
  pageCopy: {
    home: data.pageCopy?.home?.introduction?.en,
    aboutIntroduction: data.pageCopy?.about?.introduction?.en,
    aboutStory: data.pageCopy?.about?.story?.en,
  },
});

const counterIds = () => {
  let next = 0;

  return () => {
    next += 1;
    return `item-${next}`;
  };
};

test('an edit merges only the provided keys of the provided locale', () => {
  const edited = applyEdit(stored, {profile: {description: {ar: 'تطويرات'}}});

  assert.deepEqual(edited.profile.description, {en: 'Prime developments', ar: 'تطويرات'});
  assert.deepEqual(edited.profile.services, stored.profile.services);
  assert.equal(edited.pageCopy, stored.pageCopy);
});

test('editing the Arabic values never changes the English values', () => {
  const edited = applyEdit(stored, {
    profile: {
      companyName: {ar: 'كراون وستون العقارية'},
      category: {ar: 'عقارات'},
      contact: {address: {ar: 'الرياض'}},
      services: [
        {en: 'Sales', ar: 'البيع'},
        {en: 'Leasing', ar: 'التأجير'},
      ],
    },
    pageCopy: {about: {story: {ar: 'منذ ٢٠٠١'}}},
  });

  assert.deepEqual(englishOnly(edited), englishOnly(stored));
});

test('an edit that is empty leaves the stored data exactly as it was', () => {
  assert.deepEqual(applyEdit(stored, {}), stored);
});

test('clearing one locale keeps the other locale and stays valid', () => {
  const edited = applyEdit(stored, {profile: {companyName: {en: ''}}});

  assert.deepEqual(edited.profile.companyName, {en: '', ar: 'كراون وستون'});
  assert.deepEqual(missingRequiredFields(edited), {});
});

test('a company name and category that are empty in both locales are reported', () => {
  const edited = applyEdit(stored, {
    profile: {companyName: {en: '', ar: ''}, category: {en: '', ar: ''}},
  });

  assert.deepEqual(missingRequiredFields(edited), {
    'profile.companyName': 'siteSetup.validation.companyNameMin',
    'profile.category': 'siteSetup.validation.categoryMin',
  });
});

test('lists replace the stored order and keep both locales', () => {
  const edited = applyEdit(stored, {
    profile: {
      services: [
        {en: 'Leasing', ar: 'التأجير'},
        {en: 'Sales', ar: 'البيع'},
      ],
      features: [{en: 'Trusted', ar: 'موثوق'}],
    },
  });

  assert.deepEqual(edited.profile.services, [
    {en: 'Leasing', ar: 'التأجير'},
    {en: 'Sales', ar: 'البيع'},
  ]);
  assert.deepEqual(edited.profile.features, [{en: 'Trusted', ar: 'موثوق'}]);
});

test('cleared optional contact details and logo drop out of the stored data', () => {
  const edited = applyEdit(stored, {
    profile: {
      logoUrl: '',
      contact: {email: '', phone: '', address: {en: ''}, workingHours: {en: ''}},
    },
  });

  assert.equal(edited.profile.logoUrl, undefined);
  assert.equal(edited.profile.contact?.email, undefined);
  assert.equal(edited.profile.contact?.phone, undefined);
  assert.deepEqual(edited.profile.contact?.address, {en: '', ar: ''});
});

test('about copy merges per locale and keeps the other page copy', () => {
  const edited = applyEdit(stored, {
    pageCopy: {about: {introduction: {ar: 'نبني'}}},
  });

  assert.deepEqual(edited.pageCopy?.about, {
    introduction: {en: 'We build', ar: 'نبني'},
    story: {en: 'Since 2001', ar: ''},
  });
  assert.deepEqual(edited.pageCopy?.home, stored.pageCopy.home);
});

test('a validated partial from the schema is accepted by applyEdit', () => {
  const parsed = updateSiteSchema.safeParse({
    revision: 2,
    data: {profile: {companyName: {ar: '  كراون  '}}},
  });

  assert.equal(parsed.success, true);
  if (!parsed.success) return;

  const edited = applyEdit(stored, parsed.data.data);

  assert.deepEqual(edited.profile.companyName, {en: 'Crown & Stone', ar: 'كراون'});
});

test('the editor draft round-trips every editable field', () => {
  const draft = toEditorDraft(stored, counterIds());

  assert.deepEqual(draft.services, [
    {id: 'item-1', en: 'Sales', ar: 'البيع'},
    {id: 'item-2', en: 'Leasing', ar: ''},
  ]);
  assert.equal(draft.email, 'hello@example.com');
  assert.equal(draft.aboutStory.en, 'Since 2001');
  assert.deepEqual(draft.languagePreferences, ['en', 'ar']);
});

test('an unchanged draft produces an empty edit', () => {
  const draft = toEditorDraft(stored, counterIds());

  assert.deepEqual(buildEdit(draft, draft), {});
});

test('changing one locale in the draft sends only that locale', () => {
  const draft = toEditorDraft(stored, counterIds());
  const edited = {
    ...draft,
    companyName: {...draft.companyName, ar: 'كراون'},
    aboutStory: {...draft.aboutStory, ar: 'منذ ٢٠٠١'},
  };

  assert.deepEqual(buildEdit(edited, draft), {
    profile: {companyName: {ar: 'كراون'}},
    pageCopy: {about: {story: {ar: 'منذ ٢٠٠١'}}},
  });
});

test('list edits are sent whole without the editor item ids', () => {
  const draft = toEditorDraft(stored, counterIds());
  const edited = {
    ...draft,
    services: [...draft.services, {id: 'item-3', en: 'Consulting', ar: 'استشارات'}],
  };
  const payload = buildEdit(edited, draft);

  assert.deepEqual(payload.profile?.services, [
    {en: 'Sales', ar: 'البيع'},
    {en: 'Leasing', ar: ''},
    {en: 'Consulting', ar: 'استشارات'},
  ]);
  assert.equal(JSON.stringify(payload).includes('"id"'), false);
});

test('normalizing a draft after a save keeps the ids and trims the text', () => {
  const draft = toEditorDraft(stored, counterIds());
  const normalized = normalizeDraft({
    ...draft,
    companyName: {en: '  Crown & Stone  ', ar: 'كراون وستون'},
    aboutStory: {en: 'Since\r\n2001', ar: ''},
    services: [{id: 'item-9', en: ' Sales ', ar: ' البيع '}],
  });

  assert.deepEqual(normalized.companyName, {en: 'Crown & Stone', ar: 'كراون وستون'});
  assert.deepEqual(normalized.aboutStory, {en: 'Since\n2001', ar: ''});
  assert.deepEqual(normalized.services, [{id: 'item-9', en: 'Sales', ar: 'البيع'}]);
  assert.deepEqual(buildEdit(normalized, normalized), {});
});
