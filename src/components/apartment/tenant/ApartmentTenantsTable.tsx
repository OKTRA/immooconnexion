import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Receipt, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApartmentTenantDisplay } from "@/types/apartment";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ApartmentTenantsTableProps {
  apartmentId: string;
  onEdit: (tenant: ApartmentTenantDisplay) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ApartmentTenantsTable({
  apartmentId,
  onEdit,
  onDelete,
}: ApartmentTenantsTableProps) {
  const navigate = useNavigate();
  
  const { data: tenantsList = [] } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      
      if (!profile.user) {
        throw new Error("Non authentifié");
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single();

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée");
      }

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_units!apartment_tenants_unit_id_fkey (
            unit_number,
            apartment:apartments!inner (
              name
            )
          )
        `)
        .eq("agency_id", userProfile.agency_id);

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Appartement</TableHead>
          <TableHead>Unité</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenantsList.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>{tenant.last_name}</TableCell>
            <TableCell>{tenant.first_name}</TableCell>
            <TableCell>{tenant.email || "-"}</TableCell>
            <TableCell>{tenant.phone_number || "-"}</TableCell>
            <TableCell>{tenant.apartment_unit?.apartment?.name || "-"}</TableCell>
            <TableCell>{tenant.apartment_unit?.unit_number || "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(tenant)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/agence/appartements/locataires/${tenant.id}/recu`)}
                >
                  <Receipt className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/agence/appartements/locataires/${tenant.id}/paiements`)}
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(tenant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}