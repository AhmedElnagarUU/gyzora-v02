'use client';

import {useTranslations} from 'next-intl';

import {Link} from '@/i18n/navigation';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unchanged' | 'stale' | 'failed';

export function SaveBar({
  status,
  formError,
  isDirty,
  previewHref,
  onReload,
}: {
  status: SaveStatus;
  formError?: string;
  isDirty: boolean;
  previewHref: string;
  onReload: () => void;
}) {
  const t = useTranslations('siteSetup');
  const tEditor = useTranslations('siteSetup.editor');
  const tErrors = useTranslations('errors');

  return (
    <div className="sticky bottom-0 -mx-6 -mb-8 space-y-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      {status === 'saved' ? (
        <p
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {t('edit.saved')}
        </p>
      ) : null}

      {status === 'unchanged' ? (
        <p
          role="status"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
        >
          {tEditor('noChanges')}
        </p>
      ) : null}

      {status === 'stale' ? (
        <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{tErrors('STALE_REVISION')}</p>
          <button
            type="button"
            onClick={onReload}
            className="mt-2 font-semibold text-emerald-800 underline-offset-4 hover:underline"
          >
            {t('edit.reload')}
          </button>
        </div>
      ) : null}

      {status === 'failed' && formError ? (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'saving'}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2 font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'saving' ? t('edit.saving') : t('edit.save')}
        </button>
        <Link
          href={previewHref}
          target="_blank"
          rel="noreferrer"
          aria-disabled={isDirty}
          title={isDirty ? tEditor('previewHint') : undefined}
          onClick={(event) => {
            if (isDirty) event.preventDefault();
          }}
          className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-2 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
            isDirty
              ? 'cursor-not-allowed border-slate-200 text-slate-400'
              : 'border-slate-300 text-slate-800 hover:bg-slate-50'
          }`}
        >
          {tEditor('actions.preview')}
        </Link>
        {isDirty ? <p className="text-sm text-amber-700">{tEditor('previewHint')}</p> : null}
      </div>
    </div>
  );
}
