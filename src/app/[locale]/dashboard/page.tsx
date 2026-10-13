import {getTranslations, setRequestLocale} from 'next-intl/server';

import {SignOutButton} from '@/features/auth/components/sign-out-button';
import {getSession} from '@/features/auth/lib/session';

export default async function DashboardPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const session = await getSession();
  const t = await getTranslations({locale, namespace: 'auth.dashboard'});

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{t('title')}</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('welcome')}, {session.user.name || session.user.email}</h1>
          </div>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
