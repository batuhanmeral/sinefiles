import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'auth.errors.identifierRequired'),
  password: z.string().min(1, 'auth.errors.passwordRequired'),
});

export const registerSchema = z.object({
  email: z.string().email('auth.errors.emailInvalid'),
  username: z
    .string()
    .min(3, 'auth.errors.usernameShort')
    .max(24, 'auth.errors.usernameLong')
    .regex(/^[a-z0-9_]+$/, 'auth.errors.usernamePattern'),
  password: z.string().min(8, 'auth.errors.passwordShort').max(128, 'auth.errors.passwordLong'),
  displayName: z.string().min(1).max(64).optional().or(z.literal('')),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
