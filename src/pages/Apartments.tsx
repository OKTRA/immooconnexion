import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Building, Plus } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApartmentForm } from "@/components/apartment/ApartmentForm"

export default function Apartments() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: apartments, isLoading } = useQuery({
    queryKey: ["apartments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartments")
        .select(`
          *,
          apartment_units (
            count
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les appartements",
          variant: "destructive",
        })
        throw error
      }

      return data
    },
  })

  const handleViewDetails = (apartmentId: string) => {
    console.log("Navigating to apartment details with ID:", apartmentId)
    navigate(`/agence/appartements/${apartmentId}`)
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {apartments?.map((apartment) => (
            <Card 
              key={apartment.id}
              className="cursor-pointer transition-all hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>{apartment.name}</CardTitle>
                <CardDescription>{apartment.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {apartment.apartment_units[0].count} unités
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(apartment.id)}
                  >
                    Voir les détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AgencyLayout>
  )
}