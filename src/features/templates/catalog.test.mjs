import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTemplate,
  getTemplatePage,
  isTemplateId,
  TEMPLATES,
} from './catalog.ts';
import {
  getLocalizedText,
  getTextDirection,
  getVisibleProjects,
} from './render/localized.ts';

const EXPECTED_TEMPLATE_IDS = [
  'atelier',
  'modern-build',
  'urban-estate',
  'interior-calm',
  'craft-studio',
];
const EXPECTED_PAGE_IDS = [
  'home',
  'about',
  'services',
  'projects',
  'project-details',
  'contact',
];
const EXPECTED_HOME_SECTIONS = [
  'hero',
  'introduction',
  'services',
  'featured-projects',
  'capabilities',
  'process',
  'call-to-action',
  'contact-summary',
];
const SUPPORTED_SECTION_TYPES = new Set([
  'hero',
  'introduction',
  'services',
  'featured-projects',
  'capabilities',
  'process',
  'call-to-action',
  'contact-summary',
  'story',
  'service-list',
  'project-list',
  'project-hero',
  'project-description',
  'project-gallery',
  'contact-methods',
]);

test('catalog exposes exactly the five supported IDs', () => {
  assert.deepEqual(TEMPLATES.map((template) => template.id), EXPECTED_TEMPLATE_IDS);
  for (const template of TEMPLATES) {
    assert.equal(isTemplateId(template.id), true);
    assert.equal(template.name.en.length > 0, true);
    assert.equal(template.name.ar.length > 0, true);
    assert.notEqual(template.name.ar, template.name.en);
    assert.equal(template.summary.en.length > 0, true);
    assert.equal(template.summary.ar.length > 0, true);
    assert.notEqual(template.summary.ar, template.summary.en);
  }
  assert.equal(getTemplate('unknown'), null);
});

test('every template uses the shared six-page plan and ordered home sections', () => {
  for (const template of TEMPLATES) {
    assert.deepEqual(template.pages.map((page) => page.id), EXPECTED_PAGE_IDS);
    assert.deepEqual(
      getTemplatePage(template, 'home')?.sections.map((section) => section.type),
      EXPECTED_HOME_SECTIONS
    );
    assert.equal(getTemplatePage(template, 'about')?.sections.length, 3);
    assert.equal(getTemplatePage(template, 'services')?.sections.length, 2);
    assert.equal(getTemplatePage(template, 'projects')?.sections.length, 2);
    assert.equal(getTemplatePage(template, 'project-details')?.sections.length, 3);
    assert.equal(getTemplatePage(template, 'contact')?.sections.length, 2);
    for (const page of template.pages) {
      for (const section of page.sections) {
        assert.equal(SUPPORTED_SECTION_TYPES.has(section.type), true);
      }
    }
  }
});

test('catalog definitions and nested layout data are immutable and contain no customer content', () => {
  const atelier = getTemplate('atelier');
  assert.ok(atelier);
  const originalStyle = atelier.style;
  const customerSite = {profile: {companyName: {en: 'Customer', ar: 'العميل'}}};
  customerSite.profile.companyName.en = 'Updated customer';

  assert.equal(customerSite.profile.companyName.en, 'Updated customer');
  assert.equal(atelier.style, originalStyle);
  assert.equal('profile' in atelier, false);

  for (const template of TEMPLATES) {
    assert.equal(Object.isFrozen(template), true);
    assert.equal(Object.isFrozen(template.style), true);
    assert.equal(Object.isFrozen(template.summary), true);
    assert.equal(Object.isFrozen(template.pages), true);
    assert.equal('profile' in template, false);
    assert.equal('projects' in template, false);

    for (const page of template.pages) {
      assert.equal(Object.isFrozen(page), true);
      assert.equal(Object.isFrozen(page.sections), true);
      for (const section of page.sections) {
        assert.equal(Object.isFrozen(section), true);
        assert.equal(Object.isFrozen(section.fieldIds), true);
        assert.equal(Object.isFrozen(section.imageSlotIds), true);
      }
    }
  }
});

test('localized values are explicit and never fall back to another language', () => {
  const copy = {en: 'English copy', ar: ''};
  assert.equal(getLocalizedText(copy, 'en'), 'English copy');
  assert.equal(getLocalizedText(copy, 'ar'), '');
  assert.equal(getLocalizedText(undefined, 'ar'), '');
  assert.equal(getTextDirection('en'), 'ltr');
  assert.equal(getTextDirection('ar'), 'rtl');
});

test('projects without a title in the active locale are omitted', () => {
  const projects = [
    {id: 'one', title: {en: 'English title', ar: ''}, description: {en: '', ar: ''}},
    {id: 'two', title: {en: 'Title', ar: 'عنوان'}, description: {en: '', ar: ''}},
  ];

  assert.deepEqual(getVisibleProjects(projects, 'en').map((project) => project.id), [
    'one',
    'two',
  ]);
  assert.deepEqual(getVisibleProjects(projects, 'ar').map((project) => project.id), ['two']);
  assert.deepEqual(getVisibleProjects([], 'ar'), []);
});
