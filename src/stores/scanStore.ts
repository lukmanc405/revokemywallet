import { create } from 'zustand';
import { type Approval, getApprovalKey } from '../types';

interface ScanState {
  approvals: Record<number, Approval[]>;
  selectedApprovals: Set<string>;
  isScanning: boolean;
  scanProgress: { current: number; total: number };
  selectedChains: number[];
  setApprovals: (chainId: number, approvals: Approval[]) => void;
  toggleSelection: (approvalKey: string) => void;
  selectAll: (chainId?: number) => void;
  clearSelection: () => void;
  setIsScanning: (scanning: boolean) => void;
  setScanProgress: (current: number, total: number) => void;
  setSelectedChains: (chains: number[]) => void;
  removeApprovals: (keys: string[]) => void;
  reset: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  approvals: {},
  selectedApprovals: new Set<string>(),
  isScanning: false,
  scanProgress: { current: 0, total: 0 },
  selectedChains: [],
  setApprovals: (chainId, approvals) =>
    set((state) => ({
      approvals: { ...state.approvals, [chainId]: approvals },
    })),
  toggleSelection: (approvalKey) =>
    set((state) => {
      const next = new Set(state.selectedApprovals);
      if (next.has(approvalKey)) {
        next.delete(approvalKey);
      } else {
        next.add(approvalKey);
      }
      return { selectedApprovals: next };
    }),
  selectAll: (chainId) =>
    set((state) => {
      const next = new Set(state.selectedApprovals);
      const chains = chainId !== undefined ? [chainId] : Object.keys(state.approvals).map(Number);
      for (const cid of chains) {
        const items = state.approvals[cid] ?? [];
        for (const a of items) {
          next.add(getApprovalKey(a.chainId, a.tokenAddress, a.spender));
        }
      }
      return { selectedApprovals: next };
    }),
  clearSelection: () => set({ selectedApprovals: new Set<string>() }),
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  setScanProgress: (current, total) => set({ scanProgress: { current, total } }),
  setSelectedChains: (chains) => set({ selectedChains: chains }),
  removeApprovals: (keys) =>
    set((state) => {
      const keysSet = new Set(keys);
      const newApprovals: Record<number, Approval[]> = {};
      for (const [chainIdStr, chainApprovals] of Object.entries(state.approvals)) {
        const filtered = chainApprovals.filter(
          (a) => !keysSet.has(getApprovalKey(a.chainId, a.tokenAddress, a.spender))
        );
        if (filtered.length > 0) {
          newApprovals[Number(chainIdStr)] = filtered;
        }
      }
      const newSelected = new Set(state.selectedApprovals);
      for (const key of keys) {
        newSelected.delete(key);
      }
      return { approvals: newApprovals, selectedApprovals: newSelected };
    }),
  reset: () =>
    set({
      approvals: {},
      selectedApprovals: new Set<string>(),
      isScanning: false,
      scanProgress: { current: 0, total: 0 },
    }),
}));

export { getApprovalKey };
