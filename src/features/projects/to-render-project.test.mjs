import assert from 'node:assert/strict';
import test from 'node:test';

import {toRenderProject} from './to-render-project.ts';

const publicUrl = (key) => `https://cdn.example.com/${key}`;

function project(extra = {}) {
  return {
    slug: 'villa-cairo',
    title: {en: 'Villa Cairo', ar: 'فيلا القاهرة'},
    description: {en: 'A family villa.', ar: ''},
    category: {en: 'Residential', ar: ''},
    location: {en: 'Cairo', ar: ''},
    coverImage: {
      key: 'sites/64b7c1f2a1b2c3d4e5f60718/cover/a.jpg',
      alt: {en: 'Facade', ar: ''},
    },
    gallery: [
      {
        key: 'sites/64b7c1f2a1b2c3d4e5f60718/gallery/b.jpg',
        alt: {en: '', ar: ''},
      },
    ],
    metadata: {year: 2024, areaSqm: 5400, client: 'Private'},
    ...extra,
  };
}

test('maps a stored project to the renderer contract', () => {
  const rendered = toRenderProject(project(), publicUrl);

  assert.equal(rendered.id, 'villa-cairo');
  assert.equal(rendered.year, '2024');
  assert.deepEqual(rendered.area, {en: '5,400 m²', ar: '5,400 م²'});
  assert.equal(rendered.coverImage.src, publicUrl(project().coverImage.key));
  assert.equal(rendered.coverImage.alt.en, 'Facade');
  assert.equal(rendered.gallery.length, 1);
});

test('empty image alt text falls back to the project title in each locale', () => {
  const rendered = toRenderProject(project(), publicUrl);

  assert.deepEqual(rendered.gallery[0].alt, {
    en: 'Villa Cairo',
    ar: 'فيلا القاهرة',
  });
  assert.deepEqual(rendered.coverImage.alt, {en: 'Facade', ar: 'فيلا القاهرة'});
});

test('a project without images, year or area renders without them', () => {
  const rendered = toRenderProject(
    project({coverImage: null, gallery: [], metadata: {}}),
    publicUrl
  );

  assert.equal(rendered.coverImage, undefined);
  assert.deepEqual(rendered.gallery, []);
  assert.equal(rendered.year, undefined);
  assert.equal(rendered.area, undefined);
});
