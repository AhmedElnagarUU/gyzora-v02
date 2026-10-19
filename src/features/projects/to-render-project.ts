import type {LocalizedValue, SiteLocale} from '../sites/types/site';
import type {TemplateImage, TemplateProject} from '../templates/types';

import type {ImageRef, ProjectMetadata} from './types';

export interface RenderableProject {
  slug: string;
  title: LocalizedValue;
  description: LocalizedValue;
  category: LocalizedValue;
  location: LocalizedValue;
  coverImage: ImageRef | null;
  gallery: readonly ImageRef[];
  metadata: ProjectMetadata;
}

const AREA_UNIT: Record<SiteLocale, string> = {en: 'm²', ar: 'م²'};

function formatArea(value: number): string {
  return value.toLocaleString('en-US');
}

function imageFor(
  ref: ImageRef,
  title: LocalizedValue,
  publicUrlForKey: (key: string) => string
): TemplateImage {
  return {
    src: publicUrlForKey(ref.key),
    alt: {
      en: ref.alt.en || title.en,
      ar: ref.alt.ar || title.ar,
    },
  };
}

function areaFor(areaSqm: number | undefined): LocalizedValue | undefined {
  if (areaSqm === undefined) return undefined;

  return {
    en: `${formatArea(areaSqm)} ${AREA_UNIT.en}`,
    ar: `${formatArea(areaSqm)} ${AREA_UNIT.ar}`,
  };
}

export function toRenderProject(
  project: RenderableProject,
  publicUrlForKey: (key: string) => string
): TemplateProject {
  return {
    id: project.slug,
    title: project.title,
    description: project.description,
    category: project.category,
    location: project.location,
    year: project.metadata.year === undefined ? undefined : String(project.metadata.year),
    area: areaFor(project.metadata.areaSqm),
    coverImage: project.coverImage
      ? imageFor(project.coverImage, project.title, publicUrlForKey)
      : undefined,
    gallery: project.gallery.map((ref) => imageFor(ref, project.title, publicUrlForKey)),
  };
}
