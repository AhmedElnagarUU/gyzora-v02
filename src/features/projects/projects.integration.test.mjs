import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {registerHooks} from 'node:module';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// Mirrors the S3 integration tests: app code uses the `@/` alias and
// extensionless relative imports, so those two rules are registered for
// `node --test`.
registerHooks({
  resolve(specifier, context, nextResolve) {
    const hasExtension = /\.[cm]?[jt]s$/.test(specifier);

    if (specifier.startsWith('@/')) {
      const target = specifier.slice(2) + (hasExtension ? '' : '.ts');
      return {
        url: new URL(`../../../src/${target}`, import.meta.url).href,
        shortCircuit: true,
      };
    }

    if (/^\.\.?\//.test(specifier) && !hasExtension) {
      const candidate = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(candidate))) {
        return {url: candidate.href, shortCircuit: true};
      }
    }

    return nextResolve(specifier, context);
  },
});

const testUrl = process.env.MONGODB_TEST_URL;
const skipWithoutTestDb = testUrl ? false : 'SKIPPED: MONGODB_TEST_URL not set';

function wizardValues(companyName) {
  return {
    companyName,
    category: 'Testing',
    description: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    services: '',
    features: '',
    languagePreferences: [],
    locale: 'en',
    templateId: 'atelier',
  };
}

function projectValues(title, extra = {}) {
  return {
    title: {en: title, ar: ''},
    description: {en: '', ar: ''},
    category: {en: '', ar: ''},
    location: {en: '', ar: ''},
    coverImage: null,
    gallery: [],
    metadata: {},
    featured: false,
    ...extra,
  };
}

function fakeDeps(removed = []) {
  return {
    verifyKey: async () => {},
    removeKeys: async (keys) => {
      removed.push(...keys);
    },
  };
}

async function withData(ownerUserIds, run) {
  process.env.NODE_ENV = 'test';

  const {getDatabase} = await import('@/shared/db/mongodb');
  const mongoose = (await import('mongoose')).default;

  try {
    await run();
  } finally {
    const db = await getDatabase();
    const sites = await db
      .collection('sites')
      .find({ownerUserId: {$in: ownerUserIds}})
      .toArray();
    const siteIds = sites.map((site) => site._id);

    if (siteIds.length) {
      await db.collection('projects').deleteMany({siteId: {$in: siteIds}});
    }

    await db.collection('sites').deleteMany({ownerUserId: {$in: ownerUserIds}});
    await mongoose.disconnect();
  }
}

test(
  'user B cannot read, update or delete user A project',
  {skip: skipWithoutTestDb},
  async () => {
    const ownerA = `s4-isolation-a-${Date.now()}`;
    const ownerB = `s4-isolation-b-${Date.now()}`;

    await withData([ownerA, ownerB], async () => {
      const {createSiteForOwner} = await import('@/features/sites/service');
      const {
        createProjectForOwner,
        deleteProjectForOwner,
        getProjectForOwner,
        updateProjectForOwner,
      } = await import('./service.ts');
      const {AppError} = await import('@/shared/http/app-error');

      await createSiteForOwner(ownerA, wizardValues('Isolation Owner A'));
      await createSiteForOwner(ownerB, wizardValues('Isolation Owner B'));

      const project = await createProjectForOwner(
        ownerA,
        projectValues('Private Villa'),
        fakeDeps()
      );

      const calls = [
        () => getProjectForOwner(ownerB, project.id),
        () => updateProjectForOwner(ownerB, project.id, projectValues('Hijacked'), fakeDeps()),
        () => deleteProjectForOwner(ownerB, project.id, fakeDeps()),
      ];

      for (const call of calls) {
        await assert.rejects(
          call,
          (error) => error instanceof AppError && error.code === 'NOT_FOUND' && error.status === 404
        );
      }

      const stored = await getProjectForOwner(ownerA, project.id);

      assert.equal(stored.title.en, 'Private Villa');
    });
  }
);

