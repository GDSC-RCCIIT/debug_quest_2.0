import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  Search,
  Settings,
  Pause,
  Volume2,
  VolumeX,
  Play,
  Trophy,
  Coins,
  Users,
  Flame,
  Heart,
  Gamepad2,
  Sun,
  Moon,
} from 'lucide-react'
import './ArcadeHouse.css'
import { initializeArcadeAssets } from './arcade-house/services/assetLoaderService'
import { readSavedCoins, saveCoins } from './arcade-house/services/coinStorageService'
import { useArcadeSearch } from './arcade-house/hooks/useArcadeSearch'
import { useArcadeRealtime } from './arcade-house/hooks/useArcadeRealtime'

const navItems = [
  'Game Lobby',
  'Mini Games',
  'Multiplayer Arena',
  'Leaderboards',
  'Coin Vault',
  'Achievements',
  'Settings',
]

const gameCards = [
  { id: 'neon-runner', title: 'Neon Runner', difficulty: 'Easy', reward: 120, thumb: 'NR' },
  { id: 'byte-blaster', title: 'Byte Blaster', difficulty: 'Medium', reward: 220, thumb: 'BB' },
  { id: 'glitch-racer', title: 'Glitch Racer', difficulty: 'Hard', reward: 340, thumb: 'GR' },
  { id: 'vector-jump', title: 'Vector Jump', difficulty: 'Easy', reward: 150, thumb: 'VJ' },
  { id: 'kernel-kombat', title: 'Kernel Kombat', difficulty: 'Hard', reward: 420, thumb: 'KK' },
  { id: 'stack-smash', title: 'Stack Smash', difficulty: 'Medium', reward: 260, thumb: 'SS' },
]

const missions = [
  { label: 'Win 2 mini games', progress: 70, reward: '+180' },
  { label: 'Perfect jump combo x12', progress: 40, reward: '+120' },
  { label: 'Collect coin capsules x8', progress: 88, reward: '+240' },
]

const friends = [
  { name: 'Ari.exe', status: 'In Arena', ping: 28 },
  { name: 'NovaByte', status: 'Lobby', ping: 41 },
  { name: 'PixelRiot', status: 'In Match', ping: 22 },
  { name: 'HexaLoop', status: 'Idle', ping: 57 },
]

const rewards = ['+120 Neon Runner', '+80 Daily login', '+340 Glitch Racer']

