export type Contract = {
  id: string
  property_id: string
  montant: number
  type: string
  statut: string
  created_at: string
  updated_at: string
}

export type ContractInsert = {
  id?: string
  property_id: string
  montant: number
  type: string
  statut?: string
  created_at?: string
  updated_at?: string
}

export type ContractUpdate = {
  id?: string
  property_id?: string
  montant?: number
  type?: string
  statut?: string
  created_at?: string
  updated_at?: string
}