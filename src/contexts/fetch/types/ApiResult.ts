import { z } from 'zod'

export const ApiResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  authorized: z.boolean().optional(),
  isTwoFactorEnabled: z.enum(['disabled', 'email', 'sms']).optional(),
  verificationSid: z.string().optional()
});

export type ApiResult = z.infer<typeof ApiResultSchema>;
