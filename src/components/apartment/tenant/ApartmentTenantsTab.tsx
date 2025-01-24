import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ApartmentTenant } from "@/types/apartment";
import { Loader2 } from "lucide-react";
import { ApartmentTenantsTable } from "./ApartmentTenantsTable";
import { useToast } from "@/hooks/use-toast";

export interface ApartmentTenantsTabProps {
  onDeleteTenant: (id: string) => Promise<void>;
  onEditTenant: (tenant: ApartmentTenant) => void;
  isLoading?: boolean;
}

export function ApartmentTenantsTab({ 
  onDeleteTenant,
  onEditTenant,
  isLoading: externalLoading
}: ApartmentTenantsTabProps) {
  const { toast } = useToast();
  
  const { data: tenants = [], isLoading: queryLoading } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) {
          throw new Error("Non authentifié");
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('agency_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Erreur lors de la vérification du profil:', profileError);
          throw profileError;
        }

        if (!profileData?.agency_id) {
          return [];
        }

        const { data, error } = await supabase
          .from("apartment_tenants")
          .select(`
            *,
            apartment_leases (
              id,
              tenant_id,
              unit_id,
              start_date,
              end_date,
              rent_amount,
              deposit_amount,
              payment_frequency,
              duration_type,
              status,
              payment_type,
              agency_id
            ),
            apartment_units!apartment_tenants_unit_id_fkey (
              unit_number,
              apartment:apartments (
                name
              )
            )
          `)
          .eq('agency_id', profileData.agency_id);

        if (error) {
          console.error('Erreur lors de la récupération des locataires:', error);
          throw error;
        }

        return data as ApartmentTenant[];
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la récupération des locataires",
          variant: "destructive"
        });
        return [];
      }
    },
    retry: false
  });

  const isLoading = externalLoading || queryLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ApartmentTenantsTable
      tenants={tenants}
      onEdit={onEditTenant}
      onDelete={onDeleteTenant}
      isLoading={isLoading}
    />
  );
}