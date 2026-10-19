'use client';

import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

import {ConfirmDialog} from '@/shared/ui/confirm-dialog';

export function DeleteProjectDialog({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  const t = useTranslations('projects');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {method: 'DELETE'});

      if (!response.ok) {
        setError(t('delete.failed'));
        setPending(false);

        return;
      }

      setOpen(false);
      setPending(false);
      router.refresh();
    } catch {
      setError(t('delete.failed'));
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        {t('card.delete')}
      </button>
      <ConfirmDialog
        open={open}
        title={t('delete.title')}
        description={t('delete.description', {title: projectTitle})}
        confirmLabel={t('delete.confirm')}
        cancelLabel={t('delete.cancel')}
        pendingLabel={t('delete.deleting')}
        pending={pending}
        error={error ?? undefined}
        onConfirm={() => void remove()}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