test(
  'a key owned by another site is rejected',
  {skip: skipWithoutTestDb},
  async () => {
    const ownerA = `s4-foreign-a-${Date.now()}`;
    const ownerB = `s4-foreign-b-${Date.now()}`;

    await withData([ownerA, ownerB], async () => {
      const {createSiteForOwner, getSiteForOwner} = await import('@/features/sites/service');
      const {createProjectForOwner} = await import('./service.ts');
      const {buildKey} = await import('@/features/images/keys.ts');
      const {AppError} = await import('@/shared/http/app-error');

      await createSiteForOwner(ownerA, wizardValues('Foreign Key Owner A'));
      await createSiteForOwner(ownerB, wizardValues('Foreign Key Owner B'));

      const siteB = await getSiteForOwner(ownerB);
      const foreignKey = buildKey(siteB._id.toString(), 'cover', 'jpg');

      await assert.rejects(
        () =>
          createProjectForOwner(
            ownerA,
            projectValues('Foreign Key Project', {
              coverImage: {key: foreignKey, alt: {en: '', ar: ''}},
            })
          ),
        (error) => error instanceof AppError && error.code === 'UPLOAD_REJECTED'
      );
    });
  }
);

test(
  'the seventh featured project is rejected',
  {skip: skipWithoutTestDb},
  async () => {
    const owner = `s4-featured-${Date.now()}`;

    await withData([owner], async () => {
      const {createSiteForOwner} = await import('@/features/sites/service');
      const {createProjectForOwner} = await import('./service.ts');
      const {AppError} = await import('@/shared/http/app-error');

      await createSiteForOwner(owner, wizardValues('Featured Limit Company'));

      for (let index = 0; index < 6; index += 1) {
        await createProjectForOwner(
          owner,
          projectValues(`Featured Project ${index}`, {featured: true}),
          fakeDeps()
        );
      }

      await assert.rejects(
        () =>
          createProjectForOwner(
            owner,
            projectValues('Seventh Featured Project', {featured: true}),
            fakeDeps()
          ),
        (error) =>
          error instanceof AppError &&
          error.code === 'VALIDATION_FAILED' &&
          error.fields?.featured === 'projects.validation.featuredLimit'
      );
    });
  }
);

test(
  'deleting a project keeps keys referenced by the published snapshot',
  {skip: skipWithoutTestDb},
  async () => {
    const owner = `s4-snapshot-${Date.now()}`;

    await withData([owner], async () => {
      const {createSiteForOwner, getSiteForOwner} = await import('@/features/sites/service');
      const {createProjectForOwner, deleteProjectForOwner} = await import('./service.ts');
      const {buildKey} = await import('@/features/images/keys.ts');
      const {getDatabase} = await import('@/shared/db/mongodb');

      await createSiteForOwner(owner, wizardValues('Snapshot Company'));
      const site = await getSiteForOwner(owner);
      const siteId = site._id.toString();
      const coverKey = buildKey(siteId, 'cover', 'jpg');
      const galleryKey = buildKey(siteId, 'gallery', 'png');

      const project = await createProjectForOwner(
        owner,
        projectValues('Snapshot Villa', {
          coverImage: {key: coverKey, alt: {en: '', ar: ''}},
          gallery: [{key: galleryKey, alt: {en: '', ar: ''}}],
        }),
        fakeDeps()
      );

      const db = await getDatabase();
      await db.collection('sites').updateOne(
        {ownerUserId: owner},
        {
          $set: {
            published: {
              imageKeys: [coverKey],
              projects: [{coverImage: {key: coverKey, alt: {en: '', ar: ''}}, gallery: []}],
            },
          },
        }
      );

      const removed = [];
      await deleteProjectForOwner(owner, project.id, fakeDeps(removed));

      assert.deepEqual(removed, [galleryKey]);
    });
  }
);
