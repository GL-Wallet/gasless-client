import { z } from 'zod';

export const settingsSchema = z.object({
  isBiometryEnabled: z.boolean().default(false)
});
