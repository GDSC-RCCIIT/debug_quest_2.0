const basePlayers = [
  { id: 'zp', name: 'ZeroPing', score: 11940 },
  { id: 'kk', name: 'KatanaKid', score: 10885 },
  { id: 'gm', name: 'GlitchMint', score: 9920 },
]

let submissions = []

function jitter(value, amount) {
  return value + Math.floor((Math.random() - 0.5) * amount)
}

export function fetchLeaderboardSnapshot(playerScore) {
  const lag = 200 + Math.floor(Math.random() * 1800)

  return new Promise((resolve) => {
    setTimeout(() => {
      const rows = [
        ...basePlayers.map((item) => ({ ...item, score: jitter(item.score, 300) })),
        { id: 'you', name: 'You', score: playerScore },
      ]

      submissions.slice(-3).forEach((entry, index) => {
        rows.push({ id: `sub-${index}`, name: entry.name, score: entry.score })
      })

      rows.sort((a, b) => b.score - a.score)
      resolve(rows.slice(0, 5))
    }, lag)
  })
}

export function submitScore(name, score) {
  submissions.push({ name, score, at: Date.now() })
}
