import {DeleteObjectsCommand} from '@aws-sdk/client-s3';

import {getS3Env} from '@/shared/config/env';

import {getS3Client} from './s3-client';

export function snapshotImageKeys(published: unknown): Set<string> {
  if (typeof published !== 'object' || published === null) return new Set();

  const snapshot = published as {imageKeys?: unknown; projects?: unknown};
  const keys = imageKeysFrom(snapshot.imageKeys);

  if (Array.isArray(snapshot.projects)) {
    for (const project of snapshot.projects) {
      if (typeof project !== 'object' || project === null) continue;

      const record = project as {coverImage?: unknown; gallery?: unknown};
      keys.push(...imageKeysFrom(record.coverImage), ...imageKeysFrom(record.gallery));
    }
  }

  return new Set(keys);
}

function imageKeysFrom(value: unknown): string[] {
  if (typeof value === 'string') return [value];

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const key = (value as {key?: unknown}).key;

    return typeof key === 'string' ? [key] : [];
  }

  if (!Array.isArray(value)) return [];

  return value.flatMap(imageKeysFrom);
}

export async function deleteImageKeys(keys: readonly string[]): Promise<void> {
  const unique = [...new Set(keys.filter((key) => key.length > 0))];

  if (unique.length === 0) return;

  try {
    const {bucket} = getS3Env();

    await getS3Client().send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {Objects: unique.map((Key) => ({Key})), Quiet: true},
      })
    );
  } catch (error) {
    console.error(
      'Failed to delete image keys:',
      error instanceof Error ? error.message : 'unknown error'
    );
  }
}

export async function deleteImageKey(key: string): Promise<void> {
  await deleteImageKeys([key]);
}
