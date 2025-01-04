export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  floor_number: number | null;
  area: number | null;
  status: string;
}

export interface PropertyUnitFormData {
  unit_number: string;
  floor_number: string;
  area: string;
}

export interface PropertyUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingUnit: PropertyUnit | null;
  propertyId: string;
  onSubmit: (data: PropertyUnit) => void;
}