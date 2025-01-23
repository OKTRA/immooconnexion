import { Button } from "@/components/ui/button"
import { DateFields } from "./DateFields"
import { PaymentFields } from "./PaymentFields"
import { FrequencyFields } from "./FrequencyFields"
import { UnitSelector } from "./UnitSelector"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Unit } from "./UnitSelector"

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
  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['available-units'],
    queryFn: async () => {
      console.log("Fetching available units...")
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Agency ID not found")

      console.log("Fetching units for agency:", profile.agency_id)

      const { data, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          unit_number,
          rent_amount,
          apartment:apartments (
            id,
            name
          )
        `)
        .eq("status", "available")
        .eq("apartments.agency_id", profile.agency_id)

      if (error) {
        console.error("Error fetching units:", error)
        throw error
      }
      
      console.log("Available units:", data)
      return data as Unit[]
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const isFormValid = () => {
    console.log("Form validation check:", {
      unit_id: formData.unit_id,
      start_date: formData.start_date,
      rent_amount: formData.rent_amount,
      deposit_amount: formData.deposit_amount,
      payment_frequency: formData.payment_frequency,
      duration_type: formData.duration_type,
      payment_type: formData.payment_type,
      end_date: formData.end_date,
    });

    const valid = !!(
      formData.unit_id &&
      formData.start_date &&
      formData.rent_amount &&
      formData.deposit_amount >= 0 &&
      formData.payment_frequency &&
      formData.duration_type &&
      formData.payment_type &&
      (formData.duration_type !== 'fixed' || formData.end_date)
    );

    console.log("Form is valid:", valid);
    return valid;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <UnitSelector
        value={formData.unit_id}
        onChange={(value) => setFormData({ ...formData, unit_id: value })}
        units={units}
        isLoading={unitsLoading}
      />
      
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
          disabled={disabled || !isFormValid() || isSubmitting}
        >
          {isSubmitting ? "Chargement..." : "Créer le bail"}
        </Button>
      </div>
    </form>
  )
}