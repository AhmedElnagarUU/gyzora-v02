import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import localFont from 'next/font/local';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

import '../globals.css';

const sansLatin = localFont({
  src: '../fonts/Geist-VariableFont_wght.ttf',
  weight: '100 900',
  variable: '--font-sans-latin',
  display: 'swap'
});

const sansArabic = localFont({
  src: [
    {path: '../fonts/IBMPlexSansArabic-ExtraLight.ttf', weight: '200'},
    {path: '../fonts/IBMPlexSansArabic-Light.ttf', weight: '300'},
    {path: '../fonts/IBMPlexSansArabic-Regular.ttf', weight: '400'},
    {path: '../fonts/IBMPlexSansArabic-Medium.ttf', weight: '500'},
    {path: '../fonts/IBMPlexSansArabic-SemiBold.ttf', weight: '600'},
    {path: '../fonts/IBMPlexSansArabic-Bold.ttf', weight: '700'}
  ],
  variable: '--font-sans-arabic',
  display: 'swap',
  preload: false
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'landing.page.metadata'});

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${sansLatin.variable} ${sansArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
