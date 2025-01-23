import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { DateFields } from "./form/DateFields"
import { PaymentFields } from "./form/PaymentFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { UnitSelector } from "./form/UnitSelector"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
type DurationType = 'fixed' | 'month_to_month';
type PaymentType = 'upfront' | 'end_of_period';

interface LeaseFormData {
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  payment_type: PaymentType;
}

interface LeaseFormFieldsProps {
  formData: LeaseFormData;
  setFormData: (data: LeaseFormData) => void;
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
  const form = useForm<LeaseFormData>({
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
      
      return data.map(unit => ({
        id: unit.id,
        unit_number: unit.unit_number,
        rent_amount: unit.rent_amount,
        status: unit.status,
        apartment: {
          id: unit.apartment.id,
          name: unit.apartment.name
        }
      }))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <Form {...form}>
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
              duration_type: value as DurationType,
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
    </Form>
  )
}