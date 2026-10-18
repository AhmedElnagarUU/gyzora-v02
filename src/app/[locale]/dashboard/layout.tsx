import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';
import {DashboardShell} from '@/features/dashboard/components/dashboard-shell';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  return (
    <DashboardShell userName={session.user.name || session.user.email} userEmail={session.user.email}>
      {children}
    </DashboardShell>
  );
}
