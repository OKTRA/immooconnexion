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

export interface TenantReceiptData {
  nom: string;
  prenom: string;
  telephone: string;
  fraisAgence: string;
  profession?: string;
  propertyId?: string;
}