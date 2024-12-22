import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function AdminProperties() {
  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de création</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>{property.bien}</TableCell>
              <TableCell>{property.type}</TableCell>
              <TableCell>{property.ville || "-"}</TableCell>
              <TableCell>
                {property.loyer
                  ? new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XOF",
                    }).format(property.loyer)
                  : "-"}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    property.statut === "disponible"
                      ? "bg-green-50 text-green-700"
                      : property.statut === "occupé"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {property.statut || "Non défini"}
                </span>
              </TableCell>
              <TableCell>
                {format(new Date(property.created_at), "Pp", { locale: fr })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}