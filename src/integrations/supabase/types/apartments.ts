export type Apartment = {
  id: string;
  name: string;
  total_units: number;
  city: string | null;
  country: string;
  owner_name: string | null;
  owner_phone: string | null;
  photo_url: string | null;
  status: string;
  agency_id: string | null;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ApartmentInsert = Omit<Apartment, 'id' | 'created_at' | 'updated_at'>;
export type ApartmentUpdate = Partial<ApartmentInsert>;