import { z } from 'zod';

export const RegistrationFormSchema = z.object({
  email: z.string()
    .nonempty({ message: 'Email is required!' })
    .email({ message: 'Please provide a valid e-mail address!' }),
  password: z.string()
    .nonempty(),
});


export type RegistrationFormData = z.infer<typeof RegistrationFormSchema>;