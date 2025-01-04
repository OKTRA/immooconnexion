import { Textarea } from "@/components/ui/textarea"

interface UnitDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export function UnitDescription({ value, onChange }: UnitDescriptionProps) {
  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Description détaillée de l'unité..."
        className="h-32"
      />
    </div>
  )
}