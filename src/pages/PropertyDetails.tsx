import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ExpenseDialog } from "@/components/ExpenseDialog"
import { FileText } from "lucide-react"

const PropertyDetails = () => {
  const { id } = useParams()

  const { data: property, isLoading: isLoadingProperty } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      if (error) throw error
      return data
    }
  })

  const { data: contracts, isLoading: isLoadingContracts } = useQuery({
    queryKey: ['contracts', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_history_with_tenant')
        .select('*')
        .eq('property_id', id)
      
      if (error) throw error
      return data
    }
  })

  if (isLoadingProperty || isLoadingContracts) {
    return <div>Chargement...</div>
  }

  if (!property) {
    return <div>Bien non trouvé</div>
  }

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar className="w-64" />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du bien</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Nom du bien</h3>
                    <p>{property?.bien}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Type</h3>
                    <p className="capitalize">{property?.type}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Ville</h3>
                    <p>{property?.ville}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Loyer Mensuel</h3>
                    <p>{property?.loyer?.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Frais Agence</h3>
                    <p>{property?.frais_agence?.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Caution</h3>
                    <p>{property?.caution?.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Statut</h3>
                    <p className="capitalize">{property?.statut}</p>
                  </div>
                </div>
                {property?.photo_url && (
                  <div>
                    <h3 className="font-semibold mb-2">Photo du bien</h3>
                    <img
                      src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
                      alt={property.bien}
                      className="rounded-lg w-full object-cover h-48"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historique des paiements */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Historique des paiements</CardTitle>
                  <ExpenseDialog propertyId={id} propertyRent={property.loyer} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Locataire</th>
                        <th className="p-2 text-left">Montant</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Statut</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts?.map((contract: any) => (
                        <tr key={contract.id} className="border-b">
                          <td className="p-2">{new Date(contract.created_at).toLocaleDateString()}</td>
                          <td className="p-2">
                            {contract.tenant_nom && contract.tenant_prenom 
                              ? `${contract.tenant_prenom} ${contract.tenant_nom}`
                              : 'Non renseigné'
                            }
                          </td>
                          <td className="p-2">{contract.montant?.toLocaleString()} FCFA</td>
                          <td className="p-2 capitalize">{contract.type}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              contract.statut === 'payé' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {contract.statut}
                            </span>
                          </td>
                          <td className="p-2">
                            {contract.tenant_id && (
                              <Link to={`/locataires/${contract.tenant_id}/contrats`}>
                                <Button variant="ghost" size="icon">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                      {(!contracts || contracts.length === 0) && (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">
                            Aucun paiement enregistré
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default PropertyDetails