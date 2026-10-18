'use client';

import {type ReactNode} from 'react';
import {useTranslations} from 'next-intl';

import type {SiteSetupValues} from '@/features/sites/schemas/create-site-schema';

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:opacity-60';

export function SiteProfileFields({
  values,
  errors,
  onChange,
  notice,
  disabled = false,
}: {
  values: SiteSetupValues;
  errors: Record<string, string>;
  onChange: <K extends keyof SiteSetupValues>(key: K, value: SiteSetupValues[K]) => void;
  notice?: ReactNode;
  disabled?: boolean;
}) {
  const t = useTranslations('siteSetup');

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
          {t('fields.companyName')}
        </label>
        <input
          id="companyName"
          type="text"
          value={values.companyName}
          onChange={(event) => onChange('companyName', event.target.value)}
          aria-invalid={Boolean(errors.companyName)}
          aria-describedby={errors.companyName ? 'companyName-error' : undefined}
          className={inputClassName}
          placeholder={t('fields.companyNamePlaceholder')}
          required
          minLength={2}
          disabled={disabled}
        />
        {errors.companyName ? (
          <p id="companyName-error" className="text-sm text-red-700">
            {errors.companyName}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
          {t('fields.category')}
        </label>
        <input
          id="category"
          type="text"
          value={values.category}
          onChange={(event) => onChange('category', event.target.value)}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? 'category-error' : undefined}
          className={inputClassName}
          placeholder={t('fields.categoryPlaceholder')}
          required
          minLength={2}
          disabled={disabled}
        />
        {errors.category ? (
          <p id="category-error" className="text-sm text-red-700">
            {errors.category}
          </p>
        ) : null}
      </div>

      {notice}

      <details className="rounded-2xl border border-slate-200 p-4">
        <summary className="cursor-pointer font-medium text-slate-800">
          {t('additionalDetails')}
        </summary>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              {t('fields.description')}{' '}
              <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <textarea
              id="description"
              value={values.description}
              onChange={(event) => onChange('description', event.target.value)}
              rows={3}
              className={inputClassName}
              placeholder={t('fields.descriptionPlaceholder')}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700">
              {t('fields.logoUrl')}{' '}
              <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <input
              id="logoUrl"
              type="url"
              value={values.logoUrl}
              onChange={(event) => onChange('logoUrl', event.target.value)}
              aria-invalid={Boolean(errors.logoUrl)}
              className={inputClassName}
              placeholder={t('fields.logoUrlPlaceholder')}
              disabled={disabled}
            />
            {errors.logoUrl ? <p className="text-sm text-red-700">{errors.logoUrl}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700">
                {t('fields.email')}{' '}
                <span className="font-normal text-slate-500">({t('optional')})</span>
              </label>
              <input
                id="contactEmail"
                type="email"
                value={values.contactEmail}
                onChange={(event) => onChange('contactEmail', event.target.value)}
                aria-invalid={Boolean(errors.contactEmail)}
                className={inputClassName}
                disabled={disabled}
              />
              {errors.contactEmail ? (
                <p className="text-sm text-red-700">{errors.contactEmail}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700">
                {t('fields.phone')}{' '}
                <span className="font-normal text-slate-500">({t('optional')})</span>
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={values.contactPhone}
                onChange={(event) => onChange('contactPhone', event.target.value)}
                className={inputClassName}
                disabled={disabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">
              {t('fields.address')}{' '}
              <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <input
              id="address"
              type="text"
              value={values.address}
              onChange={(event) => onChange('address', event.target.value)}
              className={inputClassName}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="services" className="block text-sm font-medium text-slate-700">
              {t('fields.services')}{' '}
              <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <textarea
              id="services"
              value={values.services}
              onChange={(event) => onChange('services', event.target.value)}
              rows={3}
              className={inputClassName}
              placeholder={t('fields.listPlaceholder')}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="features" className="block text-sm font-medium text-slate-700">
              {t('fields.features')}{' '}
              <span className="font-normal text-slate-500">({t('optional')})</span>
            </label>
            <textarea
              id="features"
              value={values.features}
              onChange={(event) => onChange('features', event.target.value)}
              rows={3}
              className={inputClassName}
              placeholder={t('fields.listPlaceholder')}
              disabled={disabled}
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-slate-700">
              {t('fields.language')}{' '}
              <span className="font-normal text-slate-500">({t('optional')})</span>
            </legend>
            <div className="flex gap-3">
              {(['en', 'ar'] as const).map((language) => {
                const checked = values.languagePreferences.includes(language);
                return (
                  <label
                    key={language}
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => {
                        const languagePreferences = checked
                          ? values.languagePreferences.filter((item) => item !== language)
                          : [...values.languagePreferences, language];
                        onChange('languagePreferences', languagePreferences);
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
    </>
  );
}
