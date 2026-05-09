import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RevokeHistoryItem } from '../types';

interface HistoryState {
  history: RevokeHistoryItem[];
  addHistory: (item: RevokeHistoryItem) => void;
  updateHistoryStatus: (txHash: string, status: RevokeHistoryItem['status']) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (item) =>
        set((state) => ({ history: [item, ...state.history] })),
      updateHistoryStatus: (txHash, status) =>
        set((state) => ({
          history: state.history.map((h) =>
            h.txHash === txHash ? { ...h, status } : h
          ),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'revokemywallet-history',
    }
  )
);
