export interface TenantFormData {
  id?: string
  first_name: string
  last_name: string
  phone_number: string
  birth_date?: string
  photo_id_url?: string
  agency_fees?: number
  property_id?: string
  profession?: string
  email?: string
  nom?: string
  prenom?: string
  telephone?: string
  fraisAgence?: number
  propertyId?: string
}

export interface TenantReceiptData {
  first_name: string
  last_name: string
  phone_number: string
  agency_fees: number
  property_id: string
  property_name?: string
  profession?: string
  receipt_date?: string
  receipt_number?: string
  nom?: string
  prenom?: string
  telephone?: string
  fraisAgence?: number
}

export interface TenantReceiptProps {
  tenant: TenantReceiptData
  isEndReceipt?: boolean
  isInitialReceipt?: boolean
  lease?: {
    montant: number
    type: 'location'
    rent_amount: number
    deposit_amount: number
    start_date: string
    end_date: string
    status: string
  }
}