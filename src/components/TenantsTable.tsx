import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Phone, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Contract {
  id: string;
  dateDebut: string;
  dateFin: string;
  maisonId: string;
  maisonNom: string;
  locataireId: string;
}

interface Payment {
  id: string;
  datePaiement: string;
  montant: number;
  retard: boolean;
  contratId: string;
}

interface Tenant {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  photoIdUrl?: string;
  contracts?: Contract[];
  payments?: Payment[];
}

const initialTenants: Tenant[] = [
  {
    id: "1",
    nom: "MAIGA",
    prenom: "Awa",
    dateNaissance: "1983-05-23",
    email: "awa.maiga@email.com",
    telephone: "79020596",
    photoIdUrl: "/path/to/photo.jpg",
    contracts: [
      {
        id: "1",
        dateDebut: "2024-08-01",
        dateFin: "2024-09-30",
        maisonId: "1",
        maisonNom: "Appartement Jaune Block 2",
        locataireId: "1",
      },
      {
        id: "2",
        dateDebut: "2024-10-01",
        dateFin: "2024-10-31",
        maisonId: "1",
        maisonNom: "Appartement Jaune Block 2",
        locataireId: "1",
      },
    ],
    payments: [
      {
        id: "1",
        datePaiement: "2024-09-07",
        montant: 155000,
        retard: false,
        contratId: "1",
      },
    ],
  },
];

export function TenantsTable({ onEdit }: { onEdit: (tenant: Tenant) => void }) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setTenants(tenants.filter((tenant) => tenant.id !== id));
    toast({
      title: "Locataire supprimé",
      description: "Le locataire a été supprimé avec succès.",
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedTenant(expandedTenant === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Détails</TableHead>
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
              <>
                <TableRow key={tenant.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(tenant.id)}
                    >
                      {expandedTenant === tenant.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
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
                {expandedTenant === tenant.id && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="p-4 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Photo d'identité</h3>
                            {tenant.photoIdUrl && (
                              <img
                                src={tenant.photoIdUrl}
                                alt="Photo d'identité"
                                className="max-h-48 object-contain"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Contrats liés</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date Début</TableHead>
                                  <TableHead>Date Fin</TableHead>
                                  <TableHead>Bien</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tenant.contracts?.map((contract) => (
                                  <TableRow key={contract.id}>
                                    <TableCell>{contract.dateDebut}</TableCell>
                                    <TableCell>{contract.dateFin}</TableCell>
                                    <TableCell>{contract.maisonNom}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Paiements connexes</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date Paiement</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Retard</TableHead>
                                <TableHead>Contrat ID</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tenant.payments?.map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell>{payment.datePaiement}</TableCell>
                                  <TableCell>{payment.montant}</TableCell>
                                  <TableCell>
                                    {payment.retard ? "Oui" : "Non"}
                                  </TableCell>
                                  <TableCell>{payment.contratId}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}