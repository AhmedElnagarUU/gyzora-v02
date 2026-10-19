import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {registerHooks} from 'node:module';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

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

const SITE_ID = '64b7c1f2a1b2c3d4e5f60718';
const OTHER_SITE_ID = '64b7c1f2a1b2c3d4e5f60719';

test('a key under another site prefix is rejected before any bucket call', async () => {
  const {verifyUploadedKey} = await import('./verify-upload.ts');
  const {AppError} = await import('@/shared/http/app-error');
  const foreignKey = `sites/${OTHER_SITE_ID}/cover/3f2504e0-4f89-41d3-9a0c-0305e82c3301.jpg`;

  await assert.rejects(
    () => verifyUploadedKey(foreignKey, SITE_ID, 'coverImage.key'),
    (error) =>
      error instanceof AppError &&
      error.code === 'UPLOAD_REJECTED' &&
      error.status === 400 &&
      error.fields?.['coverImage.key'] === 'projects.validation.uploadRejected'
  );
});

test('a malformed key is rejected before any bucket call', async () => {
  const {verifyUploadedKey} = await import('./verify-upload.ts');
  const {AppError} = await import('@/shared/http/app-error');

  for (const key of ['https://example.com/a.jpg', 'sites/not-an-id/cover/a.jpg', '']) {
    await assert.rejects(
      () => verifyUploadedKey(key, SITE_ID),
      (error) => error instanceof AppError && error.code === 'UPLOAD_REJECTED'
    );
  }
});
