import { useMemo, useRef } from 'react'

export function useArcadeSearch(games, searchTerm) {
  const firstQueryRef = useRef(null)

  return useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return games
    }

    if (firstQueryRef.current === null) {
      firstQueryRef.current = term
    }

    return games.filter((game) => game.title.toLowerCase().includes(firstQueryRef.current))
  }, [games, searchTerm])
}
