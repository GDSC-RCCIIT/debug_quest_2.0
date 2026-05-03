import { useEffect, useRef, useState } from 'react'
import './CityMap.css'

export default function CityMap({
  bugsFixed: _bugsFixed,
  setBugsFixed: _setBugsFixed,
  totalBugs: _totalBugs,
  onShopClick,
  onSchoolClick,
  onBankClick,
  onArcadeClick,
}) {
  const [active, setActive] = useState(null)
  const [lockToast, setLockToast] = useState('')
  const [lockShakeTarget, setLockShakeTarget] = useState(null)
  const lockToastTimeoutRef = useRef(null)
  const lockShakeTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      window.clearTimeout(lockToastTimeoutRef.current)
      window.clearTimeout(lockShakeTimeoutRef.current)
    }
  }, [])

  const showLockedToast = (zone) => {
    setLockToast('Access restricted. Opens in Level 2.')
    setLockShakeTarget(zone)
    window.clearTimeout(lockToastTimeoutRef.current)
    window.clearTimeout(lockShakeTimeoutRef.current)
    lockShakeTimeoutRef.current = window.setTimeout(() => {
      setLockShakeTarget(null)
    }, 420)
    lockToastTimeoutRef.current = window.setTimeout(() => {
      setLockToast('')
    }, 2200)
  }

  const handleShopClick = () => {
    setActive(active === 'shop' ? null : 'shop')
    if (onShopClick) {
      onShopClick()
    }
  }

  const handleSchoolClick = () => {
    setActive(active === 'school' ? null : 'school')
    if (onSchoolClick) {
      onSchoolClick()
    }
  }

  const handleBankClick = () => {
    setActive(active === 'bank' ? null : 'bank')
    if (onBankClick) {
      onBankClick()
    }
  }

  const handleArcadeClick = () => {
    setActive(active === 'arcade' ? null : 'arcade')
    if (onArcadeClick) {
      onArcadeClick()
    }
  }

  return (
    <div className="city-map-wrapper">
      <div className="city-map">
        <div className="ground" />

        <svg className="paths-svg" viewBox="0 0 860 480" preserveAspectRatio="xMidYMid meet">
          <line x1="430" y1="80" x2="430" y2="480" stroke="#c8a870" strokeWidth="18" strokeDasharray="28 12" strokeLinecap="square" />
          <line x1="60" y1="280" x2="800" y2="280" stroke="#c8a870" strokeWidth="18" strokeDasharray="28 12" strokeLinecap="square" />
          <line x1="200" y1="160" x2="370" y2="260" stroke="#c8a870" strokeWidth="14" strokeDasharray="20 10" strokeLinecap="square" />
          <line x1="640" y1="160" x2="490" y2="260" stroke="#c8a870" strokeWidth="14" strokeDasharray="20 10" strokeLinecap="square" />
          <line x1="200" y1="370" x2="370" y2="300" stroke="#c8a870" strokeWidth="14" strokeDasharray="20 10" strokeLinecap="square" />
          <line x1="640" y1="370" x2="490" y2="300" stroke="#c8a870" strokeWidth="14" strokeDasharray="20 10" strokeLinecap="square" />
          <circle cx="430" cy="280" r="38" fill="none" stroke="#c8a870" strokeWidth="10" strokeDasharray="16 8" />
        </svg>

        <div className="fountain">
          <img src="/waterfall.png" alt="Waterfall" className="fountain-image" />
        </div>

        {/* Top Center Trees */}
        {/* Tree Layout - Balanced for districts */}
        <Tree style={{ left: '42%', top: '15%' }} size="sm" />
        <Tree style={{ left: '58%', top: '15%' }} size="sm" />
        <Tree style={{ left: '12%', top: '42%' }} size="md" />
        <Tree style={{ left: '88%', top: '42%' }} size="md" />
        <Tree style={{ left: '10%', top: '75%' }} size="md" />
        <Tree style={{ left: '90%', top: '75%' }} size="md" />
        <Tree style={{ left: '40%', top: '88%' }} size="lg" />
        <Tree style={{ left: '25%', top: '50%' }} size="sm" />
        <Tree style={{ left: '75%', top: '50%' }} size="sm" />
        
        {/* Fillers for Desktop - Roadside coverage */}
        <Tree style={{ left: '42%', top: '38%' }} size="sm" />
        <Tree style={{ left: '58%', top: '38%' }} size="sm" />

        <Bench style={{ left: '24%', top: '58%' }} size="sm" />
        <Bench style={{ left: '76%', top: '58%' }} size="sm" />

        <Cone style={{ left: '46%', top: '50%' }} />
        <Cone style={{ left: '54%', top: '72%' }} />
        <Cone style={{ left: '38%', top: '58%' }} />

        <RoadWarning style={{ left: '58%', top: '54%' }} />

        <div className="building-slot shop-slot">
          <button
            type="button"
            className={`shop-image-button ${active === 'shop' ? 'active' : ''}`}
            onClick={handleShopClick}
            aria-label="Open Shop House"
          >
            <img src="/fixed_shop.png" alt="Shop building" className="shop-image" />
          </button>
        </div>

        <div className="building-slot bank-slot">
          <button
            type="button"
            className={`bank-image-button ${active === 'bank' ? 'active' : ''}`}
            onClick={handleBankClick}
            aria-label="Open Bank House"
          >
            <img src="/bankkk.png" alt="Bank building" className="bank-image" />
          </button>
        </div>

        <div className="building-slot school-slot">
          <button
            type="button"
            className={`school-image-button ${active === 'school' ? 'active' : ''}`}
            onClick={handleSchoolClick}
            aria-label="Open School House"
          >
            <img src="/fixed_school.png" alt="School building" className="school-image" />
          </button>
        </div>

        <div className="building-slot arcade-slot">
          <button
            type="button"
            className={`arcade-image-button ${active === 'arcade' ? 'active' : ''}`}
            onClick={handleArcadeClick}
            aria-label="Open Arcade House"
          >
            <img src="/arcade.png" alt="Arcade building" className="arcade-image" />
          </button>
        </div>

        {lockToast ? (
          <div className="locked-toast" role="status" aria-live="polite">
            <span className="locked-toast-icon" aria-hidden="true">⛔</span>
            {lockToast}
          </div>
        ) : null}

        <div className="river" />
        <div className="bridge" />
      </div>
    </div>
  )
}

function Tree({ style, size }) {
  const sizes = { 
    sm: 'clamp(28px, 4.5vw, 40px)', 
    md: 'clamp(38px, 6vw, 54px)', 
    lg: 'clamp(48px, 8vw, 72px)' 
  }
  const s = sizes[size] || sizes.md
  return <img src="/tree.png" alt="" aria-hidden="true" className="tree" style={{ ...style, width: s, height: 'auto' }} />
}

function Bench({ style, size = 'md' }) {
  const sizes = { 
    sm: 'clamp(18px, 2.8vw, 24px)', 
    md: 'clamp(26px, 4vw, 36px)', 
    lg: 'clamp(32px, 5vw, 44px)' 
  }
  const s = sizes[size] || sizes.md
  return (
    <img
      src="/sitting_bench.png"
      alt=""
      aria-hidden="true"
      className="bench"
      style={{ ...style, width: s, height: 'auto', transform: 'translate(-50%, -50%)' }}
    />
  )
}

function Cone({ style }) {
  return <img src="/capp.png" alt="" aria-hidden="true" className="traffic-cone" style={style} />
}

function RoadWarning({ style }) {
  return (
    <div className="road-warning" style={style}>
      <span>⚠</span>
    </div>
  )
}

