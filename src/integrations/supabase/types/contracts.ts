export interface Contract {
  id: string;
  property_id: string | null;
  tenant_id: string | null;
  montant: number;
  type: string;
  statut: string | null;
  start_date: string | null;
  end_date: string | null;
  agency_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by_user_id: string | null;
  // Additional fields from the join
  tenant_nom?: string;
  tenant_prenom?: string;
  property_name?: string;
}

export type ContractInsert = Partial<Contract>;
export type ContractUpdate = Partial<Contract>;