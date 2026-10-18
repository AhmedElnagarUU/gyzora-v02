import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {getSiteForOwner} from '@/features/sites/service';
import {DashboardShell} from '@/features/dashboard/components/dashboard-shell';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  const site = await getSiteForOwner(session.user.id);

  return (
    <DashboardShell
      userName={session.user.name || session.user.email}
      userEmail={session.user.email}
      hasSite={site !== null}
    >
      {children}
    </DashboardShell>
  );
}
