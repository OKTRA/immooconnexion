import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ApartmentActions } from "./ApartmentActions"
import { useState } from "react"
import { DeleteApartmentDialog } from "./DeleteApartmentDialog"
import { ApartmentDialog } from "@/components/property/ApartmentDialog"
import { Building } from "lucide-react"

interface ApartmentContentProps {
  apartments: any[];
}

export function ApartmentContent({ apartments }: ApartmentContentProps) {
  const [editingApartment, setEditingApartment] = useState<any>(null)
  const [deletingApartment, setDeletingApartment] = useState<any>(null)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Building className="h-5 w-5" />
          Gestion des appartements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Unités</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apartments.map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell className="font-medium">{apartment.name}</TableCell>
                  <TableCell>{apartment.city}</TableCell>
                  <TableCell>{apartment.country}</TableCell>
                  <TableCell>{apartment.owner_name}</TableCell>
                  <TableCell>{apartment.owner_phone}</TableCell>
                  <TableCell>{apartment.total_units}</TableCell>
                  <TableCell>{apartment.status}</TableCell>
                  <TableCell>
                    <ApartmentActions
                      apartmentId={apartment.id}
                      onEdit={() => setEditingApartment(apartment)}
                      onDelete={() => setDeletingApartment(apartment)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {apartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Aucun appartement trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ApartmentDialog
          open={!!editingApartment}
          onOpenChange={() => setEditingApartment(null)}
          apartment={editingApartment}
        />

        <DeleteApartmentDialog
          open={!!deletingApartment}
          onOpenChange={() => setDeletingApartment(null)}
          selectedProperty={deletingApartment}
          onDelete={() => setDeletingApartment(null)}
        />
      </CardContent>
    </Card>
  )
}