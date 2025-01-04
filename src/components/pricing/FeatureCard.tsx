import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        "relative p-6 hover:shadow-lg transition-shadow duration-300",
        "bg-white/50 backdrop-blur-sm"
      )}
    >
      <div className="mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </Card>
  )
}