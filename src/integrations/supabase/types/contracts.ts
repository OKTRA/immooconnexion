export type Contract = {
  id: string;
  property_id: string;
  montant: number;
  type: string;
  statut: string;
  created_at: string;
  updated_at: string;
  tenant_id: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
};

export type ContractInsert = {
  id?: string;
  property_id: string;
  montant: number;
  type: string;
  statut?: string;
  created_at?: string;
  updated_at?: string;
  tenant_id?: string | null;
  start_date?: string;
  end_date?: string | null;
  description?: string | null;
};

export type ContractUpdate = {
  id?: string;
  property_id?: string;
  montant?: number;
  type?: string;
  statut?: string;
  created_at?: string;
  updated_at?: string;
  tenant_id?: string | null;
  start_date?: string;
  end_date?: string | null;
  description?: string | null;
};