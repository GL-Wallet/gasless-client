import { settingsSchema } from './schema';
import { z } from 'zod';

export type Settings = z.infer<typeof settingsSchema>;
