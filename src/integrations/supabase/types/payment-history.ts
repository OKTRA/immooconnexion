export interface PaymentHistory {
  id: string;
  montant: number;
  type: string;
  statut: string;
  created_at: string;
  tenant_id: string;
  tenant_nom: string;
  tenant_prenom: string;
  property_name: string;
  agency_id: string;
}