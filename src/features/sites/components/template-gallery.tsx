'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useState, useSyncExternalStore} from 'react';

import type {LocalizedValue, SiteLocale, SiteProfile} from '@/features/sites/types/site';
import {TEMPLATES} from '@/features/templates/catalog';
import {TemplateRenderer} from '@/features/templates/render/TemplateRenderer';
import type {TemplateDefinition} from '@/features/templates/types';
import {
  clearSiteSetupDraft,
  getServerSiteSetupDraftSnapshot,
  getSiteSetupDraftSnapshot,
  subscribeToSiteSetupDraft,
} from '@/features/sites/wizard-draft';
import type {SiteSetupValues} from '@/features/sites/schemas/create-site-schema';

function getLocale(locale: string): SiteLocale {
  return locale === 'ar' ? 'ar' : 'en';
}

function localizedValue(value: string, locale: SiteLocale): LocalizedValue {
  return locale === 'ar' ? {en: '', ar: value} : {en: value, ar: ''};
}

function splitLines(value: string): string[] {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function previewSite(values: SiteSetupValues): {profile: SiteProfile} {
  const contact = {
    email: values.contactEmail || undefined,
    phone: values.contactPhone || undefined,
    address: values.address ? localizedValue(values.address, values.locale) : undefined,
  };

  return {
    profile: {
      companyName: localizedValue(values.companyName, values.locale),
      category: localizedValue(values.category, values.locale),
      description: localizedValue(values.description, values.locale),
      logoUrl: values.logoUrl || undefined,
      contact: Object.values(contact).some(Boolean) ? contact : undefined,
      services: splitLines(values.services).map((item) => localizedValue(item, values.locale)),
      features: splitLines(values.features).map((item) => localizedValue(item, values.locale)),
      languagePreferences: values.languagePreferences.length
        ? values.languagePreferences
        : [values.locale],
    },
  };
}

function TemplateCard({
  template,
  locale,
}: {
  template: TemplateDefinition;
  locale: SiteLocale;
}) {
  const t = useTranslations('siteSetup');
  const style = template.style;

  return (
    <article
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      data-template-id={template.id}
    >
      <div
        aria-hidden="true"
        className="template-gallery-card-preview"
        style={{background: style.background, color: style.foreground}}
      >
        <div className="template-gallery-card-nav">
          <span>{template.name[locale]}</span>
          <span className="template-gallery-card-action" style={{background: style.accent}} />
        </div>
        <div className="template-gallery-card-hero" style={{background: style.surface}}>
          <span className="template-gallery-card-title">{template.name[locale]}</span>
          <span className="template-gallery-card-scene" style={{background: style.accent}} />
        </div>
        <div className="template-gallery-card-sections">
          <span style={{background: style.foreground}} />
          <span style={{background: style.accent}} />
          <span style={{background: style.foreground}} />
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{template.name[locale]}</h2>
          <p className="mt-1 text-sm text-slate-500" dir="ltr">{template.id}</p>
        </div>
        <a
          href={`/${locale}/templates/${template.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {t('actions.preview')}
        </a>
      </div>
    </article>
  );
}

export function TemplateGallery({previewTemplateId}: {previewTemplateId?: string}) {
  const locale = getLocale(useLocale());
  const t = useTranslations('siteSetup');
  const router = useRouter();
  const draftSnapshot = useSyncExternalStore(
    subscribeToSiteSetupDraft,
    getSiteSetupDraftSnapshot,
    getServerSiteSetupDraftSnapshot
  );
  const draft = draftSnapshot.status === 'saved' ? draftSnapshot.values : null;
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const previewTemplate = TEMPLATES.find((template) => template.id === previewTemplateId) ?? null;
  const previewData = draft ? previewSite(draft) : null;

  const handleSelect = async (template: TemplateDefinition) => {
    if (!draft || isCreating) return;
    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...draft, templateId: template.id}),
      });
      if (!response.ok) {
        setError(response.status === 409 ? t('errors.siteExists') : t('errors.createFailed'));
        setIsCreating(false);
        return;
      }

      clearSiteSetupDraft();
      router.push(`/${draft.locale}/dashboard`);
    } catch {
      setError(t('errors.createFailed'));
      setIsCreating(false);
    }
  };

  if (!draft || !previewData) {
    const message =
      draftSnapshot.status === 'unavailable'
        ? t('errors.storage')
        : draftSnapshot.status === 'invalid'
          ? t('errors.invalidDraft')
          : t('errors.noDraft');
    return (
      <div className="space-y-4">
        <p role="alert" className="text-sm text-red-700">{message}</p>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/dashboard/site-create`)}
          className="rounded-xl px-4 py-2 font-semibold text-emerald-800 underline-offset-4 hover:underline"
        >
          {t('actions.backToDetails')}
        </button>
      </div>
    );
  }

  if (previewTemplate) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">{draft.companyName} · {draft.category}</p>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/dashboard/site-create/templates`)}
            className="rounded-xl px-4 py-2 font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {t('actions.backToGallery')}
          </button>
        </div>
        <div className="template-preview-frame overflow-hidden rounded-2xl border border-slate-200">
          <TemplateRenderer
            template={previewTemplate}
            site={previewData}
            locale={locale}
            mode="sample"
            pageId="home"
            hrefForPage={() => '#template-preview'}
          />
        </div>
        {error ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={isCreating}
            onClick={() => void handleSelect(previewTemplate)}
            className="min-h-11 rounded-xl bg-emerald-700 px-5 py-2 font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {isCreating ? t('creating') : t('actions.selectTemplate')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t('gallery.title')}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {draft.companyName} · {draft.category}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/dashboard/site-create`)}
          className="rounded-xl px-4 py-2 font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {t('actions.backToDetails')}
        </button>
      </div>

      {error ? <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            locale={locale}
          />
        ))}
      </div>
    </>
  );
}
