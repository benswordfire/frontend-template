import { z } from 'zod';

export const EmailVerificationFormSchemaDto = z.object({
  token: z.string()
    .nonempty({ message: 'Please provide a token!' })
    .email({ message: 'Please token!' }),
});


export type EmailVerificationFormDto = z.infer<typeof EmailVerificationFormSchemaDto>;