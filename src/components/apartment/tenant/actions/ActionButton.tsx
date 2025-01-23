import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface ActionButtonProps {
  icon: LucideIcon
  onClick: () => void
  title?: string
}

export function ActionButton({ icon: Icon, onClick, title }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}