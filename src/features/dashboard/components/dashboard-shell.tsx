import {getTranslations} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from '@/shared/ui/language-switcher';

import {Sidebar} from './sidebar';
import {UserMenu} from './user-menu';

export async function DashboardShell({
  userName,
  userEmail,
  children,
}: {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations('common.brand');

  return (
    <div className="flex min-h-full flex-col bg-slate-100">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-8">
        <Link
          href="/dashboard"
          aria-label={t('homeLabel')}
          className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm"
          >
            G
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">{t('name')}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <UserMenu userName={userName} userEmail={userEmail} />
        </div>
      </header>
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
