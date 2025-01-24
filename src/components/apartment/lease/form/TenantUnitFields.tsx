import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApartmentTenant, ApartmentUnit } from "@/types/apartment"
import { LeaseFormData } from "../types"
import { UseFormSetValue } from "react-hook-form"

interface TenantUnitFieldsProps {
  tenants: ApartmentTenant[]
  units: ApartmentUnit[]
  formData: LeaseFormData
  onUnitChange: (unitId: string) => void
  setValue: UseFormSetValue<LeaseFormData>
}

export function TenantUnitFields({
  tenants,
  units,
  formData,
  onUnitChange,
  setValue
}: TenantUnitFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="tenant">Locataire</Label>
        <Select
          value={formData.tenant_id}
          onValueChange={(value) => setValue("tenant_id", value)}
        >
          <SelectTrigger id="tenant">
            <SelectValue placeholder="Sélectionner un locataire" />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                {tenant.first_name} {tenant.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unité</Label>
        <Select
          value={formData.unit_id}
          onValueChange={onUnitChange}
        >
          <SelectTrigger id="unit">
            <SelectValue placeholder="Sélectionner une unité" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.apartment?.name} - Unité {unit.unit_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}