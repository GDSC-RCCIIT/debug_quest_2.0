const BALANCE_CACHE_KEY = 'bank_balance_cache_v2';
const SERVER_BALANCE_HINT_KEY = 'bank_server_balance_hint_v2';
const PENDING_TRANSFERS_KEY = 'bank_pending_transfers_v2';
const BALANCE_BROADCAST_KEY = 'bank_balance_broadcast_v2';

function safeParse(rawValue) {
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function hydrateCachedBalance(fallbackBalance) {
  const cached = safeParse(window.localStorage.getItem(BALANCE_CACHE_KEY));
  const cachedBalance = Number(cached?.balance);
  if (Number.isFinite(cachedBalance)) {
    return cachedBalance;
  }

  return fallbackBalance;
}

export function writeCachedBalance(balance, ledgerVersion = null) {
  window.localStorage.setItem(
    BALANCE_CACHE_KEY,
    JSON.stringify({
      balance,
      ledgerVersion,
      updatedAt: Date.now(),
    }),
  );
}

export function pushServerBalanceHint(balance, ledgerVersion = null) {
  window.sessionStorage.setItem(
    SERVER_BALANCE_HINT_KEY,
    JSON.stringify({
      balance,
      ledgerVersion,
      updatedAt: Date.now(),
    }),
  );
}

export function readServerBalanceHint() {
  const hint = safeParse(window.sessionStorage.getItem(SERVER_BALANCE_HINT_KEY));
  const hintedBalance = Number(hint?.balance);
  if (Number.isFinite(hintedBalance)) {
    return hintedBalance;
  }

  return null;
}

export function stagePendingTransfer({ openingBalance, amount, etaMs }) {
  const existing = safeParse(window.sessionStorage.getItem(PENDING_TRANSFERS_KEY));
  const queue = Array.isArray(existing) ? existing : [];

  const pendingTransfer = {
    id: `p_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    openingBalance,
    amount,
    etaMs,
    createdAt: Date.now(),
  };

  queue.push(pendingTransfer);
  window.sessionStorage.setItem(PENDING_TRANSFERS_KEY, JSON.stringify(queue));
  return pendingTransfer;
}

export function settlePendingTransfers(nowMs = Date.now()) {
  const existing = safeParse(window.sessionStorage.getItem(PENDING_TRANSFERS_KEY));
  const queue = Array.isArray(existing) ? existing : [];
  if (!queue.length) return null;

  const settled = [];
  const stillPending = [];

  for (const transfer of queue) {
    if (transfer.etaMs <= nowMs) {
      settled.push(transfer);
    } else {
      stillPending.push(transfer);
    }
  }

  window.sessionStorage.setItem(PENDING_TRANSFERS_KEY, JSON.stringify(stillPending));
  if (!settled.length) return null;

  const latestSettled = settled[settled.length - 1];
  return Number((latestSettled.openingBalance - latestSettled.amount).toFixed(2));
}

export function publishBalanceBroadcast(balance, ledgerVersion) {
  window.localStorage.setItem(
    BALANCE_BROADCAST_KEY,
    JSON.stringify({
      balance,
      ledgerVersion,
      updatedAt: Date.now(),
    }),
  );
}

export function getBalanceBroadcastKey() {
  return BALANCE_BROADCAST_KEY;
}
