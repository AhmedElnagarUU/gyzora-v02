'use client';

import Image from 'next/image';
import {useState} from 'react';
import type {SiteLocale} from '@/features/sites/types/site';
import type {TemplateImage} from '../types';

export function TemplateImageFrame({
  image,
  locale,
  className,
}: {
  image: TemplateImage;
  locale: SiteLocale;
  className: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = image.src.trim();
  const failed = !src || failedSrc === src;

  return (
    <div className={`template-image-frame ${className}`}>
      {failed ? (
        <div className="template-image-placeholder" aria-hidden="true" />
      ) : (
        <Image
          src={src}
          alt={image.alt[locale]}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 40vw"
          unoptimized
          onError={() => setFailedSrc(src)}
        />
      )}
    </div>
  );
}
