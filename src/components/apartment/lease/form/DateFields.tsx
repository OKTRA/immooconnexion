import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LeaseFormData } from "../types"

interface DateFieldsProps {
  formData: LeaseFormData;
  setFormData: (data: LeaseFormData) => void;
}

export function DateFields({ formData, setFormData }: DateFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="start_date">Date de début</Label>
        <Input
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          required
        />
      </div>

      {formData.duration_type === "fixed" && (
        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
          />
        </div>
      )}
    </div>
  )
}