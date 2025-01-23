import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { DateFields } from "./form/DateFields"
import { PaymentFields } from "./form/PaymentFields"
import { FrequencyFields } from "./form/FrequencyFields"
import { UnitSelector } from "./form/UnitSelector"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"

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
  tenantId: string;
}

export function LeaseFormFields({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  onCancel,
  disabled = false,
  tenantId
}: LeaseFormFieldsProps) {
  const form = useForm<LeaseFormData>({
    defaultValues: formData
  });

  // Récupérer les informations du locataire
  const { data: tenant } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_tenants')
        .select('*')
        .eq('id', tenantId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!tenantId
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.unit_id) {
      return
    }
    await onSubmit()
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {tenant && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Locataire</label>
                  <p className="mt-1">{tenant.first_name} {tenant.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Téléphone</label>
                  <p className="mt-1">{tenant.phone_number || 'Non renseigné'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <UnitSelector
          form={form}
          value={formData.unit_id}
          onChange={(value) => setFormData({ ...formData, unit_id: value })}
        />
        
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
            disabled={disabled || !formData.unit_id || isSubmitting}
          >
            {isSubmitting ? "Chargement..." : "Créer le bail"}
          </Button>
        </div>
      </form>
    </Form>
  )
}