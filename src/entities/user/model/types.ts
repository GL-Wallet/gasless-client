import type { z } from 'zod'

import type { createUserSchema, userDataSchema, userSchema } from './schema'

export type User = z.infer<typeof userSchema>
export type UserData = z.infer<typeof userDataSchema>

export type CreateUser = z.infer<typeof createUserSchema>
