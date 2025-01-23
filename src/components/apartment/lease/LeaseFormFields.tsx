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
  const form = useForm({
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

  // Récupérer les unités disponibles
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
          apartment:apartments (
            id,
            name
          )
        `)
        .eq("status", "available")
        .eq("apartments.agency_id", profile.agency_id)

      if (error) throw error
      return data
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Chargement..." : "Créer le bail"}
          </Button>
        </div>
      </form>
    </Form>
  )
}