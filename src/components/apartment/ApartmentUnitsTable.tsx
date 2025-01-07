import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash } from "lucide-react"
import { ApartmentUnit } from "@/types/apartment"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface ApartmentUnitsTableProps {
  units?: ApartmentUnit[]
  onEdit: (unit: ApartmentUnit) => void
  onDelete: (unitId: string) => void
  isLoading?: boolean
}

export function ApartmentUnitsTable({ 
  units = [], 
  onEdit, 
  onDelete,
  isLoading 
}: ApartmentUnitsTableProps) {
  const [unitToDelete, setUnitToDelete] = useState<ApartmentUnit | null>(null)
  const navigate = useNavigate()

  const getStatusBadge = (status: ApartmentUnit['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Disponible</Badge>
      case 'occupied':
        return <Badge>Occupé</Badge>
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDelete = () => {
    if (unitToDelete) {
      onDelete(unitToDelete.id)
      setUnitToDelete(null)
    }
  }

  const handleViewDetails = (unitId: string) => {
    navigate(`/agence/unite/${unitId}`)
  }

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Unité</TableHead>
            <TableHead>Étage</TableHead>
            <TableHead>Surface (m²)</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Caution</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Unité</TableHead>
            <TableHead>Étage</TableHead>
            <TableHead>Surface (m²)</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Caution</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Aucune unité trouvée
              </TableCell>
            </TableRow>
          ) : (
            units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.unit_number}</TableCell>
                <TableCell>{unit.floor_number || "-"}</TableCell>
                <TableCell>{unit.area || "-"}</TableCell>
                <TableCell>{unit.rent_amount.toLocaleString()} FCFA</TableCell>
                <TableCell>{unit.deposit_amount?.toLocaleString() || "-"} FCFA</TableCell>
                <TableCell>{getStatusBadge(unit.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(unit.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUnitToDelete(unit)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!unitToDelete} onOpenChange={() => setUnitToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'unité {unitToDelete?.unit_number}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}