import {useTranslations} from 'next-intl';

export default function Loading() {
  const t = useTranslations('common.loading');

  return (
    <div role="status" className="flex min-h-full items-center justify-center px-6 py-24">
      <span className="text-sm font-medium text-slate-600">{t('label')}</span>
    </div>
  );
}
