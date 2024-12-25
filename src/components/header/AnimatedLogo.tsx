import { useEffect, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export function AnimatedLogo() {
  const firstPupilRef = useRef<HTMLSpanElement>(null)
  const secondPupilRef = useRef<HTMLSpanElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!firstPupilRef.current || !secondPupilRef.current) return

      // Get center points of each O container
      const firstO = firstPupilRef.current.parentElement?.getBoundingClientRect()
      const secondO = secondPupilRef.current.parentElement?.getBoundingClientRect()
      
      if (!firstO || !secondO) return

      // Calculate maximum movement radius (20% of O size)
      const maxRadius = Math.min(firstO.width, firstO.height) * 0.2

      // Calculate angles for each pupil
      const firstAngle = Math.atan2(e.clientY - (firstO.top + firstO.height/2), e.clientX - (firstO.left + firstO.width/2))
      const secondAngle = Math.atan2(e.clientY - (secondO.top + secondO.height/2), e.clientX - (secondO.left + secondO.width/2))
      
      // Apply movement within the radius
      firstPupilRef.current.style.transform = `translate(${Math.cos(firstAngle) * maxRadius}px, ${Math.sin(firstAngle) * maxRadius}px)`
      secondPupilRef.current.style.transform = `translate(${Math.cos(secondAngle) * maxRadius}px, ${Math.sin(secondAngle) * maxRadius}px)`
    }

    // Random movement for mobile - only pupils move
    const mobileAnimation = () => {
      if (!firstPupilRef.current || !secondPupilRef.current) return

      const randomPosition = () => {
        const angle = Math.random() * Math.PI * 2
        const radius = 5 // Smaller radius for mobile
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        }
      }

      const pos1 = randomPosition()
      const pos2 = randomPosition()
      
      firstPupilRef.current.style.transform = `translate(${pos1.x}px, ${pos1.y}px)`
      secondPupilRef.current.style.transform = `translate(${pos2.x}px, ${pos2.y}px)`
    }

    if (isMobile) {
      const interval = setInterval(mobileAnimation, 2000)
      return () => clearInterval(interval)
    } else {
      window.addEventListener('mousemove', handleMouseMove)
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
        <span 
          ref={firstPupilRef}
          className="absolute w-2 h-2 bg-black rounded-full transition-transform duration-300"
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
        <span 
          ref={secondPupilRef}
          className="absolute w-2 h-2 bg-black rounded-full transition-transform duration-300"
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