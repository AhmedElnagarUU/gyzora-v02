'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {FormEvent, useState} from 'react';

import {isTemplateId, TEMPLATES} from '@/features/templates/catalog';
import type {TemplateId} from '@/features/templates/types';

export function CreateSiteForm() {
  const t = useTranslations('siteSetup');
  const locale = useLocale();
  const router = useRouter();
  const [templateId, setTemplateId] = useState<TemplateId>(TEMPLATES[0].id);
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [languagePreferences, setLanguagePreferences] = useState<string[]>(['en']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          templateId,
          companyName,
          category,
          description,
          languagePreferences
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('error');
        setError(payload.error || t('errors.generic'));
        return;
      }

      setStatus('success');
      router.push(`/${locale}/dashboard`);
    } catch {
      setStatus('error');
      setError(t('errors.generic'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="templateId" className="block text-sm font-medium text-slate-700">
          {t('fields.template')}
        </label>
        <select
          id="templateId"
          value={templateId}
          onChange={(event) => {
            if (isTemplateId(event.target.value)) {
              setTemplateId(event.target.value);
            }
          }}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
        >
          {TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {t(`fields.templateNames.${template.id}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
          {t('fields.companyName')}
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          placeholder={t('fields.companyNamePlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
          {t('fields.category')}
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          placeholder={t('fields.categoryPlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          {t('fields.description')}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          placeholder={t('fields.descriptionPlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">{t('fields.language')}</label>
        <div className="flex gap-3">
          {(['en', 'ar'] as const).map((language) => {
            const checked = languagePreferences.includes(language);
            return (
              <label key={language} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setLanguagePreferences((current) =>
                      checked ? current.filter((item) => item !== language) : [...current, language]
                    );
                  }}
                />
                {language.toUpperCase()}
              </label>
            );
          })}
        </div>
      </div>

      {status === 'error' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === 'success' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {t('success')}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'loading' ? t('loading') : t('submit')}
      </button>
    </form>
  );
}
