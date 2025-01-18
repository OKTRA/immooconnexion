import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

interface PropertyOwnerFormProps {
  owner?: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone_number: string | null
    status: 'active' | 'inactive'
  }
  onSuccess: () => void
}

export function PropertyOwnerForm({ owner, onSuccess }: PropertyOwnerFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      first_name: owner?.first_name || '',
      last_name: owner?.last_name || '',
      email: owner?.email || '',
      phone_number: owner?.phone_number || '',
      status: owner?.status || 'active'
    }
  })

  const onSubmit = async (values: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (!profile?.agency_id) throw new Error('No agency found')

      if (owner) {
        // Update
        const { error } = await supabase
          .from('property_owners')
          .update(values)
          .eq('id', owner.id)

        if (error) throw error
      } else {
        // Insert
        const { data: newOwner, error: ownerError } = await supabase
          .from('property_owners')
          .insert(values)
          .select()
          .single()

        if (ownerError) throw ownerError

        // Create agency-owner relationship
        const { error: relationError } = await supabase
          .from('agency_owners')
          .insert({
            owner_id: newOwner.id,
            agency_id: profile.agency_id
          })

        if (relationError) throw relationError
      }

      toast({
        title: owner ? "Propriétaire modifié" : "Propriétaire ajouté",
        description: owner 
          ? "Le propriétaire a été modifié avec succès"
          : "Le propriétaire a été ajouté avec succès"
      })

      queryClient.invalidateQueries({ queryKey: ['property-owners'] })
      onSuccess()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
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
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit">
            {owner ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  )
}