import {z} from 'zod';

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'auth.validation.nameMin'),
  email: z.string().trim().email('auth.validation.emailInvalid'),
  password: z.string().min(8, 'auth.validation.passwordMin')
});

export type SignUpValues = z.infer<typeof signUpSchema>;
