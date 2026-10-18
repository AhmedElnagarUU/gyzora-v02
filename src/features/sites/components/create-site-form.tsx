'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {type FormEvent, useState, useSyncExternalStore} from 'react';

import type {SiteLocale} from '@/features/sites/types/site';
import {siteSetupSchema, type SiteSetupValues} from '@/features/sites/schemas/create-site-schema';
import {splitLines} from '@/features/sites/site-data';
import {
  getServerSiteSetupDraftSnapshot,
  getSiteSetupDraftSnapshot,
  saveSiteSetupDraft,
  subscribeToSiteSetupDraft,
} from '@/features/sites/wizard-draft';

function getLocale(locale: string): SiteLocale {
  return locale === 'ar' ? 'ar' : 'en';
}

export function CreateSiteForm() {
  const t = useTranslations('siteSetup');
  const locale = getLocale(useLocale());
  const router = useRouter();
  const draftSnapshot = useSyncExternalStore(
    subscribeToSiteSetupDraft,
    getSiteSetupDraftSnapshot,
    getServerSiteSetupDraftSnapshot
  );
  const initialValues: SiteSetupValues = {
    companyName: '',
    category: '',
    description: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    services: '',
    features: '',
    languagePreferences: [locale],
    locale,
  };
  const [editedValues, setEditedValues] = useState<Partial<SiteSetupValues>>({});
  const values = {
    ...(draftSnapshot.status === 'saved' ? draftSnapshot.values : initialValues),
    ...editedValues,
  };
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateValue = <K extends keyof SiteSetupValues>(key: K, value: SiteSetupValues[K]) => {
    setEditedValues((current) => ({...current, [key]: value}));
    setErrors((current) => {
      const next = {...current};
      delete next[key];
      delete next.form;
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = siteSetupSchema.safeParse(values);
    if (!parsed.success) {
      const validationMessages: Record<string, string> = {
        companyName: t('validation.companyNameMin'),
        category: t('validation.categoryMin'),
        logoUrl: t('validation.urlInvalid'),
        contactEmail: t('validation.emailInvalid'),
      };
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? 'form');
        nextErrors[field] = validationMessages[field] ?? t('errors.generic');
      }
      setErrors(nextErrors);
      return;
    }

    try {
      saveSiteSetupDraft({
        ...parsed.data,
        services: splitLines(parsed.data.services).join('\n'),
        features: splitLines(parsed.data.features).join('\n'),
      });
      router.push(`/${parsed.data.locale}/dashboard/site-create/templates`);
    } catch {
      setErrors({form: t('errors.storage')});
    }
  };

  const inputClassName =
    'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
          {t('fields.companyName')}
        </label>
        <input
          id="companyName"
          type="text"
          value={values.companyName}
          onChange={(event) => updateValue('companyName', event.target.value)}
          aria-invalid={Boolean(errors.companyName)}
          aria-describedby={errors.companyName ? 'companyName-error' : undefined}
          className={inputClassName}
          placeholder={t('fields.companyNamePlaceholder')}
          required
          minLength={2}
        />
        {errors.companyName ? <p id="companyName-error" className="text-sm text-red-700">{errors.companyName}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
          {t('fields.category')}
        </label>
        <input
          id="category"
          type="text"
          value={values.category}
          onChange={(event) => updateValue('category', event.target.value)}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? 'category-error' : undefined}
          className={inputClassName}
          placeholder={t('fields.categoryPlaceholder')}
          required
          minLength={2}
        />
        {errors.category ? <p id="category-error" className="text-sm text-red-700">{errors.category}</p> : null}
      </div>

      {draftSnapshot.status === 'unavailable' ? (
        <p role="alert" className="text-sm text-red-700">{t('errors.storage')}</p>
      ) : null}

      <details className="rounded-2xl border border-slate-200 p-4">
        <summary className="cursor-pointer font-medium text-slate-800">{t('additionalDetails')}</summary>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              {t('fields.description')} <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <textarea
              id="description"
              value={values.description}
              onChange={(event) => updateValue('description', event.target.value)}
              rows={3}
              className={inputClassName}
              placeholder={t('fields.descriptionPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700">
              {t('fields.logoUrl')} <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <input
              id="logoUrl"
              type="url"
              value={values.logoUrl}
              onChange={(event) => updateValue('logoUrl', event.target.value)}
              aria-invalid={Boolean(errors.logoUrl)}
              className={inputClassName}
              placeholder={t('fields.logoUrlPlaceholder')}
            />
            {errors.logoUrl ? <p className="text-sm text-red-700">{errors.logoUrl}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700">
                {t('fields.email')} <span className="font-normal text-slate-500">({t('optional')})</span>
              </label>
              <input
                id="contactEmail"
                type="email"
                value={values.contactEmail}
                onChange={(event) => updateValue('contactEmail', event.target.value)}
                aria-invalid={Boolean(errors.contactEmail)}
                className={inputClassName}
              />
              {errors.contactEmail ? <p className="text-sm text-red-700">{errors.contactEmail}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700">
                {t('fields.phone')} <span className="font-normal text-slate-500">({t('optional')})</span>
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={values.contactPhone}
                onChange={(event) => updateValue('contactPhone', event.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">
              {t('fields.address')} <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <input
              id="address"
              type="text"
              value={values.address}
              onChange={(event) => updateValue('address', event.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="services" className="block text-sm font-medium text-slate-700">
              {t('fields.services')} <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <textarea
              id="services"
              value={values.services}
              onChange={(event) => updateValue('services', event.target.value)}
              rows={3}
              className={inputClassName}
              placeholder={t('fields.listPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="features" className="block text-sm font-medium text-slate-700">
              {t('fields.features')} <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <textarea
              id="features"
              value={values.features}
              onChange={(event) => updateValue('features', event.target.value)}
              rows={3}
              className={inputClassName}
              placeholder={t('fields.listPlaceholder')}
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-slate-700">
              {t('fields.language')} <span className="font-normal text-slate-500">({t('optional')})</span>
            </legend>
            <div className="flex gap-3">
              {(['en', 'ar'] as const).map((language) => {
                const checked = values.languagePreferences.includes(language);
                return (
                  <label key={language} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const languagePreferences = checked
                          ? values.languagePreferences.filter((item) => item !== language)
                          : [...values.languagePreferences, language];
                        updateValue('languagePreferences', languagePreferences);
                      }}
                    />
                    {language.toUpperCase()}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </details>

      {errors.form ? <p role="alert" className="text-sm text-red-700">{errors.form}</p> : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        {t('continueToTemplates')}
      </button>
    </form>
  );
}
