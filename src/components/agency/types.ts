import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
  agency_name: z.string().min(2),
  agency_address: z.string(),
  agency_phone: z.string(),
  country: z.string(),
  city: z.string(),
  first_name: z.string(),
  last_name: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export type FormData = z.infer<typeof formSchema>;

export interface AgencyRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  planName: string;
  amount: number;
}