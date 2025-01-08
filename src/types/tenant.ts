export interface TenantFormData {
  id?: string;
  nom: string;
  prenom: string;
  telephone: string;
  fraisAgence: string;
  profession?: string;
  propertyId?: string;
  dateNaissance?: string;
  photoIdUrl?: string;
}

export interface TenantReceiptProps {
  tenant: {
    nom: string;
    prenom: string;
    telephone: string;
    fraisAgence: string;
    propertyId?: string;
    profession?: string;
  };
  isInitialReceipt?: boolean;
  isEndReceipt?: boolean;
  lease?: any;
  contractId?: string;
  isEndOfContract?: boolean;
  inspection?: any;
}