import type {StoredSiteData, TemplateProject, TemplateSiteData} from '../templates/types';

export function toRenderData(
  data: StoredSiteData,
  projects: readonly TemplateProject[] = []
): TemplateSiteData {
  return {...data, projects: [...projects]};
}

export function withPublicLogo(
  data: StoredSiteData,
  publicUrlForKey: (key: string) => string
): StoredSiteData {
  const key = data.profile.logoKey;

  if (!key) return data;

  return {...data, profile: {...data.profile, logoUrl: publicUrlForKey(key)}};
}
