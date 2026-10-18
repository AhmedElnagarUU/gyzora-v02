'use client';

import {useTranslations} from 'next-intl';

import {SignOutButton} from '@/features/auth/components/sign-out-button';

export function UserMenu({userName, userEmail}: {userName: string; userEmail: string}) {
  const t = useTranslations('dashboard.userMenu');
  const initial = (userName || userEmail).trim().charAt(0).toUpperCase();

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2">
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white"
        >
          {initial}
        </span>
        <span className="max-w-40 truncate">{userName}</span>
      </summary>
      <div className="absolute end-0 z-10 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t('signedInAs')}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-900">{userEmail}</p>
        <div className="mt-3">
          <SignOutButton />
        </div>
      </div>
    </details>
  );
}
