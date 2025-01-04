import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { PropertyUnitDialog } from "./components/PropertyUnitDialog"
import { PropertyUnit } from "./types/propertyUnit"

interface PropertyUnitsManagerProps {
  propertyId: string
}

export function PropertyUnitsManager({ propertyId }: PropertyUnitsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ["property-units", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_units")
        .select("*")
        .eq("property_id", propertyId)
        .order("unit_number")

      if (error) throw error
      return data as PropertyUnit[]
    },
  })

  const mutation = useMutation({
    mutationFn: async (unit: PropertyUnit) => {
      if (editingUnit) {
        const { error } = await supabase
          .from("property_units")
          .update({
            unit_number: unit.unit_number,
            floor_number: unit.floor_number,
            area: unit.area,
          })
          .eq("id", unit.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("property_units")
          .insert({
            property_id: propertyId,
            unit_number: unit.unit_number,
            floor_number: unit.floor_number,
            area: unit.area,
          })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] })
      setIsDialogOpen(false)
      setEditingUnit(null)
      toast({
        title: editingUnit ? "Unité modifiée" : "Unité ajoutée",
        description: editingUnit
          ? "L'unité a été modifiée avec succès"
          : "L'unité a été ajoutée avec succès",
      })
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue: " + error.message,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("property_units")
        .delete()
        .eq("id", unitId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] })
      toast({
        title: "Unité supprimée",
        description: "L'unité a été supprimée avec succès",
      })
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue: " + error.message,
        variant: "destructive",
      })
    },
  })

  const handleEdit = (unit: PropertyUnit) => {
    setEditingUnit(unit)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return <div>Chargement des unités...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Unités de la propriété</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une unité
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro d'unité</TableHead>
              <TableHead>Étage</TableHead>
              <TableHead>Surface (m²)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.unit_number}</TableCell>
                <TableCell>{unit.floor_number || "-"}</TableCell>
                <TableCell>{unit.area || "-"}</TableCell>
                <TableCell>{unit.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(unit)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(unit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {units.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Aucune unité trouvée pour cette propriété
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PropertyUnitDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingUnit(null)
        }}
        editingUnit={editingUnit}
        propertyId={propertyId}
        onSubmit={(data) => mutation.mutate(data)}
      />
    </div>
  )
}