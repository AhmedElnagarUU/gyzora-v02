'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {type FormEvent, type ReactNode, useEffect, useState} from 'react';
import type {ZodError} from 'zod';

import {ImageUploader} from '@/features/images/components/image-uploader';
import {buildEdit, type EditorDraft, type EditorListItem, normalizeDraft} from '@/features/sites/apply-edit';
import {SITE_TEXT_LIMITS, updateSiteSchema} from '@/features/sites/schemas/update-site-schema';
import {toSiteLocale} from '@/features/sites/site-data';
import type {SiteLocale} from '@/features/sites/types/site';

import {LanguageTabs} from './language-tabs';
import {LocalizedField} from './localized-field';
import {RepeatableList, type RepeatableItem} from './repeatable-list';
import {SaveBar, type SaveStatus} from './save-bar';

const PREVIEW_HREF = '/dashboard/site/preview';
const MESSAGE_PREFIX = 'siteSetup.';
const LOCALES: readonly SiteLocale[] = ['ar', 'en'];
const LIST_PATHS = {services: 'profile.services', features: 'profile.features'} as const;

type LocalizedKey =
  | 'companyName'
  | 'category'
  | 'description'
  | 'address'
  | 'workingHours'
  | 'aboutIntroduction'
  | 'aboutStory';
type ListKey = keyof typeof LIST_PATHS;
type TextKey = 'email' | 'phone';

const FIELD_PATHS: Record<LocalizedKey, string> = {
  companyName: 'profile.companyName',
  category: 'profile.category',
  description: 'profile.description',
  address: 'profile.contact.address',
  workingHours: 'profile.contact.workingHours',
  aboutIntroduction: 'pageCopy.about.introduction',
  aboutStory: 'pageCopy.about.story',
};

const TEXT_PATHS: Record<TextKey, string> = {
  email: 'profile.contact.email',
  phone: 'profile.contact.phone',
};

const LOGO_KEY_PATH = 'profile.logoKey';

interface EditorState {
  draft: EditorDraft;
  baseline: EditorDraft;
  revision: number;
}

