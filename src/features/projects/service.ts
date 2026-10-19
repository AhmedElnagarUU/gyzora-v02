import {deleteImageKeys, snapshotImageKeys} from '@/features/images/delete-keys';
import {verifyUploadedKey} from '@/features/images/verify-upload';
import {findSiteByOwnerId, touchDraft} from '@/features/sites/repository';
import {findAvailableSlug, MAX_SLUG_ATTEMPTS, slugify} from '@/features/sites/slug';
import type {LocalizedValue, SiteDocument} from '@/features/sites/types/site';
import {duplicateKeyPattern, isDuplicateKeyError} from '@/shared/db/mongodb';
import {AppError} from '@/shared/http/app-error';

import {
  countFeaturedProjects,
  deleteProjectById,
  deleteProjectsBySiteId,
  findProjectById,
  findProjectsBySiteId,
  insertProject,
  projectSlugExists,
  updateProjectById,
} from './repository';
import {PROJECT_VALIDATION, type ProjectInput} from './schemas/project-schema';
import type {ImageRef, ProjectDocument, ProjectView} from './types';

const FEATURED_LIMIT = 6;
const PROJECT_SLUG_FALLBACK_PREFIX = 'project';
const PROJECT_SLUG_RANDOM_LENGTH = 6;

export interface ProjectServiceDeps {
  verifyKey: (key: string, siteId: string, field: string) => Promise<void>;
  removeKeys: (keys: readonly string[]) => Promise<void>;
}

const defaultDeps: ProjectServiceDeps = {
  verifyKey: verifyUploadedKey,
  removeKeys: deleteImageKeys,
};

export async function listProjectsForOwner(ownerUserId: string): Promise<ProjectView[]> {
  const site = await findSiteByOwnerId(ownerUserId);

  if (!site) {
    throw new AppError('NO_SITE', 409);
  }

  const projects = await findProjectsBySiteId(site._id);

  return projects.map(toProjectView);
}

export async function getProjectForOwner(
  ownerUserId: string,
  projectId: string
): Promise<ProjectView> {
  const site = await findSiteByOwnerId(ownerUserId);

  if (!site) {
    throw new AppError('NOT_FOUND', 404);
  }

  const project = await findProjectById(site._id, projectId);

  if (!project) {
    throw new AppError('NOT_FOUND', 404);
  }

  return toProjectView(project);
}

export async function createProjectForOwner(
  ownerUserId: string,
  values: ProjectInput,
  deps: ProjectServiceDeps = defaultDeps
): Promise<ProjectView> {
  const site = await findSiteByOwnerId(ownerUserId);

  if (!site) {
    throw new AppError('NO_SITE', 409);
  }

  assertTitle(values.title, site);

  if (values.featured) {
    await assertFeaturedRoom(site._id);
  }

  await verifyNewImages(values, new Set(), site._id.toString(), deps);

  const projectId = await insertWithSlug(site._id, values);

  await touchDraft(site._id.toString());

  const created = await findProjectById(site._id, projectId);

  if (!created) {
    throw new AppError('INTERNAL', 500);
  }

  return toProjectView(created);
}

export async function updateProjectForOwner(
  ownerUserId: string,
  projectId: string,
  values: ProjectInput,
  deps: ProjectServiceDeps = defaultDeps
): Promise<ProjectView> {
  const site = await findSiteByOwnerId(ownerUserId);

  if (!site) {
    throw new AppError('NOT_FOUND', 404);
  }

  const current = await findProjectById(site._id, projectId);

  if (!current) {
    throw new AppError('NOT_FOUND', 404);
  }

  assertTitle(values.title, site);

  if (values.featured) {
    await assertFeaturedRoom(site._id, current._id);
  }

  await verifyNewImages(values, new Set(keysOf(current)), site._id.toString(), deps);

  const updated = await updateProjectById(site._id, projectId, {
    title: values.title,
    description: values.description,
    category: values.category,
    location: values.location,
    coverImage: values.coverImage ?? null,
    gallery: values.gallery,
    metadata: values.metadata,
    featured: values.featured,
  });

  if (!updated) {
    throw new AppError('NOT_FOUND', 404);
  }

  await touchDraft(site._id.toString());
  await removeUnusedKeys(site, keysOf(current), values, deps);

  return toProjectView(updated);
}

