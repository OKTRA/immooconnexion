import { Link } from "react-router-dom"

export function AnimatedLogo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-primary">IMMOO</span>
    </Link>
  )
}