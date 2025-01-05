import { Agency as BaseAgency } from "@/integrations/supabase/types/agencies"

export type Agency = BaseAgency & {
  subscription_plans?: {
    id: string;
    name: string;
    price: number;
    max_properties: number;
    max_tenants: number;
    max_users: number;
    features: string[];
  };
}