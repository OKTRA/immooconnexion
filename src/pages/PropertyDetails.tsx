import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "react-router-dom"

const PropertyDetails = () => {
  const { id } = useParams()

  // Simuler les données du bien
  const property = {
    id: 1,
    nom: "Appartement Jaune Block 1",
    adresse: "Kati",
    loyer: "60000",
    fraisAgence: "10000",
    caution: "120000",
    photo: "/lovable-uploads/cfd536c2-5c73-4d0b-9529-0e4269ed3372.png",
  }

  // Simuler les contrats liés
  const contracts = [
    {
      dateDebut: "7/15/2024",
      dateFin: "7/31/2024",
      maisonId: "Appartement Jaune Block 1",
      locataireId: "IBRAHIM",
      statut: "Payé",
    },
    {
      dateDebut: "8/1/2024",
      dateFin: "8/31/2024",
      maisonId: "Appartement Jaune Block 1",
      locataireId: "IBRAHIM",
      statut: "Payé",
    },
  ]

  // Simuler les paiements connexes
  const payments = [
    {
      datePaiement: "7/30/2024",
      montant: "30000",
      retard: "NON",
    },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="grid gap-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du bien</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Adresse</h3>
                    <p>{property.adresse}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Loyer Mensuel</h3>
                    <p>{property.loyer} FCFA</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Frais Agence</h3>
                    <p>{property.fraisAgence} FCFA</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Caution</h3>
                    <p>{property.caution} FCFA</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Photo Maison</h3>
                  <img
                    src={property.photo}
                    alt={property.nom}
                    className="rounded-lg w-full max-w-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contrats liés */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Contrats liés (3)</CardTitle>
                  <Button variant="outline">Ajouter</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Date Début</th>
                        <th className="p-2 text-left">Date Fin</th>
                        <th className="p-2 text-left">Maison Id</th>
                        <th className="p-2 text-left">Locataire Id</th>
                        <th className="p-2 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{contract.dateDebut}</td>
                          <td className="p-2">{contract.dateFin}</td>
                          <td className="p-2">{contract.maisonId}</td>
                          <td className="p-2">{contract.locataireId}</td>
                          <td className="p-2">{contract.statut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Paiements connexes */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Paiements connexes (1)</CardTitle>
                  <Button variant="outline">Ajouter</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Date Paiement</th>
                        <th className="p-2 text-left">Montant</th>
                        <th className="p-2 text-left">Retard</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{payment.datePaiement}</td>
                          <td className="p-2">{payment.montant} FCFA</td>
                          <td className="p-2">{payment.retard}</td>
                        </tr>
                      ))}
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