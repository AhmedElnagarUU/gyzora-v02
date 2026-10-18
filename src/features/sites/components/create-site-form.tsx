'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {type FormEvent, useState, useSyncExternalStore} from 'react';

import type {FieldError} from '@/features/sites/field-errors';
import {siteSetupSchema, type SiteSetupValues} from '@/features/sites/schemas/create-site-schema';
import {splitLines, toSiteLocale} from '@/features/sites/site-data';
import {
  getServerSiteSetupDraftSnapshot,
  getSiteSetupDraftSnapshot,
  saveSiteSetupDraft,
  subscribeToSiteSetupDraft,
} from '@/features/sites/wizard-draft';

import {SiteProfileFields} from './site-profile-fields';

const FIELD_LABEL_KEYS: Record<string, string> = {
  companyName: 'companyName',
  category: 'category',
  description: 'description',
  logoUrl: 'logoUrl',
  contactEmail: 'email',
  contactPhone: 'phone',
  address: 'address',
  services: 'services',
  features: 'features',
  languagePreferences: 'language',
};

export function CreateSiteForm({fieldErrors = []}: {fieldErrors?: FieldError[]}) {
  const t = useTranslations('siteSetup');
  const tErrors = useTranslations('errors');
  const locale = toSiteLocale(useLocale());
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
  const fieldErrorMessages = fieldErrors
    .map(({name, code}) => ({
      name,
      label: FIELD_LABEL_KEYS[name] ? t(`fields.${FIELD_LABEL_KEYS[name]}`) : null,
      message: tErrors.has(`field.${code}`) ? tErrors(`field.${code}`) : tErrors('field.invalid_type'),
    }))
    .filter((item) => item.label);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {fieldErrorMessages.length ? (
        <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">{t('errors.reviewFields')}</p>
          <ul className="mt-1 list-inside list-disc">
            {fieldErrorMessages.map((item) => (
              <li key={item.name}>
                {item.label}: {item.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <SiteProfileFields
        values={values}
        errors={errors}
        onChange={updateValue}
        notice={
          draftSnapshot.status === 'unavailable' ? (
            <p role="alert" className="text-sm text-red-700">
              {t('errors.storage')}
            </p>
          ) : null
        }
      />

      {errors.form ? (
        <p role="alert" className="text-sm text-red-700">
          {errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        {t('continueToTemplates')}
      </button>
    </form>
  );
}
