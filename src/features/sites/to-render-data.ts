import type {StoredSiteData, TemplateProject, TemplateSiteData} from '../templates/types';

export function toRenderData(
  data: StoredSiteData,
  projects: readonly TemplateProject[] = []
): TemplateSiteData {
  return {...data, projects: [...projects]};
}
