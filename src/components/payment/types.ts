import * as z from "zod"

export const paymentFormSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  address: z.string().min(5, "L'adresse est requise"),
  country: z.string().min(2, "Le pays est requis"),
  city: z.string().min(2, "La ville est requise"),
})

export type PaymentFormData = z.infer<typeof paymentFormSchema>