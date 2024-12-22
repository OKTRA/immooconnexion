import { z } from "zod"

export const expenseFormSchema = z.object({
  propertyId: z.string().min(1, "La propriété est requise"),
  montant: z.string().min(1, "Le montant est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
})

export type ExpenseFormData = z.infer<typeof expenseFormSchema>