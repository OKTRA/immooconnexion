export interface PropertyUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number: number | null;
  area: number | null;
  status: string;
  rent: number | null;
  deposit: number | null;
  photo_url: string | null;
  description: string | null;
  category: string | null;
  amenities: string[] | null;
}

export interface PropertyUnitFormData {
  unit_number: string;
  floor_number: string;
  area: string;
  rent: string;
  deposit: string;
  description: string;
  category: string;
  amenities: string[];
}

export interface PropertyUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingUnit: PropertyUnit | null;
  propertyId: string;
  onSubmit: (data: PropertyUnit) => void;
}

export interface PropertyUnitsManagerProps {
  propertyId: string;
  filterStatus?: 'available' | 'occupied';
}