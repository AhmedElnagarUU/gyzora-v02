import {HeadObjectCommand} from '@aws-sdk/client-s3';

import {getS3Env} from '@/shared/config/env';
import {AppError} from '@/shared/http/app-error';

import {deleteImageKey} from './delete-keys';
import {isImageContentType, isKeyOwnedBySite, MAX_IMAGE_BYTES} from './keys';
import {getS3Client} from './s3-client';

function rejected(field: string): AppError {
  return new AppError('UPLOAD_REJECTED', 400, {
    [field]: 'projects.validation.uploadRejected',
  });
}

export async function verifyUploadedKey(
  key: string,
  siteId: string,
  field = 'key'
): Promise<void> {
  if (!isKeyOwnedBySite(key, siteId)) {
    throw rejected(field);
  }

  const {bucket} = getS3Env();

  let contentType: string;
  let contentLength: number;

  try {
    const head = await getS3Client().send(new HeadObjectCommand({Bucket: bucket, Key: key}));
    contentType = head.ContentType ?? '';
    contentLength = head.ContentLength ?? 0;
  } catch {
    throw rejected(field);
  }

  if (!isImageContentType(contentType) || contentLength <= 0 || contentLength > MAX_IMAGE_BYTES) {
    await deleteImageKey(key);
    throw rejected(field);
  }
}
