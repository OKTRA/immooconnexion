import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface DescriptionSectionProps {
  description: string
  onDescriptionChange: (value: string) => void
}

export function DescriptionSection({ description, onDescriptionChange }: DescriptionSectionProps) {
  return (
    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm space-y-2">
      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Description
      </Label>
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Description détaillée de l'unité..."
        className="h-32 bg-white dark:bg-gray-700"
      />
    </div>
  )
}