import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string()
    .nonempty({ message: 'Email is required!' })
    .email({ message: 'Please provide a valid e-mail address!' }),
  password: z.string()
    .nonempty({ message: 'Password is required!' }),
});


export type LoginFormData = z.infer<typeof LoginFormSchema>;