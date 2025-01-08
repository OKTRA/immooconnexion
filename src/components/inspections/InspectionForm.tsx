import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Contract } from "@/integrations/supabase/types"

const formSchema = z.object({
  has_damages: z.boolean().default(false),
  damage_description: z.string().optional(),
  repair_costs: z.string().optional(),
  deposit_returned: z.string(),
})

interface InspectionFormProps {
  lease?: any
  contract?: Contract
}

export function InspectionForm({ lease, contract }: InspectionFormProps) {
  const { toast } = useToast()
  const depositAmount = lease?.deposit_amount || contract?.montant || 0

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      has_damages: false,
      damage_description: "",
      repair_costs: "0",
      deposit_returned: depositAmount.toString(),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const inspectionData = {
        lease_id: lease?.id,
        contract_id: contract?.id,
        has_damages: values.has_damages,
        damage_description: values.damage_description,
        repair_costs: parseInt(values.repair_costs || "0"),
        deposit_returned: parseInt(values.deposit_returned),
        status: "completed",
      }

      if (lease) {
        const { error } = await supabase
          .from("apartment_inspections")
          .insert(inspectionData)

        if (error) throw error
      } else if (contract) {
        const { error } = await supabase
          .from("property_inspections")
          .insert(inspectionData)

        if (error) throw error
      }

      toast({
        title: "État des lieux enregistré",
        description: "L'état des lieux a été enregistré avec succès",
      })
    } catch (error) {
      console.error("Error submitting inspection:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="has_damages"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Dégâts constatés</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("has_damages") && (
          <>
            <FormField
              control={form.control}
              name="damage_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description des dégâts</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repair_costs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coût des réparations (FCFA)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="deposit_returned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caution à rembourser (FCFA)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Enregistrer</Button>
      </form>
    </Form>
  )
}