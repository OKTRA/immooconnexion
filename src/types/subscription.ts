export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  maxProperties: number
  maxTenants: number
  maxUsers: number
  features: string[]
}

export interface SubscriptionLimits {
  maxProperties: number
  maxTenants: number
  maxUsers: number
  currentProperties: number
  currentTenants: number
  currentUsers: number
}