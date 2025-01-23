import { Button } from "@/components/ui/button"
import { DateFields } from "./form/DateFields"
import { PaymentFields } from "./form/PaymentFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { UnitSelector } from "./form/UnitSelector"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface LeaseFormFieldsProps {
  formData: {
    unit_id: string;
    start_date: string;
    end_date?: string;
    rent_amount: number;
    deposit_amount: number;
    payment_frequency: string;
    duration_type: string;
    payment_type: string;
  };
  setFormData: (data: any) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  disabled?: boolean;
}

export function LeaseFormFields({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  onCancel,
  disabled = false
}: LeaseFormFieldsProps) {
  const form = useForm({
    defaultValues: formData
  });

  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['available-units'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Agency ID not found")

      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          unit_number,
          rent_amount,
          status,
          apartment:apartments (
            id,
            name
          )
        `)
        .eq("status", "available")
        .eq("apartments.agency_id", profile.agency_id)
        .order('unit_number', { ascending: true })

      if (error) throw error
      return data
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!formData.unit_id && (
        <UnitSelector
          form={form}
          units={units}
          isLoading={unitsLoading}
        />
      )}
      
      <DateFields formData={formData} setFormData={setFormData} />
      <PaymentFields formData={formData} setFormData={setFormData} />
      <FrequencyFields 
        formData={formData} 
        setFormData={setFormData}
        onDurationTypeChange={(value) => {
          setFormData({ 
            ...formData, 
            duration_type: value,
            end_date: value === 'fixed' ? formData.end_date : undefined 
          })
        }}
      />
      
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={disabled || isSubmitting}
        >
          {isSubmitting ? "Chargement..." : "Créer le bail"}
        </Button>
      </div>
    </form>
  )
}