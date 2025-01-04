import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ParentPropertyInfoProps {
  propertyData: any
}

export function ParentPropertyInfo({ propertyData }: ParentPropertyInfoProps) {
  return (
    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm">
      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Appartement
      </Label>
      <Input
        value={propertyData?.bien || ""}
        readOnly
        className="mt-1 bg-purple-50/50 dark:bg-gray-700/50 border-purple-100 dark:border-gray-600"
      />
    </div>
  )
}