import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Link } from "react-router-dom"

interface ApartmentTenantsTableProps {
  apartmentId: string
}

export function ApartmentTenantsTable({ apartmentId }: ApartmentTenantsTableProps) {
  const { data: tenants = [], error } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      let query = supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_leases (
            id,
            status,
            rent_amount,
            deposit_amount
          )
        `)
        .order('created_at', { ascending: false })

      // Only add the apartment_id filter if we're not looking for all tenants
      if (apartmentId !== "all") {
        query = query.eq("apartment_id", apartmentId)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
    enabled: !!apartmentId
  })

  if (error) {
    console.error("Error fetching tenants:", error)
    return <div>Error loading tenants</div>
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left">Nom</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-left">Profession</th>
            <th className="p-4 text-left">Statut</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="border-b">
              <td className="p-4">
                {tenant.first_name} {tenant.last_name}
              </td>
              <td className="p-4">
                <div className="space-y-1">
                  <div>{tenant.phone_number}</div>
                  <div className="text-sm text-muted-foreground">{tenant.email}</div>
                </div>
              </td>
              <td className="p-4">{tenant.profession || '-'}</td>
              <td className="p-4">
                <Badge variant={tenant.apartment_leases?.[0]?.status === 'active' ? 'default' : 'secondary'}>
                  {tenant.apartment_leases?.[0]?.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/agence/apartments/tenants/${tenant.id}`}>
                      Voir détails
                    </Link>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {(!tenants || tenants.length === 0) && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-muted-foreground">
                Aucun locataire enregistré
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}