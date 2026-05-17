import { useEffect, useRef, useState } from 'react';
import {
  getBalanceBroadcastKey,
  hydrateCachedBalance,
  publishBalanceBroadcast,
  pushServerBalanceHint,
  readServerBalanceHint,
  settlePendingTransfers,
  stagePendingTransfer,
  writeCachedBalance,
} from '../state/bankStateStore';
import { bootstrapTransferAuth, executeTransferRequest } from '../services/transferService';

const mockTransactions = [
  { id: '#TRX-892', date: '2026-10-20T14:32:00Z', recipient: 'NeoCorp Logistics', status: 'Completed', amount: -1450.00 },
  { id: '#TRX-891', date: '2026-10-20T09:15:00Z', recipient: 'SYS_UNKNOWN', status: 'Pending', amount: -89000.00 },
  { id: '#TRX-890', date: '2026-10-19T11:00:00Z', recipient: 'Salary Deposit', status: 'Completed', amount: 12000.00 },
  { id: '#TRX-889', date: '2026-10-19T10:20:00Z', recipient: 'Glitch City Power', status: 'Failed', amount: -320.50 },
  { id: '#TRX-888', date: '2026-10-12T08:00:00Z', recipient: 'Cyberware Upgrades', status: 'Completed', amount: -4200.00 },
  { id: '#TRX-887', date: '2026-10-10T14:00:00Z', recipient: 'AeroDyne Systems', status: 'Completed', amount: -150.00 },
  { id: '#TRX-886', date: '2026-10-09T09:00:00Z', recipient: 'Mercenary Guild', status: 'Completed', amount: -8500.00 },
];

const mockBeneficiaries = [
  { id: 'b1', name: 'NeoCorp Logistics', account: 'NC-9921' },
  { id: 'b2', name: 'AeroDyne Systems', account: 'AD-4412' },
  { id: 'b3', name: 'Mercenary Guild', account: 'MG-0001' },
  { id: 'b4', name: 'Glitch City Power', account: 'GC-8822' }
];

export function useBankData() {
  const initialBalance = hydrateCachedBalance(5212190.45);
  const [balance, setBalance] = useState(initialBalance);
  const [savings] = useState(3240000.00);
  const authRef = useRef(bootstrapTransferAuth());
  const balanceRef = useRef(initialBalance);

  const transferFunds = async (amount, beneficiary) => {
    const transferAmount = Number(amount);
    if (!Number.isFinite(transferAmount) || transferAmount <= 0 || !beneficiary) {
      return { success: false };
    }

    const hintedServerBalance = readServerBalanceHint();
    if (Number.isFinite(hintedServerBalance) && Math.abs(hintedServerBalance - balanceRef.current) > 0.009) {
      balanceRef.current = hintedServerBalance;
    }

    const openingBalance = balanceRef.current;

// Prevent insufficient funds
if (transferAmount > openingBalance) {
  return {
    success: false,
    message: 'Insufficient Funds.'
  };
}

const optimisticBalance = Number(
  (openingBalance - transferAmount).toFixed(2)
);

setBalance(balanceRef.current = optimisticBalance);

    stagePendingTransfer({
      openingBalance,
      amount: transferAmount,
      etaMs: Date.now() + 1700,
    });

    const result = await executeTransferRequest({
      amount: transferAmount,
      beneficiary,
      openingBalance,
      requestToken: authRef.current.requestToken,
    });

    if (!result.ok) {
        setBalance(balanceRef.current = openingBalance);
      return { success: false, silent: result.silent };
    }

    pushServerBalanceHint(result.settledBalance, result.ledgerVersion);

    window.setTimeout(() => {
      writeCachedBalance(result.settledBalance, result.ledgerVersion);
    }, 2400);

    setBalance(balanceRef.current = result.settledBalance);

    publishBalanceBroadcast(result.settledBalance, result.ledgerVersion);

    return { success: true, message: 'Transfer successful' };
  };

  useEffect(() => {
    const promotedBalance = settlePendingTransfers();
    if (Number.isFinite(promotedBalance)) {
      pushServerBalanceHint(promotedBalance);
      setBalance(balanceRef.current = promotedBalance);
    }

    const onStorage = (event) => {
      if (event.key !== getBalanceBroadcastKey() || !event.newValue) {
        return;
      }

      try {
        const payload = JSON.parse(event.newValue);
        const incomingBalance = Number(payload?.balance);
        if (!Number.isFinite(incomingBalance)) {
          return;
        }

        balanceRef.current = incomingBalance;
        setBalance(incomingBalance);
      } catch {
        // no-op
      }
    };

    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return {
    balance,
    savings,
    transferFunds,
    mockTransactions,
    mockBeneficiaries
  };
}
