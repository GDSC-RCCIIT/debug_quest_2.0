import { useEffect, useRef } from 'react'
import './Noise.css'

export default function Noise({
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className = '',
}) {
  const grainRef = useRef(null)

  useEffect(() => {
    const canvas = grainRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let frame = 0
    let animationId = 0

    const resize = () => {
      const { clientWidth, clientHeight } = canvas.parentElement || canvas
      canvas.width = Math.max(1, clientWidth)
      canvas.height = Math.max(1, clientHeight)
    }

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
        data[i + 3] = patternAlpha
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain()
      }
      frame += 1
      animationId = window.requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    resize()
    loop()

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationId)
    }
  }, [patternRefreshInterval, patternAlpha])

  return (
    <canvas
      className={`noise-overlay ${className}`.trim()}
      ref={grainRef}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  )
}