function Section({title, children}: {title: string; children: ReactNode}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function EditorForm({
  draft: initialDraft,
  revision: initialRevision,
  logoPreviewUrl,
}: {
  draft: EditorDraft;
  revision: number;
  logoPreviewUrl?: string;
}) {
  const t = useTranslations('siteSetup');
  const tEditor = useTranslations('siteSetup.editor');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const uiLocale = useLocale();
  const [locale, setLocale] = useState<SiteLocale>(() => toSiteLocale(uiLocale));
  const [state, setState] = useState<EditorState>(() => ({
    draft: initialDraft,
    baseline: initialDraft,
    revision: initialRevision,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SaveStatus>('idle');
  const {draft, baseline, revision} = state;
  const isDirty = Object.keys(buildEdit(draft, baseline)).length > 0;

  useEffect(() => {
    if (!isDirty) return;

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();

    window.addEventListener('beforeunload', warn);

    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const messageFor = (code: string): string => {
    if (code.startsWith(MESSAGE_PREFIX)) {
      const key = code.slice(MESSAGE_PREFIX.length);

      if (t.has(key)) return t(key);
    }

    return tErrors.has(`field.${code}`) ? tErrors(`field.${code}`) : t('validation.invalid');
  };

  const fieldPath = (path: readonly (string | number | symbol)[]): string =>
    (path[0] === 'data' ? path.slice(1) : path).map(String).join('.') || '_';

  const errorsFromFields = (fields: Record<string, string>): Record<string, string> => {
    const next: Record<string, string> = {};

    for (const [path, code] of Object.entries(fields)) {
      next[fieldPath(path.split('.'))] = messageFor(code);
    }

    return next;
  };

  const errorsFromIssues = (error: ZodError): Record<string, string> => {
    const next: Record<string, string> = {};

    for (const issue of error.issues) {
      const path = fieldPath(issue.path);

      if (!(path in next)) next[path] = messageFor(issue.message);
    }

    return next;
  };

  const changeDraft = (update: (current: EditorDraft) => EditorDraft, path?: string) => {
    setState((current) => ({...current, draft: update(current.draft)}));
    setStatus('idle');

    if (!path) return;

    setErrors((current) => {
      const next = {...current};

      delete next[path];
      delete next[`${path}.${locale}`];

      return next;
    });
  };

  const setLocalizedField = (key: LocalizedKey, value: string) => {
    changeDraft((current) => {
      const next: EditorDraft = {...current};

      next[key] = locale === 'ar' ? {...current[key], ar: value} : {...current[key], en: value};

      return next;
    }, FIELD_PATHS[key]);
  };

  const setTextField = (key: TextKey, value: string) => {
    changeDraft((current) => {
      const next: EditorDraft = {...current};

      next[key] = value;

      return next;
    }, TEXT_PATHS[key]);
  };

  const setList = (key: ListKey, items: EditorListItem[]) => {
    changeDraft((current) => {
      const next: EditorDraft = {...current};

      next[key] = items;

      return next;
    }, LIST_PATHS[key]);
  };

  const addListItem = (key: ListKey) => {
    setList(key, [...draft[key], {id: crypto.randomUUID(), en: '', ar: ''}]);
  };

  const removeListItem = (key: ListKey, id: string) => {
    setList(
      key,
      draft[key].filter((item) => item.id !== id)
    );
  };

  const changeListItem = (key: ListKey, id: string, value: string) => {
    setList(
      key,
      draft[key].map((item) =>
        item.id === id
          ? locale === 'ar'
            ? {...item, ar: value}
            : {...item, en: value}
          : item
      )
    );
  };

  const moveListItem = (key: ListKey, id: string, direction: -1 | 1) => {
    const items = [...draft[key]];
    const index = items.findIndex((item) => item.id === id);
    const target = index + direction;

    if (index < 0 || target < 0 || target >= items.length) return;

    const [moved] = items.splice(index, 1);

    items.splice(target, 0, moved);
    setList(key, items);
  };

  const toggleLanguage = (language: SiteLocale) => {
    const languagePreferences = draft.languagePreferences.includes(language)
      ? draft.languagePreferences.filter((item) => item !== language)
      : [...draft.languagePreferences, language];

    if (!languagePreferences.length) return;

    changeDraft((current) => {
      const next: EditorDraft = {...current};

      next.languagePreferences = languagePreferences;

      return next;
    }, 'profile.languagePreferences');
  };

  const localizedError = (key: LocalizedKey): string | undefined =>
    errors[`${FIELD_PATHS[key]}.${locale}`] ?? errors[FIELD_PATHS[key]];

  const listItems = (key: ListKey): RepeatableItem[] =>
    draft[key].map((item, index) => ({
      id: item.id,
      value: item[locale],
      error: errors[`${LIST_PATHS[key]}.${index}.${locale}`],
    }));

  const isEmpty = (key: LocalizedKey, target: SiteLocale): boolean => !draft[key][target].trim();

  const tabMissing = (target: SiteLocale): boolean =>
    isEmpty('companyName', target) || isEmpty('category', target);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const edit = buildEdit(draft, baseline);

    if (!Object.keys(edit).length) {
      setStatus('unchanged');

      return;
    }

    const parsed = updateSiteSchema.safeParse({revision, data: edit});

    if (!parsed.success) {
      setErrors(errorsFromIssues(parsed.error));
      setStatus('failed');

      return;
    }

    setStatus('saving');

    try {
      const response = await fetch('/api/sites/me', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(parsed.data),
      });

      if (response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const savedRevision = (payload as {data?: {site?: {revision?: unknown}}} | null)?.data?.site
          ?.revision;
        const saved = normalizeDraft(draft);

        setState({
          draft: saved,
          baseline: saved,
          revision: typeof savedRevision === 'number' ? savedRevision : revision + 1,
        });
        setErrors({});
        setStatus('saved');
        router.refresh();

        return;
      }

      if (response.status === 409) {
        setStatus('stale');

        return;
      }

      const payload: unknown = await response.json().catch(() => null);
      const error = (payload as {error?: {code?: string; fields?: Record<string, string>}} | null)
        ?.error;

      if (error?.code === 'VALIDATION_FAILED' && error.fields) {
        setErrors(errorsFromFields(error.fields));
        setStatus('failed');

        return;
      }

      setErrors({form: error?.code && tErrors.has(error.code) ? tErrors(error.code) : tErrors('INTERNAL')});
      setStatus('failed');
    } catch {
      setErrors({form: tErrors('INTERNAL')});
      setStatus('failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <LanguageTabs
          active={locale}
          missing={{en: tabMissing('en'), ar: tabMissing('ar')}}
          onChange={setLocale}
        />
      </div>

      <Section title={tEditor('sections.company')}>
        <LocalizedField
          id="companyName"
          label={t('fields.companyName')}
          value={draft.companyName[locale]}
          onChange={(value) => setLocalizedField('companyName', value)}
          error={localizedError('companyName')}
          maxLength={SITE_TEXT_LIMITS.companyName}
          missing={isEmpty('companyName', locale)}
          disabled={status === 'saving'}
        />
        <LocalizedField
          id="category"
          label={t('fields.category')}
          value={draft.category[locale]}
          onChange={(value) => setLocalizedField('category', value)}
          error={localizedError('category')}
          maxLength={SITE_TEXT_LIMITS.category}
          missing={isEmpty('category', locale)}
          disabled={status === 'saving'}
        />
        <LocalizedField
          id="description"
          label={t('fields.description')}
          value={draft.description[locale]}
          onChange={(value) => setLocalizedField('description', value)}
          error={localizedError('description')}
          maxLength={SITE_TEXT_LIMITS.description}
          multiline
          optional
          disabled={status === 'saving'}
        />
        <div className="space-y-2">
          <p className="block text-sm font-medium text-slate-700">
            {t('fields.logo')} <span className="font-normal text-slate-500">({tEditor('optional')})</span>
          </p>
          <ImageUploader
            kind="logo"
            value={draft.logoKey}
            previewUrl={logoPreviewUrl}
            onChange={(key) => setState((current) => ({
              ...current,
              draft: {...current.draft, logoKey: key},
            }))}
            disabled={status === 'saving'}
          />
          {errors[LOGO_KEY_PATH] ? (
            <p className="text-sm text-red-700">{errors[LOGO_KEY_PATH]}</p>
          ) : null}
        </div>
      </Section>

      <Section title={tEditor('sections.about')}>
        <LocalizedField
          id="aboutIntroduction"
          label={tEditor('fields.aboutIntroduction')}
          value={draft.aboutIntroduction[locale]}
          onChange={(value) => setLocalizedField('aboutIntroduction', value)}
          error={localizedError('aboutIntroduction')}
          maxLength={SITE_TEXT_LIMITS.about}
          multiline
          optional
          disabled={status === 'saving'}
        />
        <LocalizedField
          id="aboutStory"
          label={tEditor('fields.aboutStory')}
          value={draft.aboutStory[locale]}
          onChange={(value) => setLocalizedField('aboutStory', value)}
          error={localizedError('aboutStory')}
          maxLength={SITE_TEXT_LIMITS.about}
          multiline
          optional
          disabled={status === 'saving'}
        />
      </Section>

      <Section title={tEditor('sections.contact')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              {t('fields.email')} <span className="font-normal text-slate-500">({tEditor('optional')})</span>
            </label>
            <input
              id="email"
              type="email"
              value={draft.email}
              onChange={(event) => setTextField('email', event.target.value)}
              aria-invalid={Boolean(errors[TEXT_PATHS.email])}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:opacity-60"
              disabled={status === 'saving'}
            />
            {errors[TEXT_PATHS.email] ? (
              <p className="text-sm text-red-700">{errors[TEXT_PATHS.email]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
              {t('fields.phone')} <span className="font-normal text-slate-500">({tEditor('optional')})</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={draft.phone}
              onChange={(event) => setTextField('phone', event.target.value)}
              aria-invalid={Boolean(errors[TEXT_PATHS.phone])}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:opacity-60"
              disabled={status === 'saving'}
            />
            {errors[TEXT_PATHS.phone] ? (
              <p className="text-sm text-red-700">{errors[TEXT_PATHS.phone]}</p>
            ) : null}
          </div>
        </div>
        <LocalizedField
          id="address"
          label={t('fields.address')}
          value={draft.address[locale]}
          onChange={(value) => setLocalizedField('address', value)}
          error={localizedError('address')}
          maxLength={SITE_TEXT_LIMITS.address}
          optional
          disabled={status === 'saving'}
        />
        <LocalizedField
          id="workingHours"
          label={tEditor('fields.workingHours')}
          value={draft.workingHours[locale]}
          onChange={(value) => setLocalizedField('workingHours', value)}
          error={localizedError('workingHours')}
          maxLength={SITE_TEXT_LIMITS.address}
          optional
          disabled={status === 'saving'}
        />
      </Section>

      <Section title={tEditor('sections.services')}>
        <RepeatableList
          idBase="service"
          label={tEditor('sections.services')}
          items={listItems('services')}
          maxItems={SITE_TEXT_LIMITS.services}
          maxLength={SITE_TEXT_LIMITS.listItem}
          onChange={(id, value) => changeListItem('services', id, value)}
          onAdd={() => addListItem('services')}
          onRemove={(id) => removeListItem('services', id)}
          onMove={(id, direction) => moveListItem('services', id, direction)}
          error={errors[LIST_PATHS.services]}
          disabled={status === 'saving'}
        />
      </Section>

      <Section title={tEditor('sections.features')}>
        <RepeatableList
          idBase="feature"
          label={tEditor('sections.features')}
          items={listItems('features')}
          maxItems={SITE_TEXT_LIMITS.features}
          maxLength={SITE_TEXT_LIMITS.listItem}
          onChange={(id, value) => changeListItem('features', id, value)}
          onAdd={() => addListItem('features')}
          onRemove={(id) => removeListItem('features', id)}
          onMove={(id, direction) => moveListItem('features', id, direction)}
          error={errors[LIST_PATHS.features]}
          disabled={status === 'saving'}
        />
      </Section>

      <Section title={tEditor('sections.languages')}>
        <div className="flex flex-wrap gap-3">
          {LOCALES.map((language) => {
            const checked = draft.languagePreferences.includes(language);
            const isLastLanguage = checked && draft.languagePreferences.length === 1;

            return (
              <label
                key={language}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-800"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={status === 'saving' || isLastLanguage}
                  onChange={() => toggleLanguage(language)}
                />
                {tEditor(`languages.${language}`)}
              </label>
            );
          })}
        </div>
        <p className="text-xs text-slate-500">{tEditor('languageRequired')}</p>
      </Section>

      <SaveBar
        status={status}
        formError={errors.form}
        isDirty={isDirty}
        previewHref={PREVIEW_HREF}
        onReload={() => window.location.reload()}
      />
    </form>
  );
}
