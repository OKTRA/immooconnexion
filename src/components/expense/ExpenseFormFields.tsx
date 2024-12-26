import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { PropertySelect } from "./PropertySelect"
import { ExpenseFields } from "./ExpenseFields"
import { expenseFormSchema, type ExpenseFormData } from "./types"

interface ExpenseFormFieldsProps {
  propertyId?: string
  onSuccess?: () => void
}

export function ExpenseFormFields({ propertyId, onSuccess }: ExpenseFormFieldsProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch current user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    }
  })

  // Fetch user's profile to get agency_id
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("User not authenticated")
      
      const { data, error } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', session.user.id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id
  })

  // Fetch user's properties
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id && !propertyId
  })

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      propertyId: propertyId || "",
      montant: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (propertyId) {
      form.setValue('propertyId', propertyId)
    }
  }, [propertyId, form])

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer une dépense",
          variant: "destructive",
        })
        return
      }

      if (!profile?.agency_id) {
        toast({
          title: "Erreur",
          description: "Vous devez être associé à une agence pour enregistrer une dépense",
          variant: "destructive",
        })
        return
      }

      console.log("Submitting expense with data:", {
        property_id: data.propertyId,
        montant: parseFloat(data.montant),
        description: data.description,
        date: data.date,
        agency_id: profile.agency_id
      });

      const { error } = await supabase
        .from('expenses')
        .insert({
          property_id: data.propertyId,
          montant: parseFloat(data.montant),
          description: data.description,
          date: data.date,
          agency_id: profile.agency_id
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
        <PropertySelect 
          form={form}
          properties={properties}
          propertyId={propertyId}
        />
        <ExpenseFields form={form} />
        <Button type="submit" className="w-full">Enregistrer</Button>
      </form>
    </Form>
  )
}