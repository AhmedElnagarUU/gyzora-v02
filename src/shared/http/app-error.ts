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
  code: ApiErrorCode;
  status: number;
  fields?: Record<string, string>;

  constructor(code: ApiErrorCode, status: number, fields?: Record<string, string>) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}
