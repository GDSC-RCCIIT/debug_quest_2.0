import { useEffect, useState } from 'react'
import CityMap from './components/CityMap'
import Noise from './components/ui/Noise'
import SchoolHouse from './components/SchoolHouse'
import BankHouse from './components/BankHouse'
import ArcadeHouse from './components/ArcadeHouse'
import Sidebar from './components/Sidebar'
import ShopHouse from './components/ShopHouse'
import PixelSnow from './components/PixelSnow'
import Lightning from './components/Lightning'
import BlurText from './components/BlurText'
import FuzzyText from './components/FuzzyText'

function StarField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 34 }, (_, idx) => (
        <span
          key={`star-${idx}`}
          className="absolute block h-1 w-1 rounded-full bg-yellow-100/95 shadow-[0_0_10px_rgba(253,224,71,0.7)] star-blink"
          style={{
            top: `${(idx * 19) % 100}%`,
            left: `${(idx * 37) % 100}%`,
            animationDelay: `${(idx % 7) * 0.3}s`,
            animationDuration: `${2.6 + (idx % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}

function getRouteFromHash() {
  const hashValue = window.location.hash.replace('#', '')
  if (hashValue === 'shop' || hashValue === 'school' || hashValue === 'bank' || hashValue === 'arcade') {
    return hashValue
  }

  return 'home'
}

function App() {
  const [route, setRoute] = useState(getRouteFromHash)
  const [isLoading, setIsLoading] = useState(true)
  const totalBugs = 50
  const bugsFixed = 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash())
    }

    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const navigate = (nextRoute) => {
    if (nextRoute === 'home') {
      window.history.pushState(null, '', window.location.pathname)
      setRoute('home')
      return
    }

    window.location.hash = nextRoute
    setRoute(nextRoute)
  }

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <Lightning
            hue={260}
            xOffset={0}
            speed={1}
            intensity={1}
            size={1}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-[60vh] text-center mix-blend-plus-lighter p-0 m-0">
          <div className="flex flex-col items-center justify-center w-full max-w-full p-0 m-0">
            <BlurText
              text="GET SET"
              delay={150}
              animateBy="words"
              direction="top"
              className="font-pixel tracking-[0.12em] text-4xl font-black text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.7)] sm:text-7xl flex flex-col items-center justify-center text-center w-full max-w-full p-0 m-0"
            />
            <BlurText
              text="DEBUG"
              delay={150}
              animateBy="words"
              direction="top"
              className="mb-2 font-pixel tracking-[0.12em] text-4xl font-black text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.7)] sm:text-7xl flex flex-col items-center justify-center text-center w-full max-w-full p-0 m-0"
              onAnimationComplete={undefined}
            />
            <p className="animate-pulse text-2xl font-bold tracking-[0.1em] text-purple-100 sm:text-3xl mt-2 text-center w-full max-w-full p-0 m-0" style={{ animationDuration: '2s' }}>
              The city awaits its fixers.
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (route === 'shop') {
    return <ShopHouse onBack={() => navigate('home')} />
  }

  if (route === 'school') {
    return <SchoolHouse onBack={() => navigate('home')} />
  }

  if (route === 'bank') {
    return <BankHouse onBack={() => navigate('home')} />
  }

  if (route === 'arcade') {
    return <ArcadeHouse onBack={() => navigate('home')} />
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-3 py-6 text-slate-100 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <Noise className="opacity-20 mix-blend-screen" patternRefreshInterval={3} patternAlpha={18} />
      <PixelSnow color="#e0f2fe" opacity={0.6} />
      <StarField />

      <div className="relative mx-auto w-full max-w-7xl">
        <header className="mb-6 text-center sm:mb-8">
          <div className="mb-1 flex justify-center px-1 sm:px-0">
            <FuzzyText
              color="#fb923c"
              fontSize="clamp(1.2rem, 6vw, 4.2rem)"
              baseIntensity={0.15}
              hoverIntensity={0.3}
              enableHover={true}
              glitchMode={true}
              letterSpacing={2}
              className="mx-auto h-auto max-w-full drop-shadow-[0_0_12px_rgba(251,146,60,0.5)] font-black uppercase font-pixel"
            >
              ⚠ GLITCH CITY
            </FuzzyText>
          </div>
          <h1 className="mb-3 text-3xl font-black uppercase tracking-[0.22em] text-yellow-100 drop-shadow-[0_0_10px_rgba(234,179,8,0.45)] sm:text-5xl lg:text-6xl">
            EXPLORER
          </h1>
          <p className="mx-auto max-w-2xl rounded-full border border-cyan-200/30 bg-slate-900/65 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/95 shadow-[0_0_30px_rgba(6,182,212,0.2)] sm:text-xs">
            A city full of broken features • 50+ bugs to fix
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:gap-6">
          <CityMap
            bugsFixed={bugsFixed}
            totalBugs={totalBugs}
            onShopClick={() => navigate('shop')}
            onSchoolClick={() => navigate('school')}
            onBankClick={() => navigate('bank')}
            onArcadeClick={() => navigate('arcade')}
          />
          <Sidebar bugsFixed={bugsFixed} totalBugs={totalBugs} />
        </section>
      </div>
    </main>
  )
}

export default App
