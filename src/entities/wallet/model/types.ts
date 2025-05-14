import type { z } from 'zod'
import type { walletSchema } from './schema'

export type Wallet = z.infer<typeof walletSchema>

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'EXPIRED' | 'FAILED' | 'REJECTED'

export type CreateWallet = Omit<Wallet, 'balances' | 'transactions'>
