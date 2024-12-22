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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

const formSchema = z.object({
  montant: z.string().min(1, "Le montant est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
})

type ExpenseFormData = z.infer<typeof formSchema>

interface ExpenseFormFieldsProps {
  propertyId: string
  onSuccess?: () => void
}

export function ExpenseFormFields({ propertyId, onSuccess }: ExpenseFormFieldsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montant: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .insert({
          property_id: propertyId,
          montant: -parseFloat(data.montant), // Negative amount for expenses
          type: 'depense',
          description: data.description,
          statut: 'payé',
          start_date: data.date,
          end_date: data.date,
        })

      if (error) throw error

      toast({
        title: "Dépense enregistrée",
        description: "La dépense a été enregistrée avec succès",
      })

      queryClient.invalidateQueries({ queryKey: ['contracts'] })
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