export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  max_properties: number;
  max_tenants: number;
  max_users: number;
  features: string[];
  duration_months: number;
}

export interface SubscriptionLimits {
  maxProperties: number;
  maxTenants: number;
  maxUsers: number;
  currentProperties: number;
  currentTenants: number;
  currentUsers: number;
}