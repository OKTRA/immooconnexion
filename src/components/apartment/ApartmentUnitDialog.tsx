import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

const unitSchema = z.object({
  unit_number: z.string().min(1, "Le numéro d'unité est requis"),
  floor_number: z.number().min(0, "L'étage doit être un nombre positif"),
  area: z.number().min(1, "La surface doit être supérieure à 0"),
  rent_amount: z.number().min(1, "Le loyer doit être supérieur à 0"),
  deposit_amount: z.number().min(0, "La caution doit être un nombre positif"),
  status: z.enum(["available", "occupied", "maintenance"]),
  description: z.string().optional(),
})

type UnitFormValues = z.infer<typeof unitSchema>

interface ApartmentUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apartmentId: string
  unitToEdit?: {
    id: string
    unit_number: string
    floor_number: number
    area: number
    rent_amount: number
    deposit_amount: number
    status: string
    description?: string
  }
  onSuccess: () => void
}

export function ApartmentUnitDialog({
  open,
  onOpenChange,
  apartmentId,
  unitToEdit,
  onSuccess,
}: ApartmentUnitDialogProps) {
  const { toast } = useToast()
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: unitToEdit || {
      unit_number: "",
      floor_number: 0,
      area: 0,
      rent_amount: 0,
      deposit_amount: 0,
      status: "available",
      description: "",
    },
  })

  async function onSubmit(data: UnitFormValues) {
    try {
      if (unitToEdit) {
        const { error } = await supabase
          .from("apartment_units")
          .update(data)
          .eq("id", unitToEdit.id)

        if (error) throw error
        toast({ title: "Unité mise à jour avec succès" })
      } else {
        const { error } = await supabase
          .from("apartment_units")
          .insert([{ ...data, apartment_id: apartmentId }])

        if (error) throw error
        toast({ title: "Unité créée avec succès" })
      }

      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {unitToEdit ? "Modifier l'unité" : "Nouvelle unité"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="unit_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro d'unité</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floor_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Étage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface (m²)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rent_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loyer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deposit_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caution</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="occupied">Occupé</SelectItem>
                      <SelectItem value="maintenance">En maintenance</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {unitToEdit ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}