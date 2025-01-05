import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Building, Loader2, Plus } from "lucide-react"
import { ApartmentDialog } from "@/components/property/ApartmentDialog"
import { useState } from "react"
import { ApartmentContent } from "@/components/apartment/ApartmentContent"
import { useToast } from "@/components/ui/use-toast"

export default function ApartmentManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const { data: apartments, isLoading, error } = useQuery({
    queryKey: ['apartments'],
    queryFn: async () => {
      console.log('Fetching apartment properties...')
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error('Non authentifié')
      }

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('agency_id, role')
        .eq('id', profile.user.id)
        .single()

      console.log('User profile:', userProfile)

      if (!userProfile?.agency_id) {
        throw new Error('Aucune agence associée')
      }

      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('agency_id', userProfile.agency_id)
        .order('created_at', { ascending: false })

      if (error) throw error

      console.log('Fetched apartments:', data)
      return data
    }
  })

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  if (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de charger les appartements"
    })
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center min-h-screen text-red-500">
          Une erreur est survenue lors du chargement des appartements
        </div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Gestion des appartements
              </div>
            </CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un appartement
            </Button>
          </CardHeader>
          <CardContent>
            <ApartmentContent apartments={apartments || []} />
          </CardContent>
        </Card>

        <ApartmentDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen}
        />
      </div>
    </AgencyLayout>
  )
}