function getMachineIcon(gameId) {
  switch (gameId) {
    case 'neon-runner':
      return <Flame size={24} />
    case 'byte-blaster':
      return <Trophy size={24} />
    case 'glitch-racer':
      return <Play size={24} />
    case 'vector-jump':
      return <Heart size={24} />
    case 'kernel-kombat':
      return <Gamepad2 size={24} />
    case 'stack-smash':
      return <Coins size={24} />
    default:
      return <Play size={24} />
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function ArcadeHouse({ onBack }) {
  const [activeTab, setActiveTab] = useState('Game Lobby')
  const [search, setSearch] = useState('')
  const [coins, setCoins] = useState(() => readSavedCoins(12490))
  const [soundOn, setSoundOn] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [startPrimed, setStartPrimed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [playerX, setPlayerX] = useState(8)
  const [isJumping, setIsJumping] = useState(false)
  const [jumpTick, setJumpTick] = useState(0)
  const [controlsLocked, setControlsLocked] = useState(false)
  const [score, setScore] = useState(3180)
  const [health, setHealth] = useState(82)
  const [xp, setXp] = useState(68)
  const [streak, setStreak] = useState(5)
  const highScoreLabel = 'High Score: 8,480'
  const rapidJumpRef = useRef([])

  const filteredCards = useArcadeSearch(gameCards, search)
  const { leaderboard, players, isConnected, reconnectCount, leaveArena, reconnectArena } = useArcadeRealtime(score)

  useEffect(() => {
    const spinnerTimer = setTimeout(() => {
      setIsLoading(false)
    }, 520)

    initializeArcadeAssets()

    return () => {
      clearTimeout(spinnerTimer)
    }
  }, [])

  useEffect(() => {
    saveCoins(coins)
  }, [coins])

  useEffect(() => {
    if (isPaused) {
      return
    }

    const ticker = setInterval(() => {
      setScore((prev) => prev + 7)

      if (Math.random() > 0.84) {
        setHealth((prev) => clamp(prev - 1, 0, 100))
      }

      if (Math.random() > 0.78) {
        setCoins((prev) => prev + 2)
      }
    }, 900)

    return () => clearInterval(ticker)
  }, [isPaused])

  useEffect(() => {
    const keyboardHandler = (event) => {
      if (controlsLocked) {
        return
      }

      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        setPlayerX((prev) => clamp(prev - 4, 0, 88))
      }

      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        setPlayerX((prev) => clamp(prev + 4, 0, 88))
      }

      if (event.key === ' ' || event.key.toLowerCase() === 'w' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (!isJumping) {
          setIsJumping(true)
          setJumpTick(6)
          setScore((prev) => prev + 35)
          setXp((prev) => clamp(prev + 1, 0, 100))
        }
      }
    }

    window.addEventListener('keydown', keyboardHandler)
    return () => window.removeEventListener('keydown', keyboardHandler)
  }, [isJumping, controlsLocked])

  useEffect(() => {
    if (!isJumping || jumpTick <= 0) {
      if (jumpTick <= 0) {
        setIsJumping(false)
      }
      return
    }

    const timer = setTimeout(() => setJumpTick((prev) => prev - 1), 55)
    return () => clearTimeout(timer)
  }, [isJumping, jumpTick])

  const jumpOffset = isJumping ? Math.max(0, Math.sin((jumpTick / 6) * Math.PI) * 56) : 0

  const playCard = (reward) => {
    setCoins((prev) => prev + reward)
    setScore((prev) => prev + reward)
    setXp((prev) => clamp(prev + 4, 0, 100))
    if (Math.random() > 0.7) {
      setStreak((prev) => prev + 1)
    }
  }

  const onStartGame = () => {
    if (!startPrimed) {
      setStartPrimed(true)
      return
    }

    setGameStarted(true)
    setScore((prev) => prev + 40)
  }

  const onJump = () => {
    const now = Date.now()
    rapidJumpRef.current = [...rapidJumpRef.current.filter((ts) => now - ts < 1200), now]

    if (rapidJumpRef.current.length > 4) {
      setControlsLocked(true)
      return
    }

    if (!isJumping && !controlsLocked) {
      setIsJumping(true)
      setJumpTick(6)
      setScore((prev) => prev + 28)
    }
  }

  return (
    <main className={`arcade-shell ${darkMode ? 'dark-mode' : ''}`}>
      {isLoading && (
        <div className="arcade-loader">
          <div className="loader-ring" />
          <span>Booting arcade runtime...</span>
        </div>
      )}
      <div className="arcade-noise" aria-hidden="true" />
      <div className="arcade-bg-grid" aria-hidden="true" />
      <div className="arcade-orb arcade-orb-cyan" aria-hidden="true" />
      <div className="arcade-orb arcade-orb-magenta" aria-hidden="true" />

      <div className="arcade-page">
        <nav className="arcade-topbar glass-card">
          <div className="arcade-topbar-left">
            <button type="button" className="arcade-back" onClick={onBack}>
              <ChevronLeft size={18} /> City
            </button>
            <div className="arcade-title-wrap">
              <h1>
                <span>🎮</span> Arcade House
              </h1>
              <p>Entertainment core malfunction detected...</p>
            </div>
          </div>

          <div className="arcade-topbar-right">
            <div className="coin-pill">
              <Coins size={16} /> {coins.toLocaleString()}
            </div>
            <button className="icon-chip" type="button" aria-label="Profile avatar">
              <span className="avatar-dot">PX</span>
            </button>
            <button className="icon-chip" type="button" aria-label="Toggle Theme" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </nav>

        <section className="arcade-layout">
          <aside className="arcade-sidebar glass-card">
            <div className="sidebar-header">
              <Gamepad2 size={16} /> Navigation Core
            </div>
            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`sidebar-item ${activeTab === item ? 'active' : ''}`}
                  onClick={() => setActiveTab(item)}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          <section className="arcade-main">
            <section className="hero-section glass-card">
              <div className="hero-content">
                <span className="hero-kicker">Featured Rift Event</span>
                <h2>Glitch Drift: Neon Collapse</h2>
                <p>The arcade simulation is unstable. Enter now before the leaderboard desync wipes your run.</p>
                <div className="hero-actions">
                  <button type="button" className="btn-primary" onClick={onStartGame}>
                    <Play size={16} /> {gameStarted ? 'Running' : 'Start Game'}
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => setGameStarted(true)}>Continue</button>
                </div>
              </div>

              <div className="hero-search">
                <label htmlFor="arcade-search" className="search-box">
                  <Search size={16} />
                  <input
                    id="arcade-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search games, modes, rewards..."
                  />
                </label>
              </div>
            </section>

            <section className="center-grid">
              <article className="game-cards glass-card">
                <header>
                  <h3>Virtual Arcade Hall</h3>
                  <span>{filteredCards.length} cabinets online</span>
                </header>
                <div className="hall-labels" aria-hidden="true">
                  <span>Racing</span>
                  <span>Shooter</span>
                  <span>Jump</span>
                  <span>Puzzle</span>
                  <span>Multiplayer</span>
                  <span>Retro</span>
                </div>
                <div className="cards-grid">
                  <div className="hall-ceiling" aria-hidden="true" />
                  <div className="hall-floor" aria-hidden="true" />
                  <div className="hall-particles" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, idx) => (
                      <span key={`arcade-particle-${idx}`} style={{ '--p': idx }} />
                    ))}
                  </div>

                  {filteredCards.map((card, index) => (
                    <button
                      key={card.id}
                      type="button"
                      className="arcade-machine"
                      onClick={() => playCard(card.reward)}
                    >
                      <div className="machine-marquee">{card.title}</div>
                      <div className={`machine-screen ${index % 3 === 0 ? 'glitch-flicker-soft' : ''}`}>
                        <div className="screen-thumb" aria-hidden="true">{getMachineIcon(card.id)}</div>
                        <div className="screen-overlay">{card.title}</div>
                      </div>
                      <div className="machine-meta-row">
                        <span className="difficulty-badge">{card.difficulty}</span>
                        <span className="reward-coins">+{card.reward} coins</span>
                      </div>
                      <div className="machine-bottom">
                        <span className={`machine-sticker ${index % 2 === 0 ? 'new' : 'high'}`}>
                          {index % 2 === 0 ? 'NEW' : 'HIGH SCORE'}
                        </span>
                        <span
                          className="arcade-play-btn"
                          onClick={(event) => {
                            event.stopPropagation()
                            playCard(card.reward)
                          }}
                        >
                          Play
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </article>

              <article className="live-panel glass-card">
                <header>
                  <h3>{highScoreLabel}</h3>
                  <div className="live-stats">
                    <span className="score-value">Score: {score}</span>
                    <span className="health-pill">
                      <Heart size={14} /> {health}%
                    </span>
                  </div>
                </header>

                <div className="game-screen" role="img" aria-label="Mini platformer area">
                  <div className="scanlines" />
                  <div className="platform" />
                  <div
                    className="player-sprite"
                    style={{ left: `${playerX}%`, bottom: `${16 + jumpOffset}px` }}
                  />
                  <div className="enemy enemy-a" />
                  <div className="enemy enemy-b" />
                </div>

                <div className="health-track">
                  <div className="health-fill" style={{ width: `${health}%` }} />
                </div>

                <div className="controls-row">
                  <button type="button" onClick={() => !controlsLocked && setPlayerX((prev) => clamp(prev - 7, 0, 88))}>Move ◀</button>
                  <button type="button" onClick={onJump}>
                    Jump ▲
                  </button>
                  <button type="button" onClick={() => !controlsLocked && setPlayerX((prev) => clamp(prev + 7, 0, 88))}>Move ▶</button>
                </div>

                <div className="panel-actions">
                  <button type="button" className="btn-ghost" onClick={() => setIsPaused((prev) => !prev)}>
                    <Pause size={14} /> {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => setSoundOn((prev) => !prev)}>
                    {soundOn ? <VolumeX size={14} /> : <Volume2 size={14} />} {soundOn ? 'Sound On' : 'Muted'}
                  </button>
                </div>
              </article>
            </section>

            <section className="bottom-row glass-card">
              <div className="xp-block">
                <div className="row-title">Progress / XP</div>
                <div className="xp-track">
                  <div className="xp-fill" style={{ width: `${xp}%` }} />
                </div>
              </div>
              <div className="rewards-block">
                <div className="row-title">Recent Rewards</div>
                <ul>
                  {rewards.map((reward) => (
                    <li key={reward}>{reward}</li>
                  ))}
                </ul>
              </div>
              <div className="streak-block">
                <div className="row-title">Current Streak</div>
                <strong>
                  <Flame size={16} /> {streak} days
                </strong>
              </div>
            </section>
          </section>

          <aside className="arcade-right">
            <section className="right-card glass-card glitch-flicker">
              <header>
                <Trophy size={16} /> Live Leaderboard
              </header>
              <ol className="leader-list">
                {(leaderboard.length ? leaderboard : [
                  { id: 'fallback-zp', name: 'ZeroPing', score: 11940 },
                  { id: 'fallback-you', name: 'You', score },
                  { id: 'fallback-kk', name: 'KatanaKid', score: 10885 },
                ]).map((row, index) => (
                  <li key={row.id}>
                    <span>{index + 1}. {row.name}</span>
                    <strong>{row.score.toLocaleString()}</strong>
                  </li>
                ))}
              </ol>
            </section>

            <section className="right-card glass-card">
              <header>
                <Users size={16} /> Friends Online
              </header>
              <ul className="friends-list">
                {friends.map((friend) => (
                  <li key={friend.name}>
                    <span className="dot" />
                    <div>
                      <strong>{friend.name}</strong>
                      <span>{friend.status}</span>
                    </div>
                    <small>{friend.ping}ms</small>
                  </li>
                ))}
              </ul>
            </section>

            {activeTab === 'Multiplayer Arena' && (
              <section className="right-card glass-card arena-card">
                <header>Arena Session</header>
                <div className="arena-meta">Status: {isConnected ? 'Connected' : 'Disconnected'} | Reconnects: {reconnectCount}</div>
                <div className="arena-actions">
                  <button type="button" className="btn-ghost" onClick={leaveArena}>Leave</button>
                  <button type="button" className="btn-ghost" onClick={reconnectArena}>Reconnect</button>
                </div>
                <ul className="arena-players">
                  {players.map((player) => (
                    <li key={player.id} className={!player.connected ? 'ghost' : ''}>
                      <span>{player.name}</span>
                      <small>{player.connected ? 'online' : 'left'}</small>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="right-card glass-card">
              <header>Daily Missions</header>
              <ul className="missions-list">
                {missions.map((mission) => (
                  <li key={mission.label}>
                    <div className="mission-row">
                      <span>{mission.label}</span>
                      <strong>{mission.reward}</strong>
                    </div>
                    <div className="mission-track">
                      <div style={{ width: `${mission.progress}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="right-card glass-card coins-badge glitch-flicker-soft">
              Saved Coins
              <strong>{coins.toLocaleString()}</strong>
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}
