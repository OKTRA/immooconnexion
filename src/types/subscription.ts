export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  max_properties: number;
  max_tenants: number;
  max_users: number;
  features: string[];
  duration_months?: number;
}

export interface SubscriptionLimits {
  max_properties: number;
  max_tenants: number;
  max_users: number;
  current_properties: number;
  current_tenants: number;
  current_users: number;
}