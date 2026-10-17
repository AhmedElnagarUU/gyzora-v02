import {getTranslations, setRequestLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';

import {AuthShell} from '@/features/auth/components/auth-shell';
import {SignInForm} from '@/features/auth/components/sign-in-form';
import {getSession} from '@/features/auth/lib/session';

export const dynamic = 'force-dynamic';

export default async function SignInPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;

  setRequestLocale(locale);

  const session = await getSession();

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations({locale, namespace: 'auth'});

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          {t('signIn.title')}
        </p>
      </div>
      <SignInForm redirectTo={`/${locale}/dashboard`} />
    </AuthShell>
  );
}
