export interface Contract {
  id: string;
  property_id?: string;
  tenant_id?: string;
  montant: number;
  type: string;
  statut?: string;
  start_date?: string;
  end_date?: string;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by_user_id?: string;
  rent_amount?: number;
  deposit_amount?: number;
  status?: string;
}

export type ContractInsert = Partial<Contract>;
export type ContractUpdate = Partial<Contract>;