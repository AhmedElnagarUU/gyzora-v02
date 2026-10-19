import {getS3Env} from '@/shared/config/env';

export function getPublicImageUrl(key: string): string {
  const {publicBaseUrl} = getS3Env();

  return `${publicBaseUrl}/${key.replace(/^\/+/, '')}`;
}
