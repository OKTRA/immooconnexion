export interface Contract {
  id: string
  property_id?: string
  tenant_id?: string
  montant: number
  type: string
  statut?: string
  start_date?: string
  end_date?: string
  agency_id?: string
  created_at?: string
  updated_at?: string
  created_by_user_id?: string
}

export interface ContractInsert extends Omit<Contract, 'id'> {}
export interface ContractUpdate extends Partial<Contract> {}