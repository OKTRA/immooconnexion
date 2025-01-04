import { SidebarProvider } from "@/components/ui/sidebar"
import { AgencySidebar } from "@/components/agency/AgencySidebar"
import { AdminLayout } from "@/components/admin/layout/AdminLayout"
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react"

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AgencySidebar />
        <main className="flex-1">
          <AdminLayout>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Tableau de bord</h1>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Locataires actifs</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">24</p>
                </div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Biens gérés</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">12</p>
                </div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Revenus mensuels</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">15 000€</p>
                </div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Taux d'occupation</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">92%</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nouveau contrat signé</p>
                        <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Paiement reçu</p>
                        <p className="text-sm text-muted-foreground">Il y a 5 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nouvelle demande de visite</p>
                        <p className="text-sm text-muted-foreground">Il y a 1 jour</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Tâches en attente</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">État des lieux à planifier</p>
                        <p className="text-sm text-muted-foreground">Pour le 15/04/2024</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Renouvellement de bail</p>
                        <p className="text-sm text-muted-foreground">Pour le 20/04/2024</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Visite technique</p>
                        <p className="text-sm text-muted-foreground">Pour le 25/04/2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AdminLayout>
        </main>
      </div>
    </SidebarProvider>
  )
}