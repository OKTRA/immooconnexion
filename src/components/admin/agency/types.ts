export interface Agency {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  subscription_plan_id: string | null;
  show_phone_on_site: boolean | null;
  list_properties_on_site: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  logo_url: string | null;
  current_properties_count?: number;
  current_tenants_count?: number;
  current_profiles_count?: number;
  status: 'active' | 'blocked' | 'pending';
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

export type AgencyInsert = Partial<Agency>;
export type AgencyUpdate = Partial<Agency>;