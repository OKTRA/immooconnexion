import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ApartmentUnit } from "./types";

interface ApartmentUnitsTableProps {
  units: ApartmentUnit[];
  onEdit: (unit: ApartmentUnit) => void;
  onDelete: (unitId: string) => void;
}

export function ApartmentUnitsTable({
  units,
  onEdit,
  onDelete,
}: ApartmentUnitsTableProps) {
  const getStatusBadge = (status: ApartmentUnit["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="success">Disponible</Badge>;
      case "occupied":
        return <Badge variant="default">Occupé</Badge>;
      case "maintenance":
        return <Badge variant="warning">En maintenance</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
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
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>{unit.unit_number}</TableCell>
              <TableCell>{unit.floor_number}</TableCell>
              <TableCell>{unit.area}</TableCell>
              <TableCell>{unit.rent_amount}</TableCell>
              <TableCell>{unit.deposit_amount}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}