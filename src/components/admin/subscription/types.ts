import { RefetchOptions } from "@tanstack/react-query"

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  max_properties: number
  max_tenants: number
  max_users: number
  features: string[]
  created_at: string
  updated_at: string
}

export interface SubscriptionPlanRowProps {
  plan: SubscriptionPlan
  onEdit: (plan: SubscriptionPlan) => void
  onDelete: (id: string) => void
  refetch: (options?: RefetchOptions) => Promise<any>
}

export interface EditPlanDialogProps {
  plan: SubscriptionPlan
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export interface PaymentDialogProps {
  plan: SubscriptionPlan
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  propertyId?: string
}