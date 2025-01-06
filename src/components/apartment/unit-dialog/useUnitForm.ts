import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApartmentUnitFormData, ApartmentUnit } from "../types";

const unitSchema = z.object({
  unit_number: z.string().min(1, "Le numéro d'unité est requis"),
  floor_number: z.number().min(0, "L'étage doit être un nombre positif"),
  area: z.number().min(1, "La surface doit être supérieure à 0"),
  rent_amount: z.number().min(1, "Le loyer doit être supérieur à 0"),
  deposit_amount: z.number().min(0, "La caution doit être un nombre positif"),
  status: z.enum(["available", "occupied", "maintenance"]),
  description: z.string().optional(),
});

export function useUnitForm(initialData?: ApartmentUnit) {
  const form = useForm<ApartmentUnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: initialData || {
      unit_number: "",
      floor_number: 0,
      area: 0,
      rent_amount: 0,
      deposit_amount: 0,
      status: "available",
      description: "",
    },
  });

  return form;
}