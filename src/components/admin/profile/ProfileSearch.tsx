import { Input } from "@/components/ui/input"

interface ProfileSearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export function ProfileSearch({ searchTerm, setSearchTerm }: ProfileSearchProps) {
  return (
    <Input
      placeholder="Rechercher par nom, prénom, email..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="max-w-sm"
    />
  )
}