import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface ActionButtonProps {
  icon: LucideIcon
  onClick: () => void
  title: string
  className?: string
}

export function ActionButton({ icon: Icon, onClick, title, className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}