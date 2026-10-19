'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {type FormEvent, type ReactNode, useState} from 'react';
import type {ZodError} from 'zod';

import {ImageUploader} from '@/features/images/components/image-uploader';
import type {ImageRef, ProjectMetadata} from '@/features/projects/types';
import {
  PROJECT_TEXT_LIMITS,
  PROJECT_VALIDATION,
  projectSchema,
} from '@/features/projects/schemas/project-schema';
import {LanguageTabs} from '@/features/sites/components/editor/language-tabs';
import {LocalizedField} from '@/features/sites/components/editor/localized-field';
import {toSiteLocale} from '@/features/sites/site-data';
import type {LocalizedValue, SiteLocale} from '@/features/sites/types/site';
import {Link} from '@/i18n/navigation';

const EMPTY_LOCALIZED: LocalizedValue = {en: '', ar: ''};
const LIST_HREF = '/dashboard/site/projects';

interface FormImage extends ImageRef {
  id: string;
}

export interface ProjectFormInitial {
  id: string;
  title: LocalizedValue;
  description: LocalizedValue;
  category: LocalizedValue;
  location: LocalizedValue;
  coverImage: ImageRef | null;
  gallery: ImageRef[];
  metadata: ProjectMetadata;
  featured: boolean;
}

interface FormState {
  title: LocalizedValue;
  description: LocalizedValue;
  category: LocalizedValue;
  location: LocalizedValue;
  coverImage: FormImage;
  gallery: FormImage[];
  year: string;
  areaSqm: string;
  client: string;
  featured: boolean;
}

function newId(): string {
  return crypto.randomUUID();
}

function emptyImage(): FormImage {
  return {id: newId(), key: '', alt: {...EMPTY_LOCALIZED}};
}

function initialState(initial?: ProjectFormInitial): FormState {
  return {
    title: {...(initial?.title ?? EMPTY_LOCALIZED)},
    description: {...(initial?.description ?? EMPTY_LOCALIZED)},
    category: {...(initial?.category ?? EMPTY_LOCALIZED)},
    location: {...(initial?.location ?? EMPTY_LOCALIZED)},
    coverImage: initial?.coverImage
      ? {id: newId(), ...initial.coverImage, alt: {...initial.coverImage.alt}}
      : emptyImage(),
    gallery: (initial?.gallery ?? []).map((image) => ({
      id: newId(),
      key: image.key,
      alt: {...image.alt},
    })),
    year: initial?.metadata.year === undefined ? '' : String(initial.metadata.year),
    areaSqm: initial?.metadata.areaSqm === undefined ? '' : String(initial.metadata.areaSqm),
    client: initial?.metadata.client ?? '',
    featured: initial?.featured ?? false,
  };
}

function Section({title, children}: {title: string; children: ReactNode}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function ProjectForm({
  mode,
  initial,
  imageUrls,
}: {
  mode: 'create' | 'edit';
  initial?: ProjectFormInitial;
  imageUrls: Record<string, string>;
}) {
  const t = useTranslations('projects');
  const tForm = useTranslations('projects.form');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const uiLocale = useLocale();
  const [locale, setLocale] = useState<SiteLocale>(() => toSiteLocale(uiLocale));
  const [state, setState] = useState<FormState>(() => initialState(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const messageFor = (code: string): string => {
    if (code.startsWith('projects.')) {
      const key = code.slice('projects.'.length);

      if (t.has(key)) return t(key);
    }

    return tErrors.has(`field.${code}`) ? tErrors(`field.${code}`) : t('validation.invalid');
  };

  const errorsFromFields = (fields: Record<string, string>): Record<string, string> => {
    const next: Record<string, string> = {};

    for (const [path, code] of Object.entries(fields)) {
      next[path] = messageFor(code);
    }

    return next;
  };

  const errorsFromIssues = (error: ZodError): Record<string, string> => {
    const next: Record<string, string> = {};

    for (const issue of error.issues) {
      const path = issue.path.map(String).join('.') || '_';

      if (!(path in next)) next[path] = messageFor(issue.message);
    }

    return next;
  };

  const setText = (key: 'title' | 'description' | 'category' | 'location', value: string) => {
    setState((current) => ({...current, [key]: {...current[key], [locale]: value}}));
  };

  const setAlt = (target: 'cover' | number, value: string) => {
    setState((current) => {
      if (target === 'cover') {
        return {
          ...current,
          coverImage: {
            ...current.coverImage,
            alt: {...current.coverImage.alt, [locale]: value},
          },
        };
      }

      return {
        ...current,
        gallery: current.gallery.map((image, index) =>
          index === target ? {...image, alt: {...image.alt, [locale]: value}} : image
        ),
      };
    });
  };

  const setCoverKey = (key: string) => {
    setState((current) => ({...current, coverImage: {...current.coverImage, key}}));
  };

  const setGalleryKey = (id: string, key: string) => {
    setState((current) => ({
      ...current,
      gallery: current.gallery.map((image) => (image.id === id ? {...image, key} : image)),
    }));
  };

  const addGalleryImage = () => {
    setState((current) => ({...current, gallery: [...current.gallery, emptyImage()]}));
  };

  const removeGalleryImage = (id: string) => {
    setState((current) => ({
      ...current,
      gallery: current.gallery.filter((image) => image.id !== id),
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: Record<string, string> = {};
    const year = state.year.trim() === '' ? undefined : Number(state.year);
    const areaSqm = state.areaSqm.trim() === '' ? undefined : Number(state.areaSqm);

    if (year !== undefined && (!Number.isFinite(year) || !Number.isInteger(year))) {
      nextErrors['metadata.year'] = messageFor(PROJECT_VALIDATION.yearRange);
    }

    if (areaSqm !== undefined && !Number.isFinite(areaSqm)) {
      nextErrors['metadata.areaSqm'] = messageFor(PROJECT_VALIDATION.areaPositive);
    }

    const payload = {
      title: state.title,
      description: state.description,
      category: state.category,
      location: state.location,
      coverImage: state.coverImage.key
        ? {key: state.coverImage.key, alt: state.coverImage.alt}
        : null,
      gallery: state.gallery
        .filter((image) => image.key.length > 0)
        .map((image) => ({key: image.key, alt: image.alt})),
      metadata: {
        year,
        areaSqm,
        client: state.client.trim() || undefined,
      },
      featured: state.featured,
    };

    const parsed = projectSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors({...nextErrors, ...errorsFromIssues(parsed.error)});

      return;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);

      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const response = await fetch(
        mode === 'create' ? '/api/projects' : `/api/projects/${initial?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(parsed.data),
        }
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: {code?: string; fields?: Record<string, string>};
        } | null;

        setErrors(errorsFromFields(body?.error?.fields ?? {}));
        setFormError(
          body?.error?.code
            ? tErrors.has(body.error.code)
              ? tErrors(body.error.code)
              : t('validation.saveFailed')
            : t('validation.saveFailed')
        );
        setSaving(false);

        return;
      }

      router.push(LIST_HREF);
      router.refresh();
    } catch {
      setFormError(t('validation.saveFailed'));
      setSaving(false);
    }
  };

  const missing: Record<SiteLocale, boolean> = {
    en: state.title.en.trim() === '',
    ar: state.title.ar.trim() === '',
  };

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <LanguageTabs active={locale} missing={missing} onChange={setLocale} />
      </div>

      <Section title={tForm('sections.basics')}>
        <LocalizedField
          id="project-title"
          label={tForm('fields.title')}
          value={state.title[locale]}
          onChange={(value) => setText('title', value)}
          error={errors.title}
          maxLength={PROJECT_TEXT_LIMITS.title}
        />
        <LocalizedField
          id="project-category"
          label={tForm('fields.category')}
          value={state.category[locale]}
          onChange={(value) => setText('category', value)}
          error={errors.category}
          maxLength={PROJECT_TEXT_LIMITS.category}
          optional
        />
        <LocalizedField
          id="project-location"
          label={tForm('fields.location')}
          value={state.location[locale]}
          onChange={(value) => setText('location', value)}
          error={errors.location}
          maxLength={PROJECT_TEXT_LIMITS.location}
          optional
        />
        <LocalizedField
          id="project-description"
          label={tForm('fields.description')}
          value={state.description[locale]}
          onChange={(value) => setText('description', value)}
          error={errors.description}
          maxLength={PROJECT_TEXT_LIMITS.description}
          multiline
          optional
        />
      </Section>

      <Section title={tForm('sections.cover')}>
        <ImageUploader
          kind="cover"
          value={state.coverImage.key}
          previewUrl={imageUrls[state.coverImage.key]}
          onChange={setCoverKey}
        />
        <LocalizedField
          id="project-cover-alt"
          label={tForm('fields.alt')}
          value={state.coverImage.alt[locale]}
          onChange={(value) => setAlt('cover', value)}
          error={errors['coverImage.alt']}
          maxLength={PROJECT_TEXT_LIMITS.alt}
          optional
        />
      </Section>

      <Section title={tForm('sections.gallery')}>
        <p className="text-sm text-slate-500">
          {tForm('galleryCount', {
            count: state.gallery.filter((image) => image.key.length > 0).length,
            max: PROJECT_TEXT_LIMITS.gallery,
          })}
        </p>
        {state.gallery.map((image, index) => (
          <div key={image.id} className="space-y-3 rounded-2xl border border-slate-100 p-4">
            <ImageUploader
              kind="gallery"
              value={image.key}
              previewUrl={imageUrls[image.key]}
              onChange={(key) => setGalleryKey(image.id, key)}
            />
            <LocalizedField
              id={`project-gallery-alt-${index}`}
              label={tForm('fields.alt')}
              value={image.alt[locale]}
              onChange={(value) => setAlt(index, value)}
              error={errors[`gallery.${index}.alt`]}
              maxLength={PROJECT_TEXT_LIMITS.alt}
              optional
            />
            {errors[`gallery.${index}.key`] ? (
              <p className="text-sm text-red-700">{errors[`gallery.${index}.key`]}</p>
            ) : null}
            <button
              type="button"
              onClick={() => removeGalleryImage(image.id)}
              className="text-sm font-semibold text-red-700 underline underline-offset-4"
            >
              {tForm('removeImage')}
            </button>
          </div>
        ))}
        {errors.gallery ? <p className="text-sm text-red-700">{errors.gallery}</p> : null}
        <button
          type="button"
          onClick={addGalleryImage}
          disabled={state.gallery.length >= PROJECT_TEXT_LIMITS.gallery}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {tForm('addImage')}
        </button>
      </Section>

      <Section title={tForm('sections.metadata')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="project-year" className="block text-sm font-medium text-slate-700">
              {tForm('fields.year')}
            </label>
            <input
              id="project-year"
              type="number"
              min={1900}
              max={2100}
              value={state.year}
              onChange={(event) => setState((current) => ({...current, year: event.target.value}))}
              aria-invalid={Boolean(errors['metadata.year'])}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
            {errors['metadata.year'] ? (
              <p className="text-sm text-red-700">{errors['metadata.year']}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="project-area" className="block text-sm font-medium text-slate-700">
              {tForm('fields.area')}
            </label>
            <input
              id="project-area"
              type="number"
              min={1}
              step="any"
              value={state.areaSqm}
              onChange={(event) =>
                setState((current) => ({...current, areaSqm: event.target.value}))
              }
              aria-invalid={Boolean(errors['metadata.areaSqm'])}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
            {errors['metadata.areaSqm'] ? (
              <p className="text-sm text-red-700">{errors['metadata.areaSqm']}</p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="project-client" className="block text-sm font-medium text-slate-700">
            {tForm('fields.client')}
          </label>
          <input
            id="project-client"
            type="text"
            value={state.client}
            onChange={(event) => setState((current) => ({...current, client: event.target.value}))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
          {errors['metadata.client'] ? (
            <p className="text-sm text-red-700">{errors['metadata.client']}</p>
          ) : null}
        </div>
      </Section>

      <Section title={tForm('sections.featured')}>
        <label className="flex items-start gap-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={state.featured}
            onChange={(event) =>
              setState((current) => ({...current, featured: event.target.checked}))
            }
            className="mt-1 size-4 rounded border-slate-300 text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          />
          <span>
            {tForm('fields.featured')}
            <span className="mt-1 block text-xs text-slate-500">{tForm('featuredHint')}</span>
          </span>
        </label>
        {errors.featured ? <p className="text-sm text-red-700">{errors.featured}</p> : null}
      </Section>

      <div className="sticky bottom-0 -mx-6 -mb-8 space-y-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
        {formError ? (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2 font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? tForm('saving') : tForm('save')}
          </button>
          <Link
            href={LIST_HREF}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 py-2 font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {tForm('cancel')}
          </Link>
        </div>
      </div>
    </form>
  );
}
