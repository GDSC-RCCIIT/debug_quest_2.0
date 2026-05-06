const READ_KEY = 'arcade_saved_coins_v1'
const WRITE_KEY = 'arcade_saved_coins_v1'

export function readSavedCoins(fallbackCoins) {
  const raw = window.localStorage.getItem(READ_KEY)
  const parsed = Number.parseInt(raw || '', 10)

  if (Number.isNaN(parsed)) {
    return fallbackCoins
  }

  return parsed
}

export function saveCoins(coins) {
  window.localStorage.setItem(WRITE_KEY, String(coins))
}
