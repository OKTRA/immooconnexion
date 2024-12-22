import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

const formSchema = z.object({
  propertyId: z.string().min(1, "La propriété est requise"),
  montant: z.string().min(1, "Le montant est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
});

type ExpenseFormData = z.infer<typeof formSchema>

interface ExpenseFormFieldsProps {
  propertyId?: string
  onSuccess?: () => void
}

export function ExpenseFormFields({ propertyId, onSuccess }: ExpenseFormFieldsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
      
      if (error) throw error
      return data
    },
    enabled: !propertyId
  })

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId: propertyId || "",
      montant: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      console.log("Submitting expense with data:", {
        property_id: data.propertyId,
        montant: -parseFloat(data.montant),
        description: data.description,
        date: data.date
      });

      const { error } = await supabase
        .from('contracts')
        .insert({
          property_id: data.propertyId,
          montant: -parseFloat(data.montant), // Negative amount for expenses
          type: 'depense',
          description: data.description,
          statut: 'payé',
          start_date: data.date,
          end_date: data.date // For expenses, both dates are the same
        })

      if (error) {
        console.error("Error inserting expense:", error);
        throw error;
      }

      toast({
        title: "Dépense enregistrée",
        description: "La dépense a été enregistrée avec succès",
      })

      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la dépense:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la dépense",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!propertyId && (
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Propriété</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une propriété" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {properties?.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.bien} - {property.ville}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description de la dépense" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
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