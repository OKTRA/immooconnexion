import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ApartmentUnit } from "@/types/apartment";
import { Badge } from "@/components/ui/badge";

interface ApartmentUnitsTableProps {
  units: ApartmentUnit[];
  onEdit: (unit: ApartmentUnit) => void;
  onDelete: (unitId: string) => void;
}

export function ApartmentUnitsTable({ units, onEdit, onDelete }: ApartmentUnitsTableProps) {
  const getStatusBadge = (status: ApartmentUnit['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Disponible</Badge>;
      case 'occupied':
        return <Badge>Occupé</Badge>;
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Unité</TableHead>
          <TableHead>Étage</TableHead>
          <TableHead>Surface (m²)</TableHead>
          <TableHead>Loyer</TableHead>
          <TableHead>Caution</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              Aucune unité trouvée
            </TableCell>
          </TableRow>
        ) : (
          units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>{unit.unit_number}</TableCell>
              <TableCell>{unit.floor_number || "-"}</TableCell>
              <TableCell>{unit.area || "-"}</TableCell>
              <TableCell>{unit.rent_amount.toLocaleString()} FCFA</TableCell>
              <TableCell>{unit.deposit_amount?.toLocaleString() || "-"} FCFA</TableCell>
              <TableCell>{getStatusBadge(unit.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(unit)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(unit.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}