import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAccount, useDisconnect, useReconnect } from 'wagmi';
import type { Approval } from './types';
import { SUPPORTED_CHAINS, getApprovalKey, getExplorerTxUrl, truncateAddress } from './types';
import { useScanStore } from './stores/scanStore';
import { useHistoryStore } from './stores/historyStore';
import { useMultichainScan } from './hooks/useMultichainScan';
import type { ApprovalEntry } from './hooks/useMultichainScan';
import { useRevoke } from './hooks/useRevoke';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import SplashScreen from './components/SplashScreen';
import ChainSelector from './components/ChainSelector';
import ScanButton from './components/ScanButton';
import ApprovalList from './components/ApprovalList';
import RevokeButton from './components/RevokeButton';
import GasWarningModal from './components/GasWarningModal';
import ConfirmModal from './components/ConfirmModal';
import HistoryTab from './components/HistoryTab';
import Tabs from './components/Tabs';
import { showSuccess, showError } from './components/Toast';
import { ShieldCheck, Wallet, LogOut } from 'lucide-react';

const ALL_CHAIN_IDS = SUPPORTED_CHAINS.map((c) => c.id);
const CHAIN_MAP = new Map(SUPPORTED_CHAINS.map((c) => [c.id, c]));

const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

function approvalToApprovalEntry(a: Approval): ApprovalEntry {
  return {
    chainId: a.chainId,
    token_address: a.tokenAddress,
    token_name: a.tokenName,
    token_symbol: a.tokenSymbol,
    token_logo: null,
    token_type: a.tokenType,
    possible_spam: a.possibleSpam,
    approved_address: a.spender,
    approved_amount: a.amount,
    token_id: a.tokenId ?? null,
    block_number: a.blockNumber?.toString() ?? '',
    block_timestamp: '',
    transaction_hash: '',
  };
}

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
    possibleSpam: entry.possible_spam,
    tokenId: entry.token_id ?? undefined,
    blockNumber: entry.block_number ? Number(entry.block_number) : undefined,
  };
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('revokemywallet_splash_dismissed');
  });
  const [activeTab, setActiveTab] = useState<'approvals' | 'history'>('approvals');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { reconnect } = useReconnect();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected && !isConnecting && !isReconnecting) {
        setTimeout(() => {
          if (!isConnected && !isConnecting && !isReconnecting) {
            reconnect();
          }
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isConnected, isConnecting, isReconnecting, reconnect]);

  const selectedChains = useScanStore((s) => s.selectedChains);
  const approvals = useScanStore((s) => s.approvals);
  const selectedApprovals = useScanStore((s) => s.selectedApprovals);
  const setApprovals = useScanStore((s) => s.setApprovals);
  const clearSelection = useScanStore((s) => s.clearSelection);
  const removeApprovals = useScanStore((s) => s.removeApprovals);
  const setIsScanning = useScanStore((s) => s.setIsScanning);
  const setScanProgress = useScanStore((s) => s.setScanProgress);
  const addHistory = useHistoryStore((s) => s.addHistory);
  const { sendToBot, haptic, hapticImpact } = useTelegramWebApp();
  const { revokeBatch, isBatchProcessing, batchProgress } = useRevoke();

  const chainIdsToScan = selectedChains.length > 0 ? selectedChains : ALL_CHAIN_IDS;

  const { refetch } = useMultichainScan(address, chainIdsToScan);

  const handleDismissSplash = useCallback(() => {
    setShowSplash(false);
    localStorage.setItem('revokemywallet_splash_dismissed', '1');
  }, []);

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

      const byChain = new Map<number, Approval[]>();

      for (const entry of allEntries) {
        const approval = approvalEntryToApproval(entry);
        const existing = byChain.get(approval.chainId) ?? [];
        existing.push(approval);
        byChain.set(approval.chainId, existing);
      }

      for (const [chainId, chainApprovals] of byChain) {
        setApprovals(chainId, chainApprovals);
      }

      setIsScanning(false);

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
    const currentApprovals = useScanStore.getState().approvals;
    if (selected.size === 0) return;

    const entriesToRevoke: ApprovalEntry[] = [];
    for (const key of selected) {
      for (const chainApprovals of Object.values(currentApprovals)) {
        for (const a of chainApprovals) {
          const aKey = getApprovalKey(a.chainId, a.tokenAddress, a.spender);
          if (aKey === key) {
            entriesToRevoke.push(approvalToApprovalEntry(a));
            break;
          }
        }
      }
    }

    if (entriesToRevoke.length === 0) {
      showError('No valid approvals to revoke');
      return;
    }

    try {
      const results = await revokeBatch({ approvals: entriesToRevoke });

      let successCount = 0;
      let failCount = 0;
      let firstErrorMsg = '';

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
        } else if (result.error) {
          failCount++;
          if (!firstErrorMsg) firstErrorMsg = result.error.message;
          addHistory({
            txHash: `failed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            chainId: result.approval.chainId,
            chainName: chain?.name ?? `Chain ${result.approval.chainId}`,
            tokenSymbol: result.approval.token_symbol,
            tokenAddress: result.approval.token_address,
            spender: result.approval.approved_address,
            timestamp: Date.now(),
            status: 'failed',
            errorMessage: result.error.message,
            explorerUrl: '',
          });
        }
      }

      const revokedKeys = results
        .filter((r) => r.txHash)
        .map((r) => getApprovalKey(r.approval.chainId, r.approval.token_address, r.approval.approved_address));
      if (revokedKeys.length > 0) {
        removeApprovals(revokedKeys);
      }

      clearSelection();
      setShowConfirmModal(false);

      if (successCount > 0 && failCount === 0) {
        showSuccess(`Successfully revoked ${successCount} approval${successCount > 1 ? 's' : ''}`);
        haptic('success');
      } else if (successCount > 0 && failCount > 0) {
        showSuccess(`${successCount} revoked, ${failCount} failed: ${firstErrorMsg}`);
        haptic('warning');
      } else if (failCount > 0) {
        showError(`All ${failCount} revokes failed: ${firstErrorMsg}`);
        haptic('error');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showError(`Revoke failed: ${msg}`);
      haptic('error');
    }
  }, [revokeBatch, addHistory, clearSelection, haptic]);

  const selectedApprovalList = useMemo(() => {
    const result: Approval[] = [];
    for (const chainApprovals of Object.values(approvals ?? {})) {
      for (const a of chainApprovals) {
        const key = getApprovalKey(a.chainId, a.tokenAddress, a.spender);
        if (selectedApprovals.has(key)) {
          result.push(a);
        }
      }
    }
    return result;
  }, [approvals, selectedApprovals]);

  const visibleApprovalCount = useMemo(() => {
    const allChainIds = SUPPORTED_CHAINS.map((c) => c.id);
    const isAll = selectedChains.length === 0 || selectedChains.length === allChainIds.length;
    let count = 0;
    for (const [chainIdStr, chainApprovals] of Object.entries(approvals ?? {})) {
      const chainId = Number(chainIdStr);
      if (isAll || selectedChains.includes(chainId)) {
        count += chainApprovals.length;
      }
    }
    return count;
  }, [approvals, selectedChains]);

  if (showSplash) {
    return <SplashScreen onGetStarted={handleDismissSplash} />;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">
      {/* Gradient accent line at very top */}
      <div className="accent-line" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-blue/10 border border-brand-blue/15">
              <ShieldCheck className="w-5 h-5 text-brand-blue" strokeWidth={2} />
            </div>
            <span className="font-extrabold text-base tracking-[-0.03em]">
              <span className="text-white">revoke</span>
              <span className="text-brand-blue">my</span>
              <span className="text-brand-red">wallet</span>
            </span>
          </div>

          {isConnected && address && (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-pill bg-brand-surface border border-white/[0.04]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
                <span className="text-gray-400 text-xs font-mono font-bold">
                  {truncateAddress(address)}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="p-2 text-gray-600 hover:text-brand-red transition-colors rounded-xl hover:bg-brand-red/10"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-5 py-4 pb-20 space-y-4 overflow-y-auto">
        {activeTab === 'approvals' && (
          <>
            <ChainSelector />

            {!isConnected ? (
              <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-brand-blue/15 blur-xl" />
                  <div className="relative p-5 rounded-2xl bg-brand-surface border border-white/[0.04]">
                    <Wallet className="w-10 h-10 text-brand-blue" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-extrabold text-base tracking-tight mb-1.5">
                    {isConnecting || isReconnecting ? 'Connecting…' : 'Connect Wallet'}
                  </p>
                  <p className="text-gray-600 text-xs font-medium">
                    Scan and revoke token approvals across 8 chains
                  </p>
                </div>
                <appkit-button />
                {(isConnecting || isReconnecting) && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('revokemywallet-wagmi');
                      localStorage.removeItem('wagmi.store');
                      localStorage.removeItem('wagmi.recentConnectorId');
                      window.location.reload();
                    }}
                    className="text-xs text-gray-600 hover:text-brand-red underline transition-colors font-medium"
                  >
                    Stuck? Reset connection
                  </button>
                )}
              </div>
            ) : (
              <>
                <ScanButton onClick={handleScan} />
                {visibleApprovalCount > 0 && (
                  <div className="flex items-center justify-between px-1 animate-fade-in">
                    <span className="text-gray-400 text-xs font-bold tracking-tight">
                      {visibleApprovalCount} approval{visibleApprovalCount !== 1 ? 's' : ''} found
                    </span>
                    <span className="text-gray-600 text-[11px] font-mono font-bold">
                      {selectedApprovals.size} selected
                    </span>
                  </div>
                )}
                <ApprovalList />
              </>
            )}
          </>
        )}

        {activeTab === 'history' && <HistoryTab />}
      </main>

      {/* Revoke button */}
      {activeTab === 'approvals' && isConnected && (
        <RevokeButton
          onRevokeSelected={handleRevokeSelected}
          isRevoking={isBatchProcessing}
        />
      )}

      {/* Bottom tabs */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmRevoke}
        approvals={selectedApprovalList}
        isRevoking={isBatchProcessing}
        batchProgress={batchProgress}
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
