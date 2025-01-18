import { z } from "zod"

export const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
  agency_name: z.string().min(2),
  agency_address: z.string().min(2),
  agency_phone: z.string().min(8),
  country: z.string().min(2),
  city: z.string().min(2),
  first_name: z.string().min(2),
  last_name: z.string().min(2)
})

export type FormData = z.infer<typeof formSchema>