import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { DateFields } from "./DateFields"
import { PaymentFields } from "./PaymentFields"
import { FrequencyFields } from "./FrequencyFields"
import { UnitSelector } from "./UnitSelector"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SplitLeaseFormFieldsProps {
  formData: {
    unit_id: string;
    start_date: string;
    end_date?: string;
    rent_amount: number;
    deposit_amount: number;
    payment_frequency: string;
    duration_type: string;
    payment_type: string;
    split_type: 'A' | 'B';
  };
  setFormData: (data: any) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  disabled?: boolean;
  tenantId: string;
}

export function SplitLeaseFormFields({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  onCancel,
  disabled = false,
  tenantId
}: SplitLeaseFormFieldsProps) {
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

        <div className="space-y-4">
          <div>
            <Label>Type de Split</Label>
            <Select 
              value={formData.split_type} 
              onValueChange={(value: 'A' | 'B') => setFormData({ ...formData, split_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de split" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Split A</SelectItem>
                <SelectItem value="B">Split B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <UnitSelector
            value={formData.unit_id}
            onChange={(value) => setFormData({ ...formData, unit_id: value })}
          />
          
          <DateFields formData={formData} setFormData={setFormData} />
          
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
        </div>
        
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
            {isSubmitting ? "Chargement..." : "Créer le bail partagé"}
          </Button>
        </div>
      </form>
    </Form>
  )
}