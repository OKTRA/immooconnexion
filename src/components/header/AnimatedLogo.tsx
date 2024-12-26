import { useEffect, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export function AnimatedLogo() {
  const firstPupilRef = useRef<HTMLSpanElement>(null)
  const secondPupilRef = useRef<HTMLSpanElement>(null)
  const firstEyelidRef = useRef<HTMLDivElement>(null)
  const secondEyelidRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!firstPupilRef.current || !secondPupilRef.current) return

      // Get center point of the first O (we'll use this as reference for both pupils)
      const firstO = firstPupilRef.current.parentElement?.getBoundingClientRect()
      if (!firstO) return

      // Calculate maximum movement radius (20% of O size)
      const maxRadius = Math.min(firstO.width, firstO.height) * 0.2

      // Calculate angle for both pupils using the same reference point
      const angle = Math.atan2(
        e.clientY - (firstO.top + firstO.height/2),
        e.clientX - (firstO.left + firstO.width/2)
      )
      
      // Apply the same movement to both pupils
      const xMove = Math.cos(angle) * maxRadius
      const yMove = Math.sin(angle) * maxRadius
      
      firstPupilRef.current.style.transform = `translate(${xMove}px, ${yMove}px)`
      secondPupilRef.current.style.transform = `translate(${xMove}px, ${yMove}px)`
    }

    // Random movement for mobile - synchronized pupils
    const mobileAnimation = () => {
      if (!firstPupilRef.current || !secondPupilRef.current) return

      const angle = Math.random() * Math.PI * 2
      const radius = 5 // Smaller radius for mobile
      const xMove = Math.cos(angle) * radius
      const yMove = Math.sin(angle) * radius
      
      firstPupilRef.current.style.transform = `translate(${xMove}px, ${yMove}px)`
      secondPupilRef.current.style.transform = `translate(${xMove}px, ${yMove}px)`
    }

    // Blinking animation
    const blink = () => {
      if (!firstEyelidRef.current || !secondEyelidRef.current) return

      firstEyelidRef.current.style.height = '100%'
      secondEyelidRef.current.style.height = '100%'

      setTimeout(() => {
        if (!firstEyelidRef.current || !secondEyelidRef.current) return
        firstEyelidRef.current.style.height = '0%'
        secondEyelidRef.current.style.height = '0%'
      }, 150)
    }

    const startBlinking = () => {
      const minInterval = 2000
      const maxInterval = 6000
      const nextBlink = Math.random() * (maxInterval - minInterval) + minInterval
      
      setTimeout(() => {
        blink()
        startBlinking()
      }, nextBlink)
    }

    if (isMobile) {
      const interval = setInterval(mobileAnimation, 2000)
      startBlinking()
      return () => clearInterval(interval)
    } else {
      window.addEventListener('mousemove', handleMouseMove)
      startBlinking()
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isMobile])

  return (
    <div className="text-4xl font-bold tracking-tight flex items-center">
      <span className="font-graffiti bg-gradient-to-br from-blue-600 via-primary to-purple-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform">
        IMM
      </span>
      <div className="relative inline-block">
        <span className="font-graffiti bg-gradient-to-br from-blue-600 via-primary to-purple-600 bg-clip-text text-transparent">
          O
        </span>
        <div 
          ref={firstEyelidRef}
          className="absolute inset-0 bg-background transition-all duration-150 origin-top"
          style={{ height: '0%' }}
        />
        <span 
          ref={firstPupilRef}
          className="absolute w-2 h-2 rounded-full transition-transform duration-300 dark:bg-white bg-black"
          style={{ 
            left: '50%', 
            top: '50%', 
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <div className="relative inline-block">
        <span className="font-graffiti bg-gradient-to-br from-blue-600 via-primary to-purple-600 bg-clip-text text-transparent">
          O
        </span>
        <div 
          ref={secondEyelidRef}
          className="absolute inset-0 bg-background transition-all duration-150 origin-top"
          style={{ height: '0%' }}
        />
        <span 
          ref={secondPupilRef}
          className="absolute w-2 h-2 rounded-full transition-transform duration-300 dark:bg-white bg-black"
          style={{ 
            left: '50%', 
            top: '50%', 
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  )
}