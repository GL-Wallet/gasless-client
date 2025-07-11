import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
})

export const userDataSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  referrerId: z.number().optional(),
  referrerPartnerId: z.number().optional(),
  referrerPartnerLevel: z.number().optional(),
  currentReward: z.number().default(0),
  totalReward: z.number().default(0),
  currentPartnerReward: z.number().optional(),
  totalPartnerReward: z.number().optional(),
  isPartner: z.boolean().default(false),
  partnerRewardGrid: z.array(z.number()).default([]),
  createdAt: z.string(),
})

export const createUserSchema = z.object({
  userName: z.string().optional(),
  referrerId: z.string().optional(),
})
