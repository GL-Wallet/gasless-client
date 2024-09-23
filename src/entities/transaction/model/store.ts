import { create } from 'zustand';
import { Transaction } from './types';

type State = {
  transactions: Transaction[];
};

type Actions = {
  getTransaction(txid: string): Transaction | null;
  setTransactions(transactions: Transaction[]): void;
};

export const useTransactionStore = create<State & Actions>((set, get) => ({
  transactions: [],

  getTransaction(txid) {
    const { transactions } = get();
    return transactions.find((t) => t.txid === txid) || null;
  },

  setTransactions(transactions) {
    set({ transactions });
  },
}));
