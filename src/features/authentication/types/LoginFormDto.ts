import { z } from 'zod';

export const LoginFormSchemaDto = z.object({
  email: z.string()
    .nonempty({ message: 'Please provide a valid e-mail address!' })
    .email({ message: 'Please provide a valid e-mail address!' }),
  password: z.string()
    .nonempty({ message: 'Password is required!' }),
});


export type LoginFormDto = z.infer<typeof LoginFormSchemaDto>;