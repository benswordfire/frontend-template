import { z } from 'zod'

export const UpdateProfileFormSchemaDto = z.object({
  email: z.preprocess((val) => (val === '' ? undefined : val), z.string().email().optional()),
  username: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
  firstName: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
  lastName: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
  phoneNumber: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
});


export type UpdateProfileFormDto = z.infer<typeof UpdateProfileFormSchemaDto>;