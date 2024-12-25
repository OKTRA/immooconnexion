import { useEffect, useRef } from "react"

export function AnimatedLogo() {
  const firstORef = useRef<HTMLSpanElement>(null)
  const secondORef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!firstORef.current || !secondORef.current) return

      // Get center points of each O
      const firstO = firstORef.current.getBoundingClientRect()
      const secondO = secondORef.current.getBoundingClientRect()
      
      // Calculate angles for each O
      const firstAngle = Math.atan2(e.clientY - (firstO.top + firstO.height/2), e.clientX - (firstO.left + firstO.width/2))
      const secondAngle = Math.atan2(e.clientY - (secondO.top + secondO.height/2), e.clientX - (secondO.left + secondO.width/2))
      
      // Apply rotation
      firstORef.current.style.transform = `rotate(${firstAngle}rad)`
      secondORef.current.style.transform = `rotate(${secondAngle}rad)`
    }

    // Random movement for mobile
    const mobileAnimation = () => {
      if (!firstORef.current || !secondORef.current) return

      const randomAngle = () => Math.random() * Math.PI * 2
      
      firstORef.current.style.transform = `rotate(${randomAngle()}rad)`
      secondORef.current.style.transform = `rotate(${randomAngle()}rad)`
    }

    if (window.innerWidth > 768) {
      window.addEventListener('mousemove', handleMouseMove)
    } else {
      const interval = setInterval(mobileAnimation, 2000)
      return () => clearInterval(interval)
    }

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="text-4xl font-bold tracking-tight">
      <span className="font-graffiti bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        IMM
      </span>
      <span 
        ref={firstORef}
        className="inline-block font-graffiti bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-transform duration-300"
      >
        O
      </span>
      <span 
        ref={secondORef}
        className="inline-block font-graffiti bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-transform duration-300"
      >
        O
      </span>
    </div>
  )
}