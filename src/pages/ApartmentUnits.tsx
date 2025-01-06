import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApartmentUnitDialog } from "@/components/apartment/ApartmentUnitDialog";
import { ApartmentUnitsTable } from "@/components/apartment/ApartmentUnitsTable";
import { AgencyLayout } from "@/components/agency/AgencyLayout";
import { useApartmentUnits } from "@/hooks/use-apartment-units";
import { ApartmentUnit } from "@/components/apartment/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function ApartmentUnits() {
  const { id: apartmentId } = useParams<{ id: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);

  const { units = [], isLoading, deleteUnit } = useApartmentUnits(apartmentId!);

  const handleEdit = (unit: ApartmentUnit) => {
    setSelectedUnit(unit);
    setDialogOpen(true);
  };

  const handleDelete = (unitId: string) => {
    setUnitToDelete(unitId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!unitToDelete) return;
    await deleteUnit.mutateAsync(unitToDelete);
    setDeleteDialogOpen(false);
    setUnitToDelete(null);
  };

  const handleSuccess = () => {
    setSelectedUnit(null);
    setDialogOpen(false);
  };

  return (
    <AgencyLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Unités
          </h1>
          <p className="text-muted-foreground">
            Gérez les unités de votre immeuble
          </p>
        </div>
        <Button onClick={() => {
          setSelectedUnit(null);
          setDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Unité
        </Button>
      </div>

      <ApartmentUnitsTable
        units={units}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ApartmentUnitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        apartmentId={apartmentId!}
        unit={selectedUnit}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'unité sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AgencyLayout>
  );
}