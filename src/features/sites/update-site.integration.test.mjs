import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {registerHooks} from 'node:module';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// App code uses the `@/` alias and extensionless relative imports (bundler
// resolution) and TypeScript parameter properties are avoided, so these two
// small rules are all that `node --test` needs to load it directly.
registerHooks({
  resolve(specifier, context, nextResolve) {
    const hasExtension = /\.[cm]?[jt]s$/.test(specifier);

    if (specifier.startsWith('@/')) {
      const target = specifier.slice(2) + (hasExtension ? '' : '.ts');
      return {
        url: new URL(`../../../src/${target}`, import.meta.url).href,
        shortCircuit: true
      };
    }

    if (/^\.\.?\//.test(specifier) && !hasExtension) {
      const candidate = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(candidate))) {
        return {url: candidate.href, shortCircuit: true};
      }
    }

    return nextResolve(specifier, context);
  }
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
    templateId: 'atelier'
  };
}

async function withSites(ownerUserIds, run) {
  process.env.NODE_ENV = 'test';

  const {getDatabase} = await import('@/shared/db/mongodb');
  const mongoose = (await import('mongoose')).default;

  try {
    await run();
  } finally {
    const db = await getDatabase();
    await db.collection('sites').deleteMany({ownerUserId: {$in: ownerUserIds}});
    await mongoose.disconnect();
  }
}

test(
  'a partial edit saves the provided locale and leaves the other locale alone',
  {skip: skipWithoutTestDb},
  async () => {
    const ownerUserId = `s3-save-${Date.now()}`;

    await withSites([ownerUserId], async () => {
      const {createSiteForOwner, getSiteForOwner, updateSiteForOwner} = await import('./service.ts');

      await createSiteForOwner(ownerUserId, wizardValues('Integration Edit Company'));
      const before = await getSiteForOwner(ownerUserId);
      const updated = await updateSiteForOwner(ownerUserId, before.revision, {
        profile: {companyName: {ar: 'شركة الاختبار'}, services: [{en: 'Sales', ar: 'البيع'}]}
      });
      const after = await getSiteForOwner(ownerUserId);

      assert.equal(updated.revision, before.revision + 1);
      assert.equal(after.revision, before.revision + 1);
      assert.deepEqual(after.data.profile.companyName, {
        en: 'Integration Edit Company',
        ar: 'شركة الاختبار'
      });
      assert.deepEqual(after.data.profile.category, {en: 'Testing', ar: ''});
      assert.deepEqual(after.data.profile.services, [{en: 'Sales', ar: 'البيع'}]);
    });
  }
);

test(
  'a stale revision is rejected and the stored draft stays unchanged',
  {skip: skipWithoutTestDb},
  async () => {
    const ownerUserId = `s3-stale-${Date.now()}`;

    await withSites([ownerUserId], async () => {
      const {createSiteForOwner, getSiteForOwner, updateSiteForOwner} = await import('./service.ts');
      const {AppError} = await import('@/shared/http/app-error');

      await createSiteForOwner(ownerUserId, wizardValues('Stale Revision Company'));
      const before = await getSiteForOwner(ownerUserId);
      await updateSiteForOwner(ownerUserId, before.revision, {
        profile: {companyName: {en: 'First save'}}
      });
      const saved = await getSiteForOwner(ownerUserId);

      await assert.rejects(
        () =>
          updateSiteForOwner(ownerUserId, before.revision, {
            profile: {companyName: {en: 'Second save from a stale tab'}}
          }),
        (error) => error instanceof AppError && error.code === 'STALE_REVISION' && error.status === 409
      );

      const after = await getSiteForOwner(ownerUserId);

      assert.deepEqual(after.data.profile.companyName, saved.data.profile.companyName);
      assert.equal(after.revision, saved.revision);
    });
  }
);

test(
  'a company name that is empty in both locales is rejected and nothing is saved',
  {skip: skipWithoutTestDb},
  async () => {
    const ownerUserId = `s3-invalid-${Date.now()}`;

    await withSites([ownerUserId], async () => {
      const {createSiteForOwner, getSiteForOwner, updateSiteForOwner} = await import('./service.ts');
      const {AppError} = await import('@/shared/http/app-error');

      await createSiteForOwner(ownerUserId, wizardValues('Required Name Company'));
      const before = await getSiteForOwner(ownerUserId);

      await assert.rejects(
        () =>
          updateSiteForOwner(ownerUserId, before.revision, {
            profile: {companyName: {en: '', ar: ''}}
          }),
        (error) =>
          error instanceof AppError &&
          error.code === 'VALIDATION_FAILED' &&
          error.status === 400 &&
          error.fields?.['profile.companyName'] === 'siteSetup.validation.companyNameMin'
      );

      const after = await getSiteForOwner(ownerUserId);

      assert.deepEqual(after.data.profile.companyName, before.data.profile.companyName);
      assert.equal(after.revision, before.revision);
    });
  }
);

test(
  'another owner can only update their own site',
  {skip: skipWithoutTestDb},
  async () => {
    const stamp = Date.now();
    const ownerUserIds = [`s3-owner-a-${stamp}`, `s3-owner-b-${stamp}`];

    await withSites(ownerUserIds, async () => {
      const {createSiteForOwner, getSiteForOwner, updateSiteForOwner} = await import('./service.ts');

      const [ownerA, ownerB] = ownerUserIds;

      await createSiteForOwner(ownerA, wizardValues('Owner A Company'));
      await createSiteForOwner(ownerB, wizardValues('Owner B Company'));

      const siteA = await getSiteForOwner(ownerA);
      const siteB = await getSiteForOwner(ownerB);

      await updateSiteForOwner(ownerA, siteA.revision, {
        profile: {companyName: {en: 'Owner A Renamed'}}
      });
      await updateSiteForOwner(ownerB, siteB.revision, {
        profile: {companyName: {en: 'Owner B Renamed'}}
      });

      const finalA = await getSiteForOwner(ownerA);
      const finalB = await getSiteForOwner(ownerB);

      assert.deepEqual(finalA.data.profile.companyName, {en: 'Owner A Renamed', ar: ''});
      assert.deepEqual(finalB.data.profile.companyName, {en: 'Owner B Renamed', ar: ''});
      assert.equal(finalA._id.toString() === finalB._id.toString(), false);
    });
  }
);
