import { ApartmentLease } from "@/types/apartment"

export interface ApartmentTenantWithLease {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  birth_date?: string
  photo_id_url?: string
  agency_id: string
  unit_id?: string
  agency_fees?: number
  profession?: string
  apartment_leases?: ApartmentLease[]
}

export interface ApartmentTenantsTableProps {
  onEdit: (tenant: ApartmentTenantWithLease) => void
  onDelete: (id: string) => Promise<void>
  isLoading?: boolean
}