import { z } from 'zod';

export const importWalletFormSchema = z.object({
  seedPhrase: z.string()
});
