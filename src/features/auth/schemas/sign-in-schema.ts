import {z} from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().email('auth.validation.emailInvalid'),
  password: z.string().min(8, 'auth.validation.passwordMin')
});

export type SignInValues = z.infer<typeof signInSchema>;
