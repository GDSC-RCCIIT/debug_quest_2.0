const demoAssets = [
  { id: 'hero-banner', delay: 650 },
  { id: 'jump-sfx', delay: 1200 },
  { id: 'coin-sfx', delay: 920 },
  { id: 'arena-map', delay: 1450 },
]

export function initializeArcadeAssets() {
  return Promise.all(
    demoAssets.map(
      (asset) =>
        new Promise((resolve) => {
          setTimeout(() => resolve(asset.id), asset.delay)
        }),
    ),
  )
}
