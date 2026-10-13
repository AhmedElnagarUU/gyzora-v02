'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export function SignOutButton() {
  const t = useTranslations('auth.dashboard');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    setHasError(false);

    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST'
      });

      if (!response.ok) {
        setHasError(true);
        setIsPending(false);
        return;
      }

      router.push(`/${locale}`);
    } catch {
      setHasError(true);
      setIsPending(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? t('signingOut') : t('signOut')}
      </button>
      {hasError && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {t('signOutError')}
        </p>
      )}
    </div>
  );
}
