import { UseFormReturn } from "react-hook-form"
import { PropertyUnit } from "@/components/admin/property/types/propertyUnit"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface UnitFormFieldsProps {
  form: UseFormReturn<any>
  selectedUnit?: PropertyUnit
  apartmentId: string
  onSuccess: () => void
}

export function UnitFormFields({
  form,
  selectedUnit,
  apartmentId,
  onSuccess
}: UnitFormFieldsProps) {
  const { toast } = useToast()
  const isEditing = !!selectedUnit

  const onSubmit = async (data: any) => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('apartment_units')
          .update({
            unit_number: data.unit_number,
            floor_number: data.floor_number,
            area: data.area,
            rent_amount: data.rent_amount,
            deposit_amount: data.deposit_amount,
            status: data.status,
            description: data.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedUnit.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('apartment_units')
          .insert({
            apartment_id: apartmentId,
            unit_number: data.unit_number,
            floor_number: data.floor_number,
            area: data.area,
            rent_amount: data.rent_amount,
            deposit_amount: data.deposit_amount,
            status: data.status,
            description: data.description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      }

      toast({
        title: "Succès",
        description: isEditing ? "Unité mise à jour" : "Unité créée",
      })
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="unit_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro d'unité</FormLabel>
            <FormControl>
              <Input {...field} placeholder="A101" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="floor_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Étage</FormLabel>
            <FormControl>
              <Input {...field} type="number" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Surface (m²)</FormLabel>
            <FormControl>
              <Input {...field} type="number" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loyer</FormLabel>
            <FormControl>
              <Input {...field} type="number" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="deposit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dépôt de garantie</FormLabel>
            <FormControl>
              <Input {...field} type="number" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="rented">Loué</SelectItem>
                <SelectItem value="maintenance">En maintenance</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full">
        {isEditing ? "Mettre à jour" : "Créer"}
      </Button>
    </form>
  )
}