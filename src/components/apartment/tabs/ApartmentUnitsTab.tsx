import { ApartmentUnit } from "@/types/apartment";

export interface ApartmentUnitsTabProps {
  apartmentId: string;
  units: ApartmentUnit[];
  isLoading: boolean;
  onCreateUnit: (data: ApartmentUnit) => Promise<void>;
  onUpdateUnit: (data: ApartmentUnit) => Promise<void>;
  onDeleteUnit: (unitId: string) => Promise<void>;
}

export function ApartmentUnitsTab({
  apartmentId,
  units,
  isLoading,
  onCreateUnit,
  onUpdateUnit,
  onDeleteUnit
}: ApartmentUnitsTabProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Unités de l'appartement</h2>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {units.map(unit => (
            <li key={unit.id}>
              <div>
                <span>Unité: {unit.unit_number}</span>
                <button onClick={() => onUpdateUnit(unit)}>Modifier</button>
                <button onClick={() => onDeleteUnit(unit.id)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => onCreateUnit({ id: '', unit_number: '', floor_number: null, area: null, rent_amount: 0, deposit_amount: null, status: 'available', description: '', created_at: '', updated_at: '' })}>
        Ajouter une unité
      </button>
    </div>
  );
}
