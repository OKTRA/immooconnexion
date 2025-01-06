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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Apartment } from "@/types/apartment";

export default function ApartmentDetails() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { units, isLoading: unitsLoading, deleteUnit } = useApartmentUnits(id);

  const { data: apartment, isLoading: apartmentLoading } = useQuery({
    queryKey: ["apartment", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Apartment;
    }
  });

  const handleDelete = async (unitId: string) => {
    await deleteUnit.mutateAsync(unitId);
  };

  if (apartmentLoading || unitsLoading || !apartment) {
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
      <ApartmentHeader 
        apartment={apartment}
        onDelete={() => {/* Implement apartment deletion */}}
      />
      <div className="grid gap-6">
        <ApartmentInfo apartment={apartment} />
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
                onEdit={(unit) => navigate(`/agence/appartements/${id}/unites/${unit.id}`)}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AgencyLayout>
  );
}