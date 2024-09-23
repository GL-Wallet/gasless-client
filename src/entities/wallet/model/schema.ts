import { z } from 'zod';

const balancesSchema = z.object({
  TRX: z.number(),
  USDT: z.number()
});

export const walletSchema = z.object({
  name: z.string().optional(),
  address: z.string(),
  publicKey: z.string(),
  path: z.string().optional(),
  balances: balancesSchema,
  encryptedMnemonic: z.string()
});

export const walletStoreSchema = z.object({
  activeIndex: z.number(),
  addresses: z.array(walletSchema)
});
