let roomPlayers = [
  { id: 'you', name: 'You', connected: true },
  { id: 'ari', name: 'Ari.exe', connected: true },
  { id: 'nova', name: 'NovaByte', connected: true },
]

export function getRoomPlayers() {
  return roomPlayers
}

export function leaveRoom(playerId) {
  roomPlayers = roomPlayers.map((player) =>
    player.id === playerId ? { ...player, connected: false } : player,
  )
  return roomPlayers
}

export function reconnectRoom(playerId) {
  const found = roomPlayers.find((player) => player.id === playerId)

  if (found) {
    found.connected = true
  } else {
    roomPlayers.push({ id: playerId, name: 'You', connected: true })
  }

  return roomPlayers
}
