import { z } from 'zod';

export const settingsSchema = z.object({
  isBiometryEnabled: z.boolean().default(false),
  isNewest: z.boolean().default(true),
  language: z.string().optional()
});
