import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TenantTableRow } from "./tenants/TenantTableRow";

interface TenantDisplay {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  photoIdUrl?: string;
  fraisAgence?: string;
}

export function TenantsTable({ onEdit }: { onEdit: (tenant: TenantDisplay) => void }) {
  const { toast } = useToast();

  const { data: tenants = [], refetch } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      console.log('Fetching tenants...');
      
      // Récupérer d'abord les profils qui sont des locataires
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_tenant', true);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles data:', profilesData);

      if (!profilesData || profilesData.length === 0) {
        return [];
      }

      // Récupérer les informations des locataires
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .in('id', profilesData.map(profile => profile.id));
      
      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        throw tenantsError;
      }
      
      console.log('Tenants data:', tenantsData);

      return tenantsData.map((tenant: any) => ({
        id: tenant.id,
        nom: tenant.nom || '',
        prenom: tenant.prenom || '',
        dateNaissance: tenant.birth_date || '',
        telephone: tenant.phone_number || '',
        photoIdUrl: tenant.photo_id_url,
        fraisAgence: tenant.agency_fees?.toString(),
      }));
    }
  });

  const handleDelete = async (id: string) => {
    try {
      // Supprimer d'abord le profil (cela déclenchera la suppression en cascade)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_tenant: false })
        .eq('id', id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // Supprimer ensuite les données du locataire
      const { error: tenantError } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (tenantError) {
        console.error('Error deleting tenant:', tenantError);
        throw tenantError;
      }

      refetch();
      toast({
        title: "Locataire supprimé",
        description: "Le locataire a été supprimé avec succès.",
      });
    } catch (error: any) {
      console.error('Error in handleDelete:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Date de Naissance</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TenantTableRow
                key={tenant.id}
                tenant={tenant}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}