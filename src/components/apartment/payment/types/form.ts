import { z } from "zod"

export const paymentFormSchema = z.object({
  leaseId: z.string(),
  amount: z.number(),
  paymentMethod: z.enum(["cash", "bank_transfer", "mobile_money"]),
  paymentPeriods: z.array(z.string())
})

export type PaymentFormData = z.infer<typeof paymentFormSchema>

export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money"

export interface PaymentFormProps {
  onSuccess?: () => void;
  tenantId: string;
}