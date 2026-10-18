const SLUG_MIN_LENGTH = 3;
const SLUG_MAX_LENGTH = 40;
const RANDOM_TOKEN_LENGTH = 6;
const RANDOM_TOKEN_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const RESERVED_SLUG_SUFFIX = '-site';
const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'auth',
  'dashboard',
  'templates',
  's',
  'www',
  'app',
  'en',
  'ar',
  'login',
  'signup',
  'static',
]);

export const MAX_SLUG_ATTEMPTS = 5;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, '');
}

export function buildSlugBase(name: string): string {
  const slug = slugify(name);

  if (slug.length < SLUG_MIN_LENGTH) return `site-${randomToken()}`;

  return RESERVED_SLUGS.has(slug) ? withSuffix(slug, RESERVED_SLUG_SUFFIX) : slug;
}

export function slugCandidate(base: string, attempt: number): string {
  return attempt === 0 ? base : withSuffix(base, `-${attempt + 1}`);
}

export async function findAvailableSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string | null> {
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt += 1) {
    const candidate = slugCandidate(base, attempt);
    if (!(await exists(candidate))) return candidate;
  }

  return null;
}

function withSuffix(base: string, suffix: string): string {
  const head = base
    .slice(0, SLUG_MAX_LENGTH - suffix.length)
    .replace(/-+$/g, '');

  return `${head}${suffix}`;
}

function randomToken(): string {
  let token = '';

  for (let index = 0; index < RANDOM_TOKEN_LENGTH; index += 1) {
    token += RANDOM_TOKEN_ALPHABET[Math.floor(Math.random() * RANDOM_TOKEN_ALPHABET.length)];
  }

  return token;
}
