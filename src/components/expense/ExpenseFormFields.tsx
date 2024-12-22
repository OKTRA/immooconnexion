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
import { useEffect } from "react"

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

  // Fetch user's properties
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user?.id) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', session.session.user.id)
      
      if (error) throw error
      return data
    },
    enabled: !propertyId // Only fetch if propertyId is not provided
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

  // Set propertyId when it's provided as a prop
  useEffect(() => {
    if (propertyId) {
      form.setValue('propertyId', propertyId)
    }
  }, [propertyId, form])

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Check authentication
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user?.id) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer une dépense",
          variant: "destructive",
        })
        return
      }

      // Verify property ownership
      const { data: property } = await supabase
        .from('properties')
        .select('user_id')
        .eq('id', data.propertyId)
        .single()

      if (!property || property.user_id !== session.session.user.id) {
        toast({
          title: "Erreur",
          description: "Vous n'avez pas les droits pour enregistrer une dépense pour cette propriété",
          variant: "destructive",
        })
        return
      }

      console.log("Submitting expense with data:", {
        property_id: data.propertyId,
        montant: parseFloat(data.montant),
        description: data.description,
        date: data.date
      });

      const { error } = await supabase
        .from('expenses')
        .insert({
          property_id: data.propertyId,
          montant: parseFloat(data.montant),
          description: data.description,
          date: data.date
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