export const IMAGE_KINDS = ['logo', 'cover', 'gallery'] as const;
export type ImageKind = (typeof IMAGE_KINDS)[number];

export const IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type ImageContentType = (typeof IMAGE_CONTENT_TYPES)[number];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const EXTENSIONS: Record<ImageContentType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

export const IMAGE_KEY_PATTERN =
  /^sites\/[0-9a-f]{24}\/(?:logo|cover|gallery)\/[0-9a-f-]{36}\.(?:jpg|png|webp)$/;

const KEY_PATTERN =
  /^sites\/([0-9a-f]{24})\/(logo|cover|gallery)\/([0-9a-f-]{36})\.(jpg|png|webp)$/;

export function isImageKind(value: string): value is ImageKind {
  return (IMAGE_KINDS as readonly string[]).includes(value);
}

export function isImageContentType(value: string): value is ImageContentType {
  return (IMAGE_CONTENT_TYPES as readonly string[]).includes(value);
}

export function extensionForContentType(value: string): string | null {
  return isImageContentType(value) ? EXTENSIONS[value] : null;
}

export function buildKey(siteId: string, kind: ImageKind, extension: string): string {
  const ext = extension === 'jpeg' ? 'jpg' : extension;

  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    throw new Error(`Unsupported image extension: ${ext}`);
  }

  return `sites/${siteId}/${kind}/${crypto.randomUUID()}.${ext}`;
}

export interface ParsedImageKey {
  siteId: string;
  kind: ImageKind;
  extension: string;
}

export function parseKey(key: string): ParsedImageKey | null {
  const match = KEY_PATTERN.exec(key);

  if (!match) return null;

  return {
    siteId: match[1],
    kind: match[2] as ImageKind,
    extension: match[4],
  };
}

export function isKeyOwnedBySite(key: string, siteId: string): boolean {
  const parsed = parseKey(key);

  return parsed !== null && parsed.siteId === siteId;
}
