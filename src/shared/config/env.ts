import {z} from 'zod';

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const dbEnvSchema = z.object({
  MONGODB_URL: z.preprocess(emptyToUndefined, z.string().min(1))
});

const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.preprocess(emptyToUndefined, z.string().min(1)),
  BETTER_AUTH_URL: z.preprocess(
    emptyToUndefined,
    z.string().min(1).default('http://localhost:3000')
  )
});

const s3EnvSchema = z.object({
  S3_BUCKET: z.preprocess(emptyToUndefined, z.string().min(1)),
  S3_REGION: z.preprocess(emptyToUndefined, z.string().min(1)),
  S3_ACCESS_KEY_ID: z.preprocess(emptyToUndefined, z.string().min(1)),
  S3_SECRET_ACCESS_KEY: z.preprocess(emptyToUndefined, z.string().min(1)),
  S3_PUBLIC_BASE_URL: z.preprocess(emptyToUndefined, z.url()),
  S3_ENDPOINT: z.preprocess(emptyToUndefined, z.url().optional()),
  S3_FORCE_PATH_STYLE: z.preprocess(
    emptyToUndefined,
    z.enum(['true', 'false']).default('false')
  )
});

function readEnv<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  source: NodeJS.ProcessEnv = process.env
): z.output<z.ZodObject<T>> {
  const parsed = schema.safeParse(source);

  if (!parsed.success) {
    const names = [
      ...new Set(parsed.error.issues.map((issue) => String(issue.path[0])))
    ].join(', ');

    throw new Error(
      `Missing or invalid required environment variable(s): ${names}. Compare with .env.example.`
    );
  }

  return parsed.data;
}

export function getDbEnv(): z.output<typeof dbEnvSchema> {
  const source =
    process.env.NODE_ENV === 'test' && process.env.MONGODB_TEST_URL
      ? {...process.env, MONGODB_URL: process.env.MONGODB_TEST_URL}
      : process.env;

  return readEnv(dbEnvSchema, source);
}

export function getAuthEnv(): z.output<typeof authEnvSchema> {
  return readEnv(authEnvSchema);
}

export interface S3Env {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
  endpoint?: string;
  forcePathStyle: boolean;
}

export function getS3Env(): S3Env {
  const env = readEnv(s3EnvSchema);

  return {
    bucket: env.S3_BUCKET,
    region: env.S3_REGION,
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    publicBaseUrl: env.S3_PUBLIC_BASE_URL.replace(/\/+$/, ''),
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE === 'true'
  };
}