export async function deleteProjectForOwner(
  ownerUserId: string,
  projectId: string,
  deps: ProjectServiceDeps = defaultDeps
): Promise<void> {
  const site = await findSiteByOwnerId(ownerUserId);

  if (!site) {
    throw new AppError('NOT_FOUND', 404);
  }

  const current = await findProjectById(site._id, projectId);

  if (!current) {
    throw new AppError('NOT_FOUND', 404);
  }

  const deleted = await deleteProjectById(site._id, projectId);

  if (!deleted) {
    throw new AppError('NOT_FOUND', 404);
  }

  await touchDraft(site._id.toString());
  await deps.removeKeys(unpublishedKeys(keysOf(current), site.published));
}

export async function deleteProjectsForSite(
  site: SiteDocument,
  deps: ProjectServiceDeps = defaultDeps
): Promise<void> {
  const projects = await findProjectsBySiteId(site._id);
  const keys = projects.flatMap(keysOf);

  await deleteProjectsBySiteId(site._id);
  await deps.removeKeys(unpublishedKeys(keys, site.published));
}

function assertTitle(title: LocalizedValue, site: SiteDocument): void {
  const locales = site.data.profile.languagePreferences.length
    ? site.data.profile.languagePreferences
    : (['en'] as const);

  if (locales.every((locale) => title[locale].length === 0)) {
    throw new AppError('VALIDATION_FAILED', 400, {
      title: PROJECT_VALIDATION.titleRequired,
    });
  }
}

async function assertFeaturedRoom(
  siteId: SiteDocument['_id'],
  exceptId?: ProjectDocument['_id']
): Promise<void> {
  const featured = await countFeaturedProjects(siteId, exceptId);

  if (featured >= FEATURED_LIMIT) {
    throw new AppError('VALIDATION_FAILED', 400, {
      featured: PROJECT_VALIDATION.featuredLimit,
    });
  }
}

async function verifyNewImages(
  values: ProjectInput,
  existingKeys: ReadonlySet<string>,
  siteId: string,
  deps: ProjectServiceDeps
): Promise<void> {
  if (values.coverImage && !existingKeys.has(values.coverImage.key)) {
    await deps.verifyKey(values.coverImage.key, siteId, 'coverImage.key');
  }

  for (const [index, image] of values.gallery.entries()) {
    if (!existingKeys.has(image.key)) {
      await deps.verifyKey(image.key, siteId, `gallery.${index}.key`);
    }
  }
}

async function removeUnusedKeys(
  site: SiteDocument,
  previousKeys: readonly string[],
  values: ProjectInput,
  deps: ProjectServiceDeps
): Promise<void> {
  const kept = new Set(imageRefs(values).map((image) => image.key));
  const removed = previousKeys.filter((key) => !kept.has(key));

  await deps.removeKeys(unpublishedKeys(removed, site.published));
}

function imageRefs(values: ProjectInput): ImageRef[] {
  return [
    ...(values.coverImage ? [values.coverImage] : []),
    ...values.gallery,
  ];
}

function keysOf(project: Pick<ProjectDocument, 'coverImage' | 'gallery'>): string[] {
  return [
    ...(project.coverImage ? [project.coverImage.key] : []),
    ...project.gallery.map((image) => image.key),
  ];
}

function unpublishedKeys(keys: readonly string[], published: unknown): string[] {
  const protectedKeys = snapshotImageKeys(published);

  return keys.filter((key) => !protectedKeys.has(key));
}

async function insertWithSlug(
  siteId: SiteDocument['_id'],
  values: ProjectInput
): Promise<string> {
  const base = projectSlugBase(values.title);

  for (let round = 0; round < MAX_SLUG_ATTEMPTS; round += 1) {
    const slug = await findAvailableSlug(base, (candidate) => projectSlugExists(siteId, candidate));

    if (!slug) break;

    try {
      return await insertProject({
        siteId,
        slug,
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        coverImage: values.coverImage ?? null,
        gallery: values.gallery,
        metadata: values.metadata,
        featured: values.featured,
      });
    } catch (error) {
      if (!isDuplicateKeyError(error) || !duplicateKeyPattern(error).includes('slug')) {
        throw error;
      }
    }
  }

  throw new AppError('INTERNAL', 500);
}

function projectSlugBase(title: LocalizedValue): string {
  const base = slugify(title.en);

  if (base.length >= 3) return base;

  return `${PROJECT_SLUG_FALLBACK_PREFIX}-${crypto
    .randomUUID()
    .replace(/-/g, '')
    .slice(0, PROJECT_SLUG_RANDOM_LENGTH)}`;
}

export function toProjectView(project: ProjectDocument): ProjectView {
  return {
    id: project._id.toString(),
    slug: project.slug,
    title: project.title,
    description: project.description,
    category: project.category,
    location: project.location,
    coverImage: project.coverImage,
    gallery: project.gallery,
    metadata: project.metadata,
    featured: project.featured,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
