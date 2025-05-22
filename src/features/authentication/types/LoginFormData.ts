import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Email is required!' }),
  password: z.string({ message: 'Password is required!' }).min(6, { message: 'Password must be at least 6 characters!' }),
  _csrf: z.string()
})

export type LoginFormData = z.infer<typeof LoginFormSchema>;