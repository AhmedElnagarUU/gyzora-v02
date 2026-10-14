'use client';

import {authClient} from '@/features/auth/lib/auth-client';
import {signUpSchema} from '@/features/auth/schemas/sign-up-schema';
import {useLocale, useTranslations} from 'next-intl';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {FormEvent, useState} from 'react';

export function SignUpForm({redirectTo}: {redirectTo: string}) {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const parsed = signUpSchema.safeParse({name, email, password});

    if (!parsed.success) {
      setStatus('error');
      setError(t(parsed.error.issues[0]?.message || 'errors.generic'));
      return;
    }

    setStatus('loading');

    try {
      const {error: signUpError} = await authClient.signUp.email({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password
      });

      if (signUpError) {
        setStatus('error');
        setError(t('errors.generic'));
        return;
      }

      const {data: session, error: sessionError} = await authClient.getSession();

      if (sessionError || !session) {
        setStatus('error');
        setError(t('errors.generic'));
        return;
      }

      setStatus('success');
      router.replace(redirectTo || `/${locale}/dashboard`);
      router.refresh();
    } catch {
      setStatus('error');
      setError(t('errors.generic'));
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          {t('signUp.title')}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t('signUp.heading')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            {t('fields.name')}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            placeholder={t('fields.namePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            {t('fields.email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            placeholder={t('fields.emailPlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            {t('fields.password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            placeholder={t('fields.passwordPlaceholder')}
          />
        </div>

        {status === 'error' && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {status === 'success' && (
          <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {t('success.signUp')}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'loading' ? t('loading.signUp') : t('actions.signUp')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {t('signUp.toSignInPrompt')}{' '}
        <Link href={`/${locale}/auth/sign-in`} className="font-semibold text-emerald-700">
          {t('signUp.toSignInLink')}
        </Link>
      </p>
    </div>
  );
}
