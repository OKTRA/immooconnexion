import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { paymentFormSchema, type PaymentFormData } from "./types"

interface PaymentFormFieldsProps {
  propertyId: string
  onSuccess?: () => void
}

export function PaymentFormFields({ propertyId, onSuccess }: PaymentFormFieldsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch user's agency_id
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return profile
    }
  })

  // Fetch tenants
  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, nom, prenom')
      
      if (error) throw error
      return data
    }
  })

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      propertyId,
      montant: "",
      tenant_id: "",
      type: "loyer",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: PaymentFormData) => {
    try {
      if (!userProfile?.agency_id) {
        throw new Error('No agency associated with user')
      }

      const { error } = await supabase
        .from('contracts')
        .insert({
          property_id: data.propertyId,
          tenant_id: data.tenant_id,
          montant: parseFloat(data.montant),
          type: data.type,
          statut: "payé",
          start_date: data.start_date,
          end_date: data.end_date,
          agency_id: userProfile.agency_id // Add the agency_id here
        })

      if (error) throw error

      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès",
      })

      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tenant_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locataire</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un locataire" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tenants?.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.prenom} {tenant.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="montant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant (FCFA)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de paiement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="loyer">Loyer</SelectItem>
                  <SelectItem value="caution">Caution</SelectItem>
                  <SelectItem value="frais_agence">Frais d'agence</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de début</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de fin</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Enregistrer</Button>
      </form>
    </Form>
  )
}