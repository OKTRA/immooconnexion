import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AgencyLayout } from "@/components/agency/AgencyLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApartmentUnitsTable } from "@/components/apartment/ApartmentUnitsTable";
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader";
import { ApartmentInfo } from "@/components/apartment/ApartmentInfo";
import { useApartmentUnits } from "@/hooks/use-apartment-units";
import { useToast } from "@/hooks/use-toast";

export default function ApartmentDetails() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { units, isLoading, deleteUnit } = useApartmentUnits(id);

  const handleDelete = async (unitId: string) => {
    try {
      await deleteUnit.mutateAsync(unitId);
      toast({
        title: "Unité supprimée",
        description: "L'unité a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (unitId: string) => {
    navigate(`/agence/appartements/${id}/unites/${unitId}`);
  };

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mb-4" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout>
      <ApartmentHeader />
      <div className="grid gap-6">
        <ApartmentInfo />
        <Separator />
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Unités</h2>
            <Button onClick={() => navigate(`/agence/appartements/${id}/unites/nouveau`)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle unité
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <ApartmentUnitsTable
                units={units}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AgencyLayout>
  );
}