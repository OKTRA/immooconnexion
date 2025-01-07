import { useQuery } from "@tanstack/react-query"
import { Plus, Building } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApartmentForm } from "@/components/apartment/ApartmentForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { ApartmentUnitsSection } from "@/components/apartment/ApartmentUnitsSection"
import { useApartmentUnits } from "@/hooks/use-apartment-units"
import { ApartmentCard } from "@/components/apartment/ApartmentCard"

export default function Apartments() {
  const { toast } = useToast()
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null)
  const [showUnitsDialog, setShowUnitsDialog] = useState(false)

  const { data: apartments, isLoading } = useQuery({
    queryKey: ["apartments"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data: apartmentsData, error: apartmentsError } = await supabase
        .from("apartments")
        .select("*")
        .eq("agency_id", userProfile.agency_id)
        .order("created_at", { ascending: false })

      if (apartmentsError) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les appartements",
          variant: "destructive",
        })
        throw apartmentsError
      }

      const apartmentsWithUnits = await Promise.all(
        apartmentsData.map(async (apartment) => {
          const { count } = await supabase
            .from("apartment_units")
            .select("*", { count: "exact", head: true })
            .eq("apartment_id", apartment.id)

          return {
            ...apartment,
            unit_count: count || 0
          }
        })
      )

      return apartmentsWithUnits
    },
  })

  const { 
    data: units = [], 
    isLoading: unitsLoading,
    createUnit,
    updateUnit,
    deleteUnit
  } = useApartmentUnits(selectedApartmentId || undefined)

  const handleViewUnits = (apartmentId: string) => {
    setSelectedApartmentId(apartmentId)
    setShowUnitsDialog(true)
  }

  return (
    <AgencyLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appartements</h1>
          <p className="text-muted-foreground">
            Gérez vos immeubles et leurs unités
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Appartement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un appartement</DialogTitle>
            </DialogHeader>
            <ApartmentForm />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-[100px] bg-muted" />
              <CardContent className="h-[100px] bg-muted mt-2" />
            </Card>
          ))}
        </div>
      ) : apartments?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <Building className="w-12 h-12 mb-4 text-muted-foreground" />
          <CardTitle className="mb-2">Aucun appartement</CardTitle>
          <CardDescription>
            Vous n'avez pas encore ajouté d'appartement.
            Commencez par en créer un !
          </CardDescription>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Appartement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un appartement</DialogTitle>
              </DialogHeader>
              <ApartmentForm />
            </DialogContent>
          </Dialog>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apartments?.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onViewUnits={handleViewUnits}
              />
            ))}
          </div>

          <Dialog open={showUnitsDialog} onOpenChange={setShowUnitsDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gestion des Unités</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="units" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="units">Unités</TabsTrigger>
                  <TabsTrigger value="payments">Paiements</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                </TabsList>
                <TabsContent value="units">
                  {selectedApartmentId && (
                    <ApartmentUnitsSection
                      apartmentId={selectedApartmentId}
                      units={units}
                      isLoading={unitsLoading}
                      onCreateUnit={async (data) => {
                        await createUnit.mutateAsync(data)
                      }}
                      onUpdateUnit={async (data) => {
                        await updateUnit.mutateAsync(data)
                      }}
                      onDeleteUnit={async (unitId) => {
                        await deleteUnit.mutateAsync(unitId)
                      }}
                      onEdit={() => {}}
                    />
                  )}
                </TabsContent>
                <TabsContent value="payments">
                  <div className="p-4 text-center text-muted-foreground">
                    Fonctionnalité à venir
                  </div>
                </TabsContent>
                <TabsContent value="maintenance">
                  <div className="p-4 text-center text-muted-foreground">
                    Fonctionnalité à venir
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AgencyLayout>
  )
}