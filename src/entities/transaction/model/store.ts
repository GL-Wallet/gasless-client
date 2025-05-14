import type { Transaction } from './types'
import { create } from 'zustand'

interface State {
  transactions: Transaction[]
}

interface Actions {
  getTransaction: (txid: string) => Transaction | null
  setTransactions: (transactions: Transaction[]) => void
}

export const useTransactionStore = create<State & Actions>((set, get) => ({
  transactions: [],

  getTransaction(txid) {
    const { transactions } = get()
    return transactions.find(t => t.txid === txid) || null
  },

  setTransactions(transactions) {
    set({ transactions })
  },
}))
