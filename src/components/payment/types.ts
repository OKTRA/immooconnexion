import { z } from "zod"

export const paymentFormSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirm_password: z.string(),
  agency_name: z.string().min(2, "Le nom de l'agence doit contenir au moins 2 caractères"),
  agency_address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  country: z.string().min(2, "Le pays est requis"),
  city: z.string().min(2, "La ville est requise"),
  first_name: z.string().min(2, "Le prénom est requis"),
  last_name: z.string().min(2, "Le nom est requis"),
  phone_number: z.string().min(8, "Numéro de téléphone invalide"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
})

export type PaymentFormData = z.infer<typeof paymentFormSchema>

export interface CinetPayFormProps {
  amount: number
  description: string
  onSuccess?: () => void
  onError?: (error: any) => void
  agencyId?: string | null
  formData: PaymentFormData
}

export interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId?: string
  planName?: string
  amount?: number
  tempAgencyId?: string | null
  propertyId?: string
}