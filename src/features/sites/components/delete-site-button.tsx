'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

import {toSiteLocale} from '@/features/sites/site-data';

export function DeleteSiteButton() {
  const t = useTranslations('siteSetup');
  const tErrors = useTranslations('errors');
  const locale = toSiteLocale(useLocale());
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch('/api/sites/me', {method: 'DELETE'});

      if (response.status === 204) {
        router.replace(`/${locale}/dashboard?deleted=1`);
        return;
      }

      setError(tErrors('INTERNAL'));
      setIsDeleting(false);
    } catch {
      setError(tErrors('INTERNAL'));
      setIsDeleting(false);
    }
  };

  if (!isConfirming) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          {t('edit.deleteSite')}
        </button>
        {error ? (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div role="alertdialog" aria-label={t('edit.deleteConfirmTitle')} className="rounded-xl bg-red-50 p-4">
      <p className="text-sm font-semibold text-red-900">{t('edit.deleteConfirmTitle')}</p>
      <p className="mt-1 text-sm text-red-700">{t('edit.deleteConfirmDescription')}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={isDeleting}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-700 px-4 py-2 font-semibold text-white transition hover:bg-red-800 disabled:cursor-wait disabled:opacity-70"
        >
          {isDeleting ? t('edit.deleting') : t('edit.deleteConfirm')}
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-800 transition hover:bg-white disabled:opacity-70"
        >
          {t('edit.deleteCancel')}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
