import {z} from 'zod';

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'validation.nameMin'),
  email: z.string().trim().email('validation.emailInvalid'),
  password: z.string().min(8, 'validation.passwordMin')
});

export type SignUpValues = z.infer<typeof signUpSchema>;
