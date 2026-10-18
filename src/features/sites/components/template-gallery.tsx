'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {type RefObject, useEffect, useRef, useState, useSyncExternalStore} from 'react';

import {Link} from '@/i18n/navigation';
import {serializeFieldErrors} from '@/features/sites/field-errors';
import {getDisplayValue} from '@/features/sites/site-data';
import type {SiteSetupValues} from '@/features/sites/schemas/create-site-schema';
import type {SiteLocale} from '@/features/sites/types/site';
import {
  clearSiteSetupDraft,
  getServerSiteSetupDraftSnapshot,
  getSiteSetupDraftSnapshot,
  subscribeToSiteSetupDraft,
} from '@/features/sites/wizard-draft';
import {TEMPLATES} from '@/features/templates/catalog';
import type {TemplateDefinition, TemplateId} from '@/features/templates/types';

function getLocale(locale: string): SiteLocale {
  return locale === 'ar' ? 'ar' : 'en';
}

const API_ERROR_CODES = [
  'UNAUTHENTICATED',
  'VALIDATION_FAILED',
  'SITE_ALREADY_EXISTS',
  'NOT_FOUND',
  'INTERNAL',
] as const;

const subscribeToNothing = () => () => {};

function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
}

function previewHref(locale: SiteLocale, templateId: TemplateId, draft: SiteSetupValues): string {
  const name = encodeURIComponent(draft.companyName);
  const category = encodeURIComponent(draft.category);

  return `/${locale}/templates/${templateId}?name=${name}&category=${category}`;
}

function apiErrorCode(payload: unknown, fallback: string): string {
  const code = (payload as {error?: {code?: string}} | null)?.error?.code;

  return code && (API_ERROR_CODES as readonly string[]).includes(code) ? code : fallback;
}

function fieldErrorsHref(locale: SiteLocale, payload: unknown): string {
  const fields = (payload as {error?: {fields?: Record<string, string>}} | null)?.error?.fields;
  const query = serializeFieldErrors(fields ?? {});

  return query ? `/${locale}/dashboard/site-create?fields=${query}` : `/${locale}/dashboard/site-create`;
}

function TemplateCard({
  template,
  locale,
  draft,
  pendingTemplateId,
  highlightId,
  selectButtonRef,
  onSelect,
}: {
  template: TemplateDefinition;
  locale: SiteLocale;
  draft: SiteSetupValues;
  pendingTemplateId: TemplateId | null;
  highlightId?: string;
  selectButtonRef: RefObject<HTMLButtonElement | null>;
  onSelect: (template: TemplateDefinition) => void;
}) {
  const t = useTranslations('siteSetup');
  const style = template.style;
  const name = getDisplayValue(template.name, locale);
  const isHighlighted = template.id === highlightId;
  const isPending = template.id === pendingTemplateId;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm ${
        isHighlighted ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-slate-200'
      }`}
      data-template-id={template.id}
    >
      <div
        aria-hidden="true"
        className="template-gallery-card-preview"
        style={{background: style.background, color: style.foreground}}
      >
        <div className="template-gallery-card-nav">
          <span>{name}</span>
          <span className="template-gallery-card-action" style={{background: style.accent}} />
        </div>
        <div className="template-gallery-card-hero" style={{background: style.surface}}>
          <span className="template-gallery-card-title">{name}</span>
          <span className="template-gallery-card-scene" style={{background: style.accent}} />
        </div>
        <div className="template-gallery-card-sections">
          <span style={{background: style.foreground}} />
          <span style={{background: style.accent}} />
          <span style={{background: style.foreground}} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{name}</h2>
          <p className="mt-1 text-sm text-slate-600">{getDisplayValue(template.summary, locale)}</p>
        </div>
        {isHighlighted ? (
          <p className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
            {t('gallery.highlighted')}
          </p>
        ) : null}
        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <a
            href={previewHref(locale, template.id, draft)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {t('actions.preview')}
          </a>
          <button
            type="button"
            ref={isHighlighted ? selectButtonRef : null}
            disabled={pendingTemplateId !== null}
            onClick={() => onSelect(template)}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {isPending ? t('creating') : t('actions.selectTemplate')}
          </button>
        </div>
      </div>
    </article>
  );
}

export function TemplateGallery({highlightId}: {highlightId?: string}) {
  const locale = getLocale(useLocale());
  const t = useTranslations('siteSetup');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const draftSnapshot = useSyncExternalStore(
    subscribeToSiteSetupDraft,
    getSiteSetupDraftSnapshot,
    getServerSiteSetupDraftSnapshot
  );
  const isClient = useIsClient();
  const [pendingTemplateId, setPendingTemplateId] = useState<TemplateId | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const selectButtonRef = useRef<HTMLButtonElement | null>(null);
  const draft = draftSnapshot.status === 'saved' ? draftSnapshot.values : null;
  const hasUsableDraft = draftSnapshot.status === 'saved';

  useEffect(() => {
    if (!isClient) return;
    if (!hasUsableDraft) {
      router.replace(`/${locale}/dashboard/site-create`);
    }
  }, [isClient, hasUsableDraft, locale, router]);

  useEffect(() => {
    if (isClient) {
      selectButtonRef.current?.focus();
    }
  }, [isClient]);

  const handleSelect = async (template: TemplateDefinition) => {
    if (!draft || pendingTemplateId !== null) return;

    setPendingTemplateId(template.id);
    setErrorCode(null);

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...draft, templateId: template.id}),
      });

      if (response.status === 201) {
        try {
          clearSiteSetupDraft();
        } catch {
          // The site is created; the draft can stay in this browser.
        }
        router.replace(`/${locale}/dashboard?created=1`);
        return;
      }

      const payload: unknown = await response.json().catch(() => null);

      if (response.status === 400) {
        router.replace(fieldErrorsHref(locale, payload));
        return;
      }

      setErrorCode(apiErrorCode(payload, 'INTERNAL'));
      setPendingTemplateId(null);
    } catch {
      setErrorCode('INTERNAL');
      setPendingTemplateId(null);
    }
  };

  if (!isClient || !hasUsableDraft) {
    return (
      <p role="status" className="text-sm text-slate-600">
        {t('loading')}
      </p>
    );
  }

  if (!draft) {
    return (
      <div className="space-y-4">
        <p role="alert" className="text-sm text-red-700">
          {t('errors.storage')}
        </p>
        <Link
          href="/dashboard/site-create"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {t('actions.backToDetails')}
        </Link>
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
        <Link
          href="/dashboard/site-create"
          className="rounded-xl px-4 py-2 font-semibold text-emerald-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {t('actions.backToDetails')}
        </Link>
      </div>

      {errorCode ? (
        <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <p>{tErrors.has(errorCode) ? tErrors(errorCode) : tErrors('INTERNAL')}</p>
          {errorCode === 'SITE_ALREADY_EXISTS' ? (
            <Link
              href="/dashboard"
              className="mt-2 inline-block font-semibold text-emerald-800 underline-offset-4 hover:underline"
            >
              {t('actions.backToDashboard')}
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            locale={locale}
            draft={draft}
            pendingTemplateId={pendingTemplateId}
            highlightId={highlightId}
            selectButtonRef={selectButtonRef}
            onSelect={(selected) => void handleSelect(selected)}
          />
        ))}
      </div>
    </>
  );
}
