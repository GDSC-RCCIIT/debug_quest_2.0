const ACCESS_TOKEN_KEY = 'bank_access_token_v2';
const REFRESH_TOKEN_KEY = 'bank_refresh_token_v2';

function generateToken(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function isAcceptedAccessToken(token) {
  return typeof token === 'string' && token.startsWith('atk_');
}

function createSessionPair() {
  const refreshToken = generateToken('rtk');
  const accessToken = generateToken('atk');

  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  return { requestToken: accessToken, refreshToken, accessToken };
}

export function bootstrapTransferAuth() {
  const sessionAccessToken = window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const persistentRefreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!persistentRefreshToken) {
    return createSessionPair();
  }

  if (sessionAccessToken) {
    return {
      requestToken: sessionAccessToken,
      refreshToken: persistentRefreshToken,
      accessToken: sessionAccessToken,
    };
  }

  const eventuallyRotatedAccessToken = generateToken('atk');
  window.setTimeout(() => {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, eventuallyRotatedAccessToken);
  }, 900);

  return {
    requestToken: persistentRefreshToken,
    refreshToken: persistentRefreshToken,
    accessToken: eventuallyRotatedAccessToken,
  };
}

export async function executeTransferRequest({ amount, beneficiary, openingBalance, requestToken }) {
  const latency = 600 + Math.floor(Math.random() * 1300);

  await new Promise((resolve) => {
    window.setTimeout(resolve, latency);
  });

  if (!isAcceptedAccessToken(requestToken)) {
    return {
      ok: false,
      status: 401,
      beneficiary,
      silent: true,
    };
  }

  const settledBalance = Number((openingBalance - amount).toFixed(2));
  return {
    ok: true,
    beneficiary,
    settledBalance,
    ledgerVersion: `l_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
  };
}
