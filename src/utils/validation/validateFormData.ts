import { ZodSchema } from 'zod';

type ValidationResult<T> = { parsed: Zod.SafeParseSuccess<T>; errors?: undefined }
  | { parsed?: undefined; errors: Partial<Record<keyof T, string>> };


export const validateFormData = <T>(formData: T, schema: ZodSchema<T>): ValidationResult<T> => {
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    const errors: Partial<Record<keyof T, string>> = {};

    for (const error of parsed.error.errors) {
      errors[error.path[0] as keyof T] = error.message;
    }
  
    return { errors };
  }

  return { parsed };
};
