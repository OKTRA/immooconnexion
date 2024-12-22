import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Phone, MessageSquare, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Tenant {
  id: string;
  nom: string | null;
  prenom: string | null;
  birth_date: string | null;
  phone_number: string | null;
  photo_id_url: string | null;
  agency_fees: number | null;
}

interface TenantDisplay {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  photoIdUrl?: string;
}

export function TenantsTable({ onEdit }: { onEdit: (tenant: TenantDisplay) => void }) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: tenants = [], refetch } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      console.log('Fetching tenants...');
      
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*');
      
      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        throw tenantsError;
      }
      
      console.log('Tenants data:', tenantsData);

      return (tenantsData as Tenant[]).map(tenant => ({
        id: tenant.id,
        nom: tenant.nom || '',
        prenom: tenant.prenom || '',
        dateNaissance: tenant.birth_date || '',
        telephone: tenant.phone_number || '',
        photoIdUrl: tenant.photo_id_url,
      }));
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

  const handleViewContracts = (tenantId: string) => {
    navigate(`/locataires/${tenantId}/contrats`);
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
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.nom || 'Non renseigné'}</TableCell>
                <TableCell>{tenant.prenom || 'Non renseigné'}</TableCell>
                <TableCell>{tenant.dateNaissance || 'Non renseigné'}</TableCell>
                <TableCell>{tenant.telephone || 'Non renseigné'}</TableCell>
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
                    variant="outline"
                    size="icon"
                    onClick={() => handleViewContracts(tenant.id)}
                  >
                    <FileText className="h-4 w-4" />
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