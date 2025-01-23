import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ApartmentUnit } from "@/types/apartment"

interface SimpleUnitSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

// Composant désactivé car nous séparons l'ajout de locataire de l'attribution d'unité
export function SimpleUnitSelector({ value, onValueChange }: SimpleUnitSelectorProps) {
  return null;
}