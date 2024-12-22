import { z } from "zod"

export const paymentFormSchema = z.object({
  propertyId: z.string().min(1, "La propriété est requise"),
  montant: z.string().min(1, "Le montant est requis"),
  tenant_id: z.string().min(1, "Le locataire est requis"),
  type: z.string().min(1, "Le type est requis"),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().min(1, "La date de fin est requise"),
})

export type PaymentFormData = z.infer<typeof paymentFormSchema>