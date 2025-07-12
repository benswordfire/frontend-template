import { z } from 'zod'

export const EmailVerificationFormSchema = z.object({
  token: z.string(),
  _csrf: z.string()
})

export type EmailVerificationFormData = z.infer<typeof EmailVerificationFormSchema>;