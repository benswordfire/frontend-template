import { z } from 'zod'

export const EmailVerificationFormSchema = z.object({
  email: z.string().email({ message: 'Email is required!' }),
  _csrf: z.string()
})

export type EmailVerificationFormData = z.infer<typeof EmailVerificationFormSchema>;