import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(['collector', 'creator']).default('collector'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
