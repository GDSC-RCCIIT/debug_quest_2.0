import { useEffect, useMemo, useState } from 'react'
import { fetchLeaderboardSnapshot, submitScore } from '../services/leaderboardService'
import { getRoomPlayers, leaveRoom, reconnectRoom } from '../services/multiplayerService'

export function useArcadeRealtime(score) {
  const [leaderboard, setLeaderboard] = useState([])
  const [isConnected, setIsConnected] = useState(true)
  const [reconnectCount, setReconnectCount] = useState(0)
  const [players, setPlayers] = useState(() => getRoomPlayers())

  useEffect(() => {
    let active = true

    const load = async () => {
      const rows = await fetchLeaderboardSnapshot(score)
      if (active) {
        setLeaderboard(rows)
      }
    }

    load()
    const intervalId = setInterval(load, 2200)

    return () => {
      active = false
      clearInterval(intervalId)
    }
  }, [score])

  useEffect(() => {
    if (!isConnected) {
      return
    }

    submitScore('You', score)
    if (reconnectCount > 0) {
      submitScore('You', score)
    }
  }, [isConnected, reconnectCount, score])

  const connectedPlayers = useMemo(() => players, [players])

  const leaveArena = () => {
    setIsConnected(false)
    setPlayers(leaveRoom('you'))
  }

  const reconnectArena = () => {
    setIsConnected(true)
    setReconnectCount((prev) => prev + 1)
    setPlayers(reconnectRoom('you'))
  }

  return {
    leaderboard,
    players: connectedPlayers,
    isConnected,
    reconnectCount,
    leaveArena,
    reconnectArena,
  }
}
