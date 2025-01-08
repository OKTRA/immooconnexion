export interface Contract {
  id: string;
  property_id: string | null;
  tenant_id: string | null;
  montant: number;
  type: string;
  statut: string;
  start_date: string | null;
  end_date: string | null;
  agency_id: string | null;
  created_at: string;
  updated_at: string;
  created_by_user_id: string | null;
}

export interface ContractInsert extends Omit<Contract, 'id' | 'created_at' | 'updated_at'> {}
export interface ContractUpdate extends Partial<ContractInsert> {}