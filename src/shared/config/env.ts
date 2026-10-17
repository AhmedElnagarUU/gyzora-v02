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
