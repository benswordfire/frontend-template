import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  isPhoneNumberVerified: z.preprocess((val) => new Date(val as string), z.date()), 
  isEmailVerified: z.preprocess((val) => new Date(val as string), z.date()), 
  twoFactorAuthMethod: z.enum(['email', 'disabled', 'sms']),
  createdAt: z.preprocess((val) => new Date(val as string), z.date()),
  updatedAt: z.preprocess((val) => new Date(val as string), z.date())
});

export type User = z.infer<typeof UserSchema>;