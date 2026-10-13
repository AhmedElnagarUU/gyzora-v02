import {redirect} from 'next/navigation';

import {getSession} from '@/features/auth/lib/session';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  return <>{children}</>;
}
