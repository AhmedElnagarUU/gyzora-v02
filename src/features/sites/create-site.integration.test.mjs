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

test(
  'concurrent site creation for the same owner creates exactly one site',
  {skip: testUrl ? false : 'SKIPPED: MONGODB_TEST_URL not set'},
  async () => {
    process.env.NODE_ENV = 'test';

    const {createSiteForOwner} = await import('./service.ts');
    const {getDatabase} = await import('@/shared/db/mongodb');
    const {AppError} = await import('@/shared/http/app-error');
    const mongoose = (await import('mongoose')).default;

    const ownerUserId = `s0-integration-${Date.now()}`;
    const values = {
      companyName: 'Integration Test Company',
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

    try {
      const results = await Promise.allSettled([
        createSiteForOwner(ownerUserId, values),
        createSiteForOwner(ownerUserId, values)
      ]);

      const fulfilled = results.filter((result) => result.status === 'fulfilled');
      const rejected = results.filter((result) => result.status === 'rejected');

      assert.equal(fulfilled.length, 1, 'exactly one creation should succeed');
      assert.equal(rejected.length, 1, 'exactly one creation should fail');
      assert.ok(rejected[0].reason instanceof AppError, 'the failure should be an AppError');
      assert.equal(rejected[0].reason.code, 'SITE_ALREADY_EXISTS');
      assert.equal(rejected[0].reason.status, 409);

      const db = await getDatabase();
      const sites = await db.collection('sites').countDocuments({ownerUserId});

      assert.equal(sites, 1, 'only one site should be stored for the owner');
    } finally {
      const db = await getDatabase();
      await db.collection('sites').deleteMany({ownerUserId});
      await mongoose.disconnect();
    }
  }
);
