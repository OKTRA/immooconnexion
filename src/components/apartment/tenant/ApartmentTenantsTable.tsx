import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ApartmentTenant } from "@/types/apartment";

interface ApartmentTenantsTableProps {
  onEdit: (tenant: ApartmentTenant) => void;
  onDelete: (id: string) => void;
}

export function ApartmentTenantsTable({ onEdit, onDelete }: ApartmentTenantsTableProps) {
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      console.log("Fetching tenants...");
      const { data, error } = await supabase
        .from("apartment_tenants")
        .select(`
          *,
          tenant_units (
            unit_id,
            status
          ),
          apartment_leases (
            id,
            unit_id,
            status
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tenants:", error);
        throw error;
      }

      console.log("Fetched tenants:", data);
      return data as ApartmentTenant[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      // First update any active tenant_units to inactive
      const { error: unitError } = await supabase
        .from("tenant_units")
        .update({ status: "inactive" })
        .eq("tenant_id", id)
        .eq("status", "active");

      if (unitError) throw unitError;

      // Then delete the tenant
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting tenant:", error);
      throw error;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Date de naissance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Aucun locataire trouvé
            </TableCell>
          </TableRow>
        ) : (
          tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.last_name}</TableCell>
              <TableCell>{tenant.first_name}</TableCell>
              <TableCell>{tenant.email || "-"}</TableCell>
              <TableCell>{tenant.phone_number || "-"}</TableCell>
              <TableCell>
                {tenant.birth_date
                  ? format(new Date(tenant.birth_date), "PP", { locale: fr })
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
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
                    onClick={() => handleDelete(tenant.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}