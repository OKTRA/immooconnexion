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
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  montant: z.string().min(1, "Le montant est requis"),
  type: z.string().default("loyer"),
})

type ExpenseFormData = z.infer<typeof formSchema>

interface ExpenseDialogProps {
  propertyId: string
  propertyRent?: number
}

export function ExpenseDialog({ propertyId, propertyRent }: ExpenseDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montant: propertyRent?.toString() || "",
      type: "loyer",
    },
  })

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .insert({
          property_id: propertyId,
          montant: parseFloat(data.montant),
          type: data.type,
          statut: "payé",
        })

      if (error) throw error

      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès",
      })

      queryClient.invalidateQueries({ queryKey: ['contracts', propertyId] })
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
            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}