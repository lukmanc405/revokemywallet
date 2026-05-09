import { useState, useRef, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import type { Approval } from './types';
import { SUPPORTED_CHAINS, getApprovalKey, getExplorerTxUrl } from './types';
import { useScanStore } from './stores/scanStore';
import { useHistoryStore } from './stores/historyStore';
import { useMultichainScan } from './hooks/useMultichainScan';
import type { ApprovalEntry } from './hooks/useMultichainScan';
import { useRevoke } from './hooks/useRevoke';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import ChainSelector from './components/ChainSelector';
import ScanButton from './components/ScanButton';
import ApprovalList from './components/ApprovalList';
import RevokeButton from './components/RevokeButton';
import GasWarningModal from './components/GasWarningModal';
import ConfirmModal from './components/ConfirmModal';
import HistoryTab from './components/HistoryTab';
import Tabs from './components/Tabs';
import { showSuccess, showError } from './components/Toast';

const ALL_CHAIN_IDS = SUPPORTED_CHAINS.map((c) => c.id);
const CHAIN_MAP = new Map(SUPPORTED_CHAINS.map((c) => [c.id, c]));

const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

function approvalEntryToApproval(entry: ApprovalEntry): Approval {
  const chain = CHAIN_MAP.get(entry.chainId);
  return {
    chainId: entry.chainId,
    chainName: chain?.name ?? `Chain ${entry.chainId}`,
    tokenAddress: entry.token_address,
    tokenName: entry.token_name,
    tokenSymbol: entry.token_symbol,
    tokenType: entry.token_type,
    spender: entry.approved_address,
    amount: entry.approved_amount,
    isUnlimited: entry.approved_amount === MAX_UINT256,
    possibleSpam: false,
    tokenId: entry.token_id ?? undefined,
    blockNumber: entry.block_number ? Number(entry.block_number) : undefined,
  };
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'approvals' | 'history'>('approvals');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { address, isConnected } = useAccount();
  const selectedChains = useScanStore((s) => s.selectedChains);
  const approvals = useScanStore((s) => s.approvals);
  const selectedApprovals = useScanStore((s) => s.selectedApprovals);
  const setApprovals = useScanStore((s) => s.setApprovals);
  const clearSelection = useScanStore((s) => s.clearSelection);
  const setIsScanning = useScanStore((s) => s.setIsScanning);
  const setScanProgress = useScanStore((s) => s.setScanProgress);
  const addHistory = useHistoryStore((s) => s.addHistory);
  const { sendToBot, haptic, hapticImpact } = useTelegramWebApp();
  const { revokeBatch, isBatchProcessing } = useRevoke();

  // Map from approval key → raw ApprovalEntry for revoke operations
  const entryMapRef = useRef<Map<string, ApprovalEntry>>(new Map());

  const chainIdsToScan = selectedChains.length > 0 ? selectedChains : ALL_CHAIN_IDS;

  const { refetch } = useMultichainScan(address, chainIdsToScan);

  const handleScan = useCallback(async () => {
    if (!address) return;
    setIsScanning(true);
    setScanProgress(0, chainIdsToScan.length);
    hapticImpact();

    try {
      const { data } = await refetch();
      if (!data) {
        setIsScanning(false);
        return;
      }

      const allEntries: ApprovalEntry[] = [];
      for (const result of data) {
        allEntries.push(...result.approvals);
        setScanProgress(
          data.indexOf(result) + 1,
          data.length,
        );
      }

      // Update entry map for revoke lookups
      const newMap = new Map<string, ApprovalEntry>();
      const byChain = new Map<number, Approval[]>();

      for (const entry of allEntries) {
        const approval = approvalEntryToApproval(entry);
        const key = getApprovalKey(approval.chainId, approval.tokenAddress, approval.spender);
        newMap.set(key, entry);

        const existing = byChain.get(approval.chainId) ?? [];
        existing.push(approval);
        byChain.set(approval.chainId, existing);
      }
      entryMapRef.current = newMap;

      // Store approvals in scan store
      for (const [chainId, chainApprovals] of byChain) {
        setApprovals(chainId, chainApprovals);
      }

      setIsScanning(false);

      // Send summary to bot
      sendToBot({
        action: 'scan_complete',
        address,
        totalApprovals: allEntries.length,
        chains: [...byChain.keys()],
      });

      showSuccess(`Found ${allEntries.length} approvals across ${byChain.size} chains`);
      haptic('success');
    } catch {
      setIsScanning(false);
      showError('Scan failed. Please try again.');
      haptic('error');
    }
  }, [address, chainIdsToScan, refetch, setIsScanning, setScanProgress, setApprovals, sendToBot, haptic]);

  const handleRevokeSelected = useCallback(() => {
    setShowConfirmModal(true);
    hapticImpact();
  }, [hapticImpact]);

  const handleConfirmRevoke = useCallback(async () => {
    const selected = useScanStore.getState().selectedApprovals;
    if (selected.size === 0) return;

    const entriesToRevoke: ApprovalEntry[] = [];
    for (const key of selected) {
      const entry = entryMapRef.current.get(key);
      if (entry) entriesToRevoke.push(entry);
    }

    if (entriesToRevoke.length === 0) {
      showError('No valid approvals to revoke');
      return;
    }

    try {
      const results = await revokeBatch({ approvals: entriesToRevoke });

      let successCount = 0;
      for (const result of results) {
        const chain = CHAIN_MAP.get(result.approval.chainId);

        if (result.txHash) {
          successCount++;
          addHistory({
            txHash: result.txHash,
            chainId: result.approval.chainId,
            chainName: chain?.name ?? `Chain ${result.approval.chainId}`,
            tokenSymbol: result.approval.token_symbol,
            tokenAddress: result.approval.token_address,
            spender: result.approval.approved_address,
            timestamp: Date.now(),
            status: 'success',
            explorerUrl: chain
              ? getExplorerTxUrl(chain.explorerUrl, result.txHash)
              : `https://etherscan.io/tx/${result.txHash}`,
          });

          sendToBot({
            action: 'revoke_success',
            txHash: result.txHash,
            chainId: result.approval.chainId,
            tokenSymbol: result.approval.token_symbol,
            spender: result.approval.approved_address,
          });
        } else if (result.error) {
          addHistory({
            txHash: `failed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            chainId: result.approval.chainId,
            chainName: chain?.name ?? `Chain ${result.approval.chainId}`,
            tokenSymbol: result.approval.token_symbol,
            tokenAddress: result.approval.token_address,
            spender: result.approval.approved_address,
            timestamp: Date.now(),
            status: 'failed',
            explorerUrl: '',
          });
        }
      }

      clearSelection();
      setShowConfirmModal(false);

      if (successCount > 0) {
        showSuccess(`Successfully revoked ${successCount} approval${successCount > 1 ? 's' : ''}`);
        haptic('success');
      }
    } catch {
      showError('Revoke failed. Please try again.');
      haptic('error');
    }
  }, [revokeBatch, addHistory, sendToBot, clearSelection, haptic]);

  // Get selected approvals for the confirm modal (reactive)
  const selectedApprovalList = useMemo(() => {
    const result: Approval[] = [];
    for (const chainApprovals of Object.values(approvals)) {
      for (const a of chainApprovals) {
        const key = getApprovalKey(a.chainId, a.tokenAddress, a.spender);
        if (selectedApprovals.has(key)) {
          result.push(a);
        }
      }
    }
    return result;
  }, [approvals, selectedApprovals]);

  if (showSplash) {
    return <SplashScreen onGetStarted={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-4 pb-20 space-y-4 overflow-y-auto">
        {activeTab === 'approvals' && (
          <>
            <ChainSelector />

            {!isConnected ? (
              <WalletConnect />
            ) : (
              <>
                <ScanButton onClick={handleScan} />
                <ApprovalList />
              </>
            )}
          </>
        )}

        {activeTab === 'history' && <HistoryTab />}
      </main>

      {activeTab === 'approvals' && isConnected && (
        <RevokeButton
          onRevokeSelected={handleRevokeSelected}
          isRevoking={isBatchProcessing}
        />
      )}

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmRevoke}
        approvals={selectedApprovalList}
        isRevoking={isBatchProcessing}
      />

      <GasWarningModal
        isOpen={false}
        onClose={() => {}}
        onTopUp={() => {}}
        currentBalance="0"
        estimatedFee="0"
        deficit="0"
        nativeCurrency="ETH"
      />
    </div>
  );
}
