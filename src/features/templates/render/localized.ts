import type {LocalizedValue, SiteLocale} from '@/features/sites/types/site';
import type {TemplateProject} from '../types';

export function getLocalizedText(
  value: LocalizedValue | undefined,
  locale: SiteLocale
): string {
  return value?.[locale]?.trim() ?? '';
}

export function getTextDirection(locale: SiteLocale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getVisibleProjects(
  projects: readonly TemplateProject[],
  locale: SiteLocale
): readonly TemplateProject[] {
  return projects.filter((project) => getLocalizedText(project.title, locale));
}
