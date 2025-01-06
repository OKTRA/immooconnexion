import { useState } from "react";
import { usePropertyUnits } from "@/hooks/use-property-units";
import { PropertyUnit } from "./types/propertyUnit";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PropertyUnitDialog } from "./PropertyUnitDialog";

interface PropertyUnitsManagerProps {
  propertyId: string;
}

export function PropertyUnitsManager({ propertyId }: PropertyUnitsManagerProps) {
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { units, isLoading, deleteUnit } = usePropertyUnits(propertyId);

  const handleDelete = async () => {
    if (!selectedUnit) return;
    
    try {
      await deleteUnit.mutateAsync(selectedUnit.id);
      setIsDeleteDialogOpen(false);
      setSelectedUnit(null);
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Unités de l'appartement</h2>
        <Button
          onClick={() => {
            setSelectedUnit(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une unité
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Étage</TableHead>
              <TableHead>Surface</TableHead>
              <TableHead>Loyer</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.unit_number}</TableCell>
                <TableCell>{unit.floor_number || "-"}</TableCell>
                <TableCell>{unit.area ? `${unit.area} m²` : "-"}</TableCell>
                <TableCell>
                  {unit.rent ? `${unit.rent.toLocaleString()} FCFA` : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      unit.status === "available"
                        ? "bg-green-50 text-green-700"
                        : unit.status === "occupied"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {unit.status === "available"
                      ? "Disponible"
                      : unit.status === "occupied"
                      ? "Occupé"
                      : "Maintenance"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedUnit(unit);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedUnit(unit);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {units.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucune unité trouvée pour cet appartement
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PropertyUnitDialog
        propertyId={propertyId}
        unit={selectedUnit}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette unité ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}