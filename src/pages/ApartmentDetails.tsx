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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: units = [], isLoading: unitsLoading, deleteUnit } = useApartmentUnits(id || "");

  const { data: apartment, isLoading: apartmentLoading } = useQuery({
    queryKey: ["apartment", id],
    queryFn: async () => {
      console.log("Fetching apartment details for ID:", id);
      
      if (!id) throw new Error("No apartment ID provided");

      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching apartment:", error);
        throw error;
      }

      return data as Apartment;
    },
    enabled: !!id
  });

  const handleDelete = async (unitId: string) => {
    await deleteUnit.mutateAsync(unitId);
  };

  if (!id) {
    return <div>ID d'appartement manquant</div>;
  }

  return (
    <AgencyLayout>
      <ApartmentHeader 
        apartment={apartment}
        isLoading={apartmentLoading}
        onDelete={() => {/* Implement apartment deletion */}}
      />
      <div className="grid gap-6">
        {apartment && <ApartmentInfo apartment={apartment} />}
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
                isLoading={unitsLoading}
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