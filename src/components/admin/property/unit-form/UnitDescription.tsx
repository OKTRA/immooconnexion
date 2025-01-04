import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface UnitDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export function UnitDescription({ value, onChange }: UnitDescriptionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Description de l'unité..."
        className="min-h-[100px]"
      />
    </div>
  )
}