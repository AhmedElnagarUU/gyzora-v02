'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

export function LanguageSwitcher() {
  const t = useTranslations('landing.language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const switchTo = locale === 'en' ? 'ar' : 'en';

  const handleSwitch = () => {
    router.replace(pathname, {locale: switchTo});
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      aria-label={switchTo === 'ar' ? t('switchToAr') : t('switchToEn')}
    >
      {locale === 'en' ? t('ar') : t('en')}
    </button>
  );
}