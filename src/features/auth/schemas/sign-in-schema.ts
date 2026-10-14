import {z} from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().email('validation.emailInvalid'),
  password: z.string().min(8, 'validation.passwordMin')
});

export type SignInValues = z.infer<typeof signInSchema>;
