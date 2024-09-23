import { walletSchema } from './schema';
import { z } from 'zod';

export type Wallet = z.infer<typeof walletSchema>;

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'EXPIRED' | 'FAILED' | 'REJECTED';

export type CreateWallet = Omit<Wallet, 'balances' | 'transactions'>;
