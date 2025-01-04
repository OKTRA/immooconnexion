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
  onSave: (plan: SubscriptionPlan) => void
}

export interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId?: string
  planName?: string
  amount?: number
  isUpgrade?: boolean
  propertyId?: string
}

export interface PaymentFormData {
  email: string
  password: string
  confirm_password: string
  agency_name: string
  agency_address: string
  country: string
  city: string
  first_name: string
  last_name: string
  phone_number: string
}