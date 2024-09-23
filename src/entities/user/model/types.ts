import { createUserSchema, userSchema } from './schema';
import { z } from 'zod';

export type User = z.infer<typeof userSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;
