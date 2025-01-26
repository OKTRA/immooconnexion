import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormData } from "../types"

interface LeaseBasicFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function LeaseBasicFields({ formData, setFormData }: LeaseBasicFieldsProps) {
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

      <div className="space-y-2">
        <Label htmlFor="end_date">Date de fin (optionnel)</Label>
        <Input 
          type="date" 
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rent_amount">Loyer</Label>
        <Input 
          type="number" 
          value={formData.rent_amount}
          onChange={(e) => setFormData({ ...formData, rent_amount: Number(e.target.value) })}
          readOnly={!!formData.unit_id}
          className={formData.unit_id ? "bg-gray-100" : ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deposit_amount">Caution</Label>
        <Input 
          type="number" 
          value={formData.deposit_amount}
          onChange={(e) => setFormData({ ...formData, deposit_amount: Number(e.target.value) })}
          readOnly={!!formData.unit_id}
          className={formData.unit_id ? "bg-gray-100" : ""}
          required
        />
      </div>
    </div>
  )
}