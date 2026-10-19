'use client';

import {useTranslations} from 'next-intl';

import {LocalizedField} from './localized-field';

export interface RepeatableItem {
  id: string;
  value: string;
  error?: string;
}

const actionClassName =
  'rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white';

export function RepeatableList({
  idBase,
  label,
  items,
  maxItems,
  maxLength,
  onChange,
  onAdd,
  onRemove,
  onMove,
  error,
  disabled = false,
}: {
  idBase: string;
  label: string;
  items: readonly RepeatableItem[];
  maxItems: number;
  maxLength: number;
  onChange: (id: string, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  error?: string;
  disabled?: boolean;
}) {
  const t = useTranslations('siteSetup.editor');
  const atLimit = items.length >= maxItems;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500">
          {t('listCount', {count: items.length, max: maxItems})}
        </span>
        {atLimit ? <span className="text-xs text-slate-500">{t('limitReached', {max: maxItems})}</span> : null}
      </div>

      {items.length ? (
        <ul aria-label={label} className="space-y-3">
          {items.map((item, index) => {
            const itemLabel = t('itemLabel', {number: index + 1});

            return (
              <li key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <LocalizedField
                      id={`${idBase}-${index}`}
                      label={itemLabel}
                      value={item.value}
                      onChange={(value) => onChange(item.id, value)}
                      error={item.error}
                      maxLength={maxLength}
                      disabled={disabled}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 sm:pt-8">
                    <button
                      type="button"
                      onClick={() => onMove(item.id, -1)}
                      disabled={disabled || index === 0}
                      aria-label={`${t('actions.moveUp')}: ${itemLabel}`}
                      className={actionClassName}
                    >
                      {t('actions.moveUp')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onMove(item.id, 1)}
                      disabled={disabled || index === items.length - 1}
                      aria-label={`${t('actions.moveDown')}: ${itemLabel}`}
                      className={actionClassName}
                    >
                      {t('actions.moveDown')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      disabled={disabled}
                      aria-label={`${t('actions.remove')}: ${itemLabel}`}
                      className={actionClassName}
                    >
                      {t('actions.remove')}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">{t('listEmpty')}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled || atLimit}
          className="rounded-xl border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:hover:bg-white"
        >
          {t('actions.add')}
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
