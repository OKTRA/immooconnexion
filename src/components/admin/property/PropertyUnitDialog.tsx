import { useEffect, useState } from "react";
import { usePropertyUnits } from "@/hooks/use-property-units";
import { PropertyUnit, PropertyUnitStatus } from "./types/propertyUnit";
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
  const [formData, setFormData] = useState({
    unit_number: "",
    floor_number: "",
    area: "",
    rent_amount: "",
    deposit_amount: "",
    description: "",
    status: "available" as PropertyUnitStatus,
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_number: unit.unit_number,
        floor_number: unit.floor_number?.toString() || "",
        area: unit.area?.toString() || "",
        rent_amount: unit.rent_amount.toString(),
        deposit_amount: unit.deposit_amount?.toString() || "",
        description: unit.description || "",
        status: unit.status,
      });
    } else {
      setFormData({
        unit_number: "",
        floor_number: "",
        area: "",
        rent_amount: "",
        deposit_amount: "",
        description: "",
        status: "available",
      });
    }
  }, [unit]);

  const handleSubmit = async () => {
    const processedData = {
      ...formData,
      floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
      area: formData.area ? parseFloat(formData.area) : null,
      rent_amount: parseInt(formData.rent_amount),
      deposit_amount: formData.deposit_amount ? parseInt(formData.deposit_amount) : null,
      property_id: propertyId
    };

    try {
      if (unit) {
        await updateUnit.mutateAsync({ ...processedData, id: unit.id });
      } else {
        await createUnit.mutateAsync(processedData);
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
            <Label htmlFor="rent_amount">Loyer (FCFA)</Label>
            <Input
              id="rent_amount"
              type="number"
              value={formData.rent_amount}
              onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deposit_amount">Caution (FCFA)</Label>
            <Input
              id="deposit_amount"
              type="number"
              value={formData.deposit_amount}
              onChange={(e) =>
                setFormData({ ...formData, deposit_amount: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: ApartmentUnitStatus) =>
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
