'use client';

import {useState} from 'react';
import type {ReactNode} from 'react';
import type {SiteLocale} from '@/features/sites/types/site';
import type {TemplateId, TemplatePageId} from '../types';
import {TemplatePreviewBar, type ViewportMode} from './template-preview-bar';

export function TemplatePreviewShell({
  templateId,
  pageId,
  locale,
  useTemplateHref,
  children,
}: {
  templateId: TemplateId;
  pageId: TemplatePageId;
  locale: SiteLocale;
  useTemplateHref: string;
  children: ReactNode;
}) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');

  return (
    <div className="template-preview-shell min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <TemplatePreviewBar
        currentTemplateId={templateId}
        currentPageId={pageId}
        locale={locale}
        useTemplateHref={useTemplateHref}
        viewport={viewport}
        onViewportChange={setViewport}
      />
      <div
        className={`template-preview-viewport-wrapper flex-1 w-full flex justify-center transition-colors duration-200 ${
          viewport !== 'desktop' ? 'p-3 sm:p-8 bg-slate-950/95 overflow-x-auto' : ''
        }`}
      >
        <div
          className={`template-preview-frame-container w-full transition-all duration-300 ${
            viewport === 'tablet'
              ? 'max-w-[768px] rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60 ring-1 ring-slate-800 my-4'
              : viewport === 'mobile'
                ? 'max-w-[390px] rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-slate-800 ring-1 ring-slate-700/50 my-4'
                : 'max-w-full'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
