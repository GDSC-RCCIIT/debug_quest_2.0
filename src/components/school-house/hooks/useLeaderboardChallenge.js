import { leaderboardRows } from '../constants'

export default function useLeaderboardChallenge() {
  const rankedRows = [...leaderboardRows].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    return a.name.localeCompare(b.name)
  })

  return {
    rankedRows,
  }
}