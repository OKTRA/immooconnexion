import { useEffect, useState } from "react";
import { usePropertyUnits } from "@/hooks/use-property-units";
import { PropertyUnit, PropertyUnitFormData } from "./types/propertyUnit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PropertyUnitDialogProps {
  propertyId: string;
  unit?: PropertyUnit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyUnitDialog({
  propertyId,
  unit,
  open,
  onOpenChange,
}: PropertyUnitDialogProps) {
  const { createUnit, updateUnit } = usePropertyUnits(propertyId);
  const [formData, setFormData] = useState<PropertyUnitFormData>({
    unit_number: "",
    floor_number: "",
    area: "",
    rent: "",
    deposit: "",
    description: "",
    category: "",
    amenities: [],
    status: "available",
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_number: unit.unit_number,
        floor_number: unit.floor_number?.toString() || "",
        area: unit.area?.toString() || "",
        rent: unit.rent?.toString() || "",
        deposit: unit.deposit?.toString() || "",
        description: unit.description || "",
        category: unit.category || "",
        amenities: unit.amenities || [],
        status: unit.status,
      });
    } else {
      setFormData({
        unit_number: "",
        floor_number: "",
        area: "",
        rent: "",
        deposit: "",
        description: "",
        category: "",
        amenities: [],
        status: "available",
      });
    }
  }, [unit]);

  const handleSubmit = async () => {
    const unitData = {
      property_id: propertyId,
      unit_number: formData.unit_number,
      floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
      area: formData.area ? parseFloat(formData.area) : null,
      rent: formData.rent ? parseInt(formData.rent) : null,
      deposit: formData.deposit ? parseInt(formData.deposit) : null,
      description: formData.description,
      category: formData.category,
      amenities: formData.amenities,
      status: formData.status,
    };

    try {
      if (unit) {
        await updateUnit.mutateAsync({ ...unitData, id: unit.id });
      } else {
        await createUnit.mutateAsync(unitData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving unit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {unit ? "Modifier l'unité" : "Ajouter une unité"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="unit_number">Numéro d'unité</Label>
            <Input
              id="unit_number"
              value={formData.unit_number}
              onChange={(e) =>
                setFormData({ ...formData, unit_number: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <Label htmlFor="area">Surface (m²)</Label>
            <Input
              id="area"
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rent">Loyer (FCFA)</Label>
            <Input
              id="rent"
              type="number"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deposit">Caution (FCFA)</Label>
            <Input
              id="deposit"
              type="number"
              value={formData.deposit}
              onChange={(e) =>
                setFormData({ ...formData, deposit: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="occupied">Occupé</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {unit ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}