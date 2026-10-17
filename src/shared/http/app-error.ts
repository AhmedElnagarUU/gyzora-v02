export const API_ERROR_CODES = [
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION_FAILED',
  'SITE_ALREADY_EXISTS',
  'NO_SITE',
  'SLUG_TAKEN',
  'SLUG_LOCKED',
  'STALE_REVISION',
  'NOT_PUBLISHABLE',
  'ENTITLEMENT_REQUIRED',
  'RATE_LIMITED',
  'UPLOAD_REJECTED',
  'REQUEST_PENDING',
  'INTERNAL'
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export class AppError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly status: number,
    readonly fields?: Record<string, string>
  ) {
    super(code);
    this.name = 'AppError';
  }
}
