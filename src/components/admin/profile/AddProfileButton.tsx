import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

interface AddProfileButtonProps {
  onClick: () => void
}

export function AddProfileButton({ onClick }: AddProfileButtonProps) {
  return (
    <Button onClick={onClick}>
      <UserPlus className="mr-2" />
      Ajouter un profil
    </Button>
  )
}