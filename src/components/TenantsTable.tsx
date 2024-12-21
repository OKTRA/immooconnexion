import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Tenant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

const initialTenants: Tenant[] = [
  {
    id: "1",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    telephone: "0123456789",
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Marie",
    email: "marie.martin@email.com",
    telephone: "0987654321",
  },
];

export function TenantsTable({ onEdit }: { onEdit: (tenant: Tenant) => void }) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setTenants(tenants.filter((tenant) => tenant.id !== id));
    toast({
      title: "Locataire supprimé",
      description: "Le locataire a été supprimé avec succès.",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
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
  );
}