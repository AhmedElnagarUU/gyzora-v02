'use client';

import {useTranslations} from 'next-intl';

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:opacity-60';

export function LocalizedField({
  id,
  label,
  value,
  onChange,
  error,
  maxLength,
  multiline = false,
  optional = false,
  missing = false,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength: number;
  multiline?: boolean;
  optional?: boolean;
  missing?: boolean;
  disabled?: boolean;
}) {
  const t = useTranslations('siteSetup.editor');
  const errorId = `${id}-error`;
  const sharedProps = {
    id,
    value,
    onChange: (event: {target: {value: string}}) => onChange(event.target.value),
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    className: inputClassName,
    disabled,
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {optional ? <span className="font-normal text-slate-500"> ({t('optional')})</span> : null}
      </label>
      {multiline ? <textarea {...sharedProps} rows={4} /> : <input {...sharedProps} type="text" />}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span className={value.length > maxLength ? 'font-semibold text-red-700' : undefined}>
          {t('counter', {count: value.length, max: maxLength})}
        </span>
        {missing ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900">
            {t('missing')}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
