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
  tenant_nom?: string;
  tenant_prenom?: string;
  property_name?: string;
}

export type ContractInsert = Partial<Contract>;
export type ContractUpdate = Partial<Contract>;