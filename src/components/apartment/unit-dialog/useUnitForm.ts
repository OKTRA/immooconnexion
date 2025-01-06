import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApartmentUnitFormData, ApartmentUnit } from "../types";

const unitSchema = z.object({
  unit_number: z.string().min(1, "Le numéro d'unité est requis"),
  floor_number: z.string(),
  area: z.string(),
  rent_amount: z.string().min(1, "Le loyer est requis"),
  deposit_amount: z.string(),
  status: z.enum(["available", "occupied", "maintenance"]),
  description: z.string().optional(),
});

export function useUnitForm(initialData?: ApartmentUnit) {
  const defaultValues: ApartmentUnitFormData = initialData ? {
    unit_number: initialData.unit_number,
    floor_number: initialData.floor_number?.toString() || "",
    area: initialData.area?.toString() || "",
    rent_amount: initialData.rent_amount.toString(),
    deposit_amount: initialData.deposit_amount?.toString() || "",
    status: initialData.status,
    description: initialData.description || "",
  } : {
    unit_number: "",
    floor_number: "",
    area: "",
    rent_amount: "",
    deposit_amount: "",
    status: "available",
    description: "",
  };

  const form = useForm<ApartmentUnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues,
  });

  return form;
}