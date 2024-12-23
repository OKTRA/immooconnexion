import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RoleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function RoleSelect({ value, onValueChange }: RoleSelectProps) {
  return (
    <div>
      <Label htmlFor="role">Rôle</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Utilisateur</SelectItem>
          <SelectItem value="admin">Administrateur</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}