import assert from 'node:assert/strict';
import test from 'node:test';
import {toRenderData} from './to-render-data.ts';

const stored = {
  profile: {
    companyName: {en: 'Crown & Stone', ar: 'كراون وستون'},
    category: {en: 'Real estate', ar: ''},
    description: {en: 'Prime developments', ar: ''},
    services: [{en: 'Sales', ar: ''}],
    features: [],
    languagePreferences: ['en', 'ar'],
  },
  pageCopy: {home: {introduction: {en: 'Welcome', ar: ''}}},
};

test('render data keeps each locale exactly as stored', () => {
  const data = toRenderData(stored);

  assert.deepEqual(data.profile.companyName, {en: 'Crown & Stone', ar: 'كراون وستون'});
  assert.deepEqual(data.profile.category, {en: 'Real estate', ar: ''});
  assert.equal(data.pageCopy?.home?.introduction?.en, 'Welcome');
  assert.equal(data.pageCopy?.home?.introduction?.ar, '');
});

test('missing optional content stays missing and projects default to empty', () => {
  const data = toRenderData({
    profile: {
      companyName: {en: 'Studio', ar: ''},
      category: {en: '', ar: ''},
      description: {en: '', ar: ''},
      services: [],
      features: [],
      languagePreferences: ['en'],
    },
  });

  assert.equal(data.profile.contact, undefined);
  assert.equal(data.profile.logoUrl, undefined);
  assert.equal(data.pageCopy, undefined);
  assert.deepEqual(data.projects, []);
});

test('projects are passed through without mutating the stored input', () => {
  const before = JSON.stringify(stored);
  const projects = [{id: 'villa-1', title: {en: 'Villa', ar: ''}, description: {en: '', ar: ''}}];

  const data = toRenderData(stored, projects);

  assert.deepEqual(data.projects, projects);
  assert.notEqual(data, stored);
  assert.notEqual(data.projects, projects);
  assert.equal(JSON.stringify(stored), before);
});
