import {PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

import {getS3Env} from '@/shared/config/env';
import {AppError} from '@/shared/http/app-error';

import {
  buildKey,
  extensionForContentType,
  isImageKind,
  MAX_IMAGE_BYTES,
  type ImageKind,
} from './keys';
import {getS3Client} from './s3-client';

const PRESIGN_EXPIRES_SECONDS = 5 * 60;

export interface PresignInput {
  siteId: string;
  kind: string;
  contentType: string;
  size: number;
}

export interface PresignedUpload {
  uploadUrl: string;
  key: string;
  headers: Record<string, string>;
}

export async function presignUpload(input: PresignInput): Promise<PresignedUpload> {
  if (!isImageKind(input.kind)) {
    throw new AppError('UPLOAD_REJECTED', 400, {kind: 'invalid_format'});
  }

  const extension = extensionForContentType(input.contentType);

  if (!extension) {
    throw new AppError('UPLOAD_REJECTED', 400, {contentType: 'invalid_format'});
  }

  if (!Number.isInteger(input.size) || input.size <= 0 || input.size > MAX_IMAGE_BYTES) {
    throw new AppError('UPLOAD_REJECTED', 400, {size: 'too_big'});
  }

  const kind: ImageKind = input.kind;
  const key = buildKey(input.siteId, kind, extension);
  const {bucket} = getS3Env();
  const uploadUrl = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({Bucket: bucket, Key: key, ContentType: input.contentType}),
    {expiresIn: PRESIGN_EXPIRES_SECONDS}
  );

  return {
    uploadUrl,
    key,
    headers: {'Content-Type': input.contentType},
  };
}
