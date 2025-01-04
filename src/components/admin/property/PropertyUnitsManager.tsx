import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface PropertyUnit {
  id: string
  property_id: string
  unit_number: string
  floor_number: number | null
  area: number | null
  status: string
}

interface PropertyUnitsManagerProps {
  propertyId: string
}

export function PropertyUnitsManager({ propertyId }: PropertyUnitsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null)
  const [formData, setFormData] = useState({
    unit_number: "",
    floor_number: "",
    area: "",
  })
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
    mutationFn: async (data: Partial<PropertyUnit>) => {
      if (editingUnit) {
        const { error } = await supabase
          .from("property_units")
          .update(data)
          .eq("id", editingUnit.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("property_units")
          .insert([{ ...data, property_id: propertyId }])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-units"] })
      setIsDialogOpen(false)
      setEditingUnit(null)
      setFormData({ unit_number: "", floor_number: "", area: "" })
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      unit_number: formData.unit_number,
      floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
      area: formData.area ? parseFloat(formData.area) : null,
    })
  }

  const handleEdit = (unit: PropertyUnit) => {
    setEditingUnit(unit)
    setFormData({
      unit_number: unit.unit_number,
      floor_number: unit.floor_number?.toString() || "",
      area: unit.area?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return <div>Chargement des unités...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Unités de la propriété</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une unité
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? "Modifier l'unité" : "Ajouter une unité"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unit_number">Numéro d'unité</Label>
                <Input
                  id="unit_number"
                  value={formData.unit_number}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor_number">Étage</Label>
                <Input
                  id="floor_number"
                  type="number"
                  value={formData.floor_number}
                  onChange={(e) =>
                    setFormData({ ...formData, floor_number: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Surface (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingUnit ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
    </div>
  )
}