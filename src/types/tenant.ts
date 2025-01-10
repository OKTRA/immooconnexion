export interface TenantFormData {
  first_name: string
  last_name: string
  phone_number: string
  birth_date?: string
  photo_id_url?: string
  agency_fees?: number
  property_id?: string
  profession?: string
  email?: string
}

export interface TenantReceiptData {
  first_name: string
  last_name: string
  phone_number: string
  agency_fees: number
  property_id: string
  property_name?: string
  receipt_date: string
  receipt_number: string
}