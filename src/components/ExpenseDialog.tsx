import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  montant: z.string().min(1, "Le montant est requis"),
  type: z.string().default("loyer"),
  tenant_id: z.string().min(1, "Le locataire est requis"),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().min(1, "La date de fin est requise"),
})

type ExpenseFormData = z.infer<typeof formSchema>

interface ExpenseDialogProps {
  propertyId: string
  propertyRent?: number
}

export function ExpenseDialog({ propertyId, propertyRent }: ExpenseDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
      
      if (error) throw error
      return data
    }
  })

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montant: propertyRent?.toString() || "",
      type: "loyer",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Create the contract/payment record
      const { error: contractError } = await supabase
        .from('contracts')
        .insert({
          property_id: propertyId,
          tenant_id: data.tenant_id,
          montant: parseFloat(data.montant),
          type: data.type,
          statut: "payé",
          start_date: data.start_date,
          end_date: data.end_date,
        })

      if (contractError) throw contractError

      // Update property status to "occupé"
      const { error: propertyError } = await supabase
        .from('properties')
        .update({ statut: 'occupé' })
        .eq('id', propertyId)

      if (propertyError) throw propertyError

      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès",
      })

      queryClient.invalidateQueries({ queryKey: ['contracts', propertyId] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      form.reset()
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
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Enregistrer un paiement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Enregistrez un paiement de loyer pour ce bien
          </DialogDescription>
        </DialogHeader>
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
            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}