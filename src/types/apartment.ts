export interface ApartmentUnit {
  id: string
  apartment_id: string
  unit_number: string
  floor_number?: number
  area?: number
  rent_amount: number
  deposit_amount?: number
  status: ApartmentUnitStatus
  description?: string
  photo_urls?: string[]
  created_at: string
  updated_at: string
}

export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved'

export interface ApartmentTenant {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  birth_date?: string
  photo_id_url?: string
  agency_id: string
  unit_id?: string
  employer_name?: string
  employer_phone?: string
  employer_address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
  additional_notes?: string
  bank_name?: string
  bank_account_number?: string
  agency_fees?: number
  profession?: string
  created_at: string
  updated_at: string
}

export interface LeaseFormData {
  startDate: string
  endDate: string
  rentAmount: string
  depositAmount: string
  paymentFrequency: PaymentFrequency
  durationType: DurationType
  status: LeaseStatus
  paymentType: PaymentType
  depositReturned: boolean
  depositReturnDate?: string
  depositReturnAmount?: string
  depositReturnNotes?: string
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
export type DurationType = 'fixed' | 'month_to_month' | 'yearly'
export type LeaseStatus = 'active' | 'expired' | 'terminated'
export type PaymentType = 'upfront' | 'end_of_period'

export interface Property {
  id: string
  bien: string
  type: string
  chambres?: number
  ville?: string
  loyer?: number
  frais_agence?: number
  taux_commission?: number
  caution?: number
  photo_url?: string
  statut?: string
  user_id?: string
  agency_id?: string
  created_at?: string
  updated_at?: string
  created_by_user_id?: string
  parent_property_id?: string
  rental_type?: string
  property_category: 'house' | 'apartment'
  is_for_sale?: boolean
  sale_price?: number
  minimum_stay?: number
  maximum_stay?: number
  price_per_night?: number
  price_per_week?: number
  total_units?: number
  owner_name?: string
  owner_phone?: string
  country?: string
  quartier?: string
}

export interface TenantReceiptData {
  id: string
  property_id: string
  montant: number
  type: string
  statut: string
  created_at: string
  tenant_id: string
  tenant_nom: string
  tenant_prenom: string
  property_name: string
  agency_id: string
}

export interface TenantFormData {
  first_name: string
  last_name: string
  phone_number: string
  email?: string
  birth_date?: string
  profession?: string
  agency_fees?: number
  photo_id_url?: string
}