import {NextResponse} from 'next/server';
import {ZodError} from 'zod';

import {AppError} from './app-error';

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({data}, {status});
}

export function zodFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.length ? issue.path.join('.') : '_';

    if (!(path in fields)) {
      fields[path] = issue.code;
    }
  }

  return fields;
}

export function fail(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {error: {code: error.code, ...(error.fields ? {fields: error.fields} : {})}},
      {status: error.status}
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {error: {code: 'VALIDATION_FAILED', fields: zodFields(error)}},
      {status: 400}
    );
  }

  console.error('Unhandled API error:', error);

  return NextResponse.json({error: {code: 'INTERNAL'}}, {status: 500});
}
