'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useEffect, useRef, useState} from 'react';

import {IMAGE_CONTENT_TYPES, MAX_IMAGE_BYTES, type ImageKind} from '@/features/images/keys';

type UploadStatus = 'idle' | 'uploading' | 'failed';

const isAllowedType = (value: string): boolean =>
  (IMAGE_CONTENT_TYPES as readonly string[]).includes(value);

export function ImageUploader({
  kind,
  value,
  previewUrl,
  onChange,
  disabled = false,
}: {
  kind: ImageKind;
  value: string;
  previewUrl?: string;
  onChange: (key: string) => void;
  disabled?: boolean;
}) {
  const t = useTranslations('common.imageUploader');
  const tErrors = useTranslations('errors');
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<XMLHttpRequest | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [retryFile, setRetryFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const messageForCode = (code: string | undefined): string => {
    if (!code) return t('failed');
    if (tErrors.has(`field.${code}`)) return tErrors(`field.${code}`);
    if (tErrors.has(code)) return tErrors(code);

    return t('failed');
  };

  const parseError = async (response: Response): Promise<string> => {
    const body = (await response.json().catch(() => null)) as {
      error?: {code?: string; fields?: Record<string, string>};
    } | null;

    return messageForCode(body?.error?.fields ? Object.values(body.error.fields)[0] : body?.error?.code);
  };

  const resetPreview = () => {
    setObjectUrl(null);
  };

  const upload = async (file: File) => {
    setRetryFile(file);
    setError(null);

    if (!isAllowedType(file.type)) {
      setStatus('failed');
      setError(t('invalidType'));

      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setStatus('failed');
      setError(t('tooLarge'));

      return;
    }

    setStatus('uploading');
    setProgress(0);

    try {
      const presignResponse = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({kind, contentType: file.type, size: file.size}),
      });

      if (!presignResponse.ok) {
        setStatus('failed');
        setError(await parseError(presignResponse));

        return;
      }

      const presign = (await presignResponse.json()) as {
        data: {uploadUrl: string; key: string; headers: Record<string, string>};
      };

      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        requestRef.current = request;
        request.open('PUT', presign.data.uploadUrl);

        for (const [name, headerValue] of Object.entries(presign.data.headers)) {
          request.setRequestHeader(name, headerValue);
        }

        request.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        request.onload = () => {
          if (request.status >= 200 && request.status < 300) {
            resetPreview();
            setObjectUrl(URL.createObjectURL(file));
            onChange(presign.data.key);
            setStatus('idle');
            setProgress(0);
            resolve();

            return;
          }

          reject(new Error('UPLOAD_FAILED'));
        };

        request.onerror = () => reject(new Error('UPLOAD_FAILED'));
        request.onabort = () => reject(new Error('UPLOAD_ABORTED'));
        request.send(file);
      });
    } catch {
      setStatus('failed');
      setError(t('failed'));
    }
  };

  const remove = () => {
    resetPreview();
    setRetryFile(null);
    setError(null);
    setStatus('idle');
    setProgress(0);

    if (inputRef.current) inputRef.current.value = '';
    onChange('');
  };

  const preview = objectUrl ?? (value ? previewUrl : undefined);
  const isUploading = status === 'uploading';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative size-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {preview ? (
            <Image src={preview} alt={t('previewAlt')} fill sizes="96px" unoptimized className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-slate-400">
              {t('empty')}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60"
          >
            {value ? t('replace') : t('choose')}
          </button>
          {value ? (
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={remove}
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:opacity-60"
            >
              {t('remove')}
            </button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_CONTENT_TYPES.join(',')}
          className="sr-only"
          aria-label={t('choose')}
          disabled={disabled || isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) void upload(file);
          }}
        />
      </div>

      <p role="status" aria-live="polite" className="text-xs text-slate-500">
        {isUploading ? t('uploading', {percent: progress}) : t('hint')}
      </p>

      {status === 'failed' && error ? (
        <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-red-700">
          <span>{error}</span>
          {retryFile ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => void upload(retryFile)}
              className="font-semibold underline underline-offset-4"
            >
              {t('retry')}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
