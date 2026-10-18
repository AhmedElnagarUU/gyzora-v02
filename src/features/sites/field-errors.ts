const NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9]{0,31}$/;
const CODE_PATTERN = /^[a-z][a-z0-9_]{0,31}$/;
const MAX_FIELD_ERRORS = 10;

export interface FieldError {
  name: string;
  code: string;
}

export function parseFieldErrors(value: string | string[] | undefined): FieldError[] {
  if (typeof value !== 'string') return [];

  return value
    .split(',')
    .map((entry) => entry.split(':'))
    .filter(
      (parts): parts is [string, string] =>
        parts.length === 2 && NAME_PATTERN.test(parts[0]) && CODE_PATTERN.test(parts[1])
    )
    .slice(0, MAX_FIELD_ERRORS)
    .map(([name, code]) => ({name, code}));
}

export function serializeFieldErrors(fields: Record<string, string>): string {
  return Object.entries(fields)
    .filter(([name, code]) => NAME_PATTERN.test(name) && CODE_PATTERN.test(code))
    .slice(0, MAX_FIELD_ERRORS)
    .map(([name, code]) => `${name}:${code}`)
    .join(',');
}
