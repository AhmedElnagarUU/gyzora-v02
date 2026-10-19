import {S3Client} from '@aws-sdk/client-s3';

import {getS3Env} from '@/shared/config/env';

let client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (client) return client;

  const env = getS3Env();

  client = new S3Client({
    region: env.region,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
    ...(env.endpoint ? {endpoint: env.endpoint} : {}),
    ...(env.forcePathStyle ? {forcePathStyle: true} : {}),
  });

  return client;
}
