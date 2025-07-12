import { z } from 'zod'

export const AppErrorSchema = z.object({
  id: z.string(),
  message: z.string(),
  detail: z.string().optional(),
  code: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high']),
  timestamp: z.date(),
  source: z.string().optional()
});

export type AppError = z.infer<typeof AppErrorSchema>;