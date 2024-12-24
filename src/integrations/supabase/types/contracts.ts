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
}

export type ContractInsert = Partial<Contract>;
export type ContractUpdate = Partial<Contract>;