import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Tenant {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  photoIdUrl?: string;
}

export function TenantsTable({ onEdit }: { onEdit: (tenant: Tenant) => void }) {
  const { toast } = useToast();

  const { data: tenants = [], refetch } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      console.log('Fetching tenants...');
      
      // First get all tenants
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*');
      
      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        throw tenantsError;
      }
      
      console.log('Tenants data:', tenantsData);

      // Then get the profiles for these tenants
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', tenantsData.map(t => t.id));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles data:', profilesData);

      // Combine the data
      return tenantsData.map(tenant => {
        const profile = profilesData.find(p => p.id === tenant.id);
        return {
          id: tenant.id,
          nom: profile?.last_name || '',
          prenom: profile?.first_name || '',
          dateNaissance: tenant.birth_date || '',
          email: profile?.email || '',
          telephone: tenant.phone_number || '',
          photoIdUrl: tenant.photo_id_url,
        };
      });
    }
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
      return;
    }

    refetch();
    toast({
      title: "Locataire supprimé",
      description: "Le locataire a été supprimé avec succès.",
    });
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
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.nom}</TableCell>
                <TableCell>{tenant.prenom}</TableCell>
                <TableCell>{tenant.dateNaissance}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.telephone}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(tenant)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.location.href = `tel:${tenant.telephone}`}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.location.href = `sms:${tenant.telephone}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(tenant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}