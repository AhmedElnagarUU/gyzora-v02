'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {type FormEvent, useState} from 'react';

import {siteSetupSchema, type SiteSetupValues} from '@/features/sites/schemas/create-site-schema';
import {
  mergeProfileEdit,
  siteSetupValuesFromProfile,
  toSiteLocale,
} from '@/features/sites/site-data';
import type {SiteProfile} from '@/features/sites/types/site';

import {SiteProfileFields} from './site-profile-fields';

export function EditSiteForm({
  profile,
  revision,
}: {
  profile: SiteProfile;
  revision: number;
}) {
  const t = useTranslations('siteSetup');
  const tErrors = useTranslations('errors');
  const locale = toSiteLocale(useLocale());
  const router = useRouter();
  const [values, setValues] = useState<SiteSetupValues>(() =>
    siteSetupValuesFromProfile(profile, locale)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'stale' | 'failed'>('idle');

  const updateValue = <K extends keyof SiteSetupValues>(key: K, value: SiteSetupValues[K]) => {
    setValues((current) => ({...current, [key]: value}));
    setErrors((current) => {
      const next = {...current};
      delete next[key];
      delete next.form;
      return next;
    });
    setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    setStatus('saving');

    try {
      const response = await fetch('/api/sites/me', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          revision,
          data: {
            profile: mergeProfileEdit(profile, locale, parsed.data),
          },
        }),
      });

      if (response.ok) {
        setStatus('saved');
        router.refresh();
        return;
      }

      if (response.status === 409) {
        setStatus('stale');
        return;
      }

      const payload: unknown = await response.json().catch(() => null);
      const code = (payload as {error?: {code?: string}} | null)?.error?.code;

      setErrors({form: code && tErrors.has(code) ? tErrors(code) : tErrors('INTERNAL')});
      setStatus('failed');
    } catch {
      setErrors({form: tErrors('INTERNAL')});
      setStatus('failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {status === 'saved' ? (
        <p
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {t('edit.saved')}
        </p>
      ) : null}

      {status === 'stale' ? (
        <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{tErrors('STALE_REVISION')}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 font-semibold text-emerald-800 underline-offset-4 hover:underline"
          >
            {t('edit.reload')}
          </button>
        </div>
      ) : null}

      <SiteProfileFields
        values={values}
        errors={errors}
        onChange={updateValue}
        disabled={status === 'saving'}
      />

      {errors.form ? (
        <p role="alert" className="text-sm text-red-700">
          {errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'saving' ? t('edit.saving') : t('edit.save')}
      </button>
    </form>
  );
}
