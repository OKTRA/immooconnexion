import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { Agency } from "@/components/admin/agency/types"
import { AgencyForm } from "@/components/admin/agency/AgencyForm"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function AgencySettings() {
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [agency, setAgency] = useState<Agency | null>(null)

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  const { data: agencyData, refetch: refetchAgency } = useQuery({
    queryKey: ['agency', profile?.agency_id],
    queryFn: async () => {
      if (!profile?.agency_id) return null

      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', profile.agency_id)
        .single()

      if (error) throw error
      
      setAgency(data)
      return data
    },
    enabled: !!profile?.agency_id
  })

  const handleAgencySubmit = async (updatedAgency: Agency) => {
    try {
      console.log("Updating agency with data:", updatedAgency)
      
      const { error } = await supabase
        .from('agencies')
        .update({
          name: updatedAgency.name,
          address: updatedAgency.address,
          phone: updatedAgency.phone,
          email: updatedAgency.email,
          show_phone_on_site: updatedAgency.show_phone_on_site,
          list_properties_on_site: updatedAgency.list_properties_on_site,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedAgency.id)

      if (error) throw error

      await refetchAgency()

      toast({
        title: "Succès",
        description: "Les informations de l'agence ont été mises à jour",
      })
    } catch (error) {
      console.error('Error updating agency:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleProfileUpdate = async (profileData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone_number: profileData.phone_number,
          email: profileData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileData.id)

      if (error) throw error

      await refetchProfile()

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre agence et de votre profil.
        </p>
      </div>

      <Tabs defaultValue="agency" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agency" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className={isMobile ? "hidden" : ""}>Agence</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className={isMobile ? "hidden" : ""}>Profil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agency" className="space-y-4">
          {agency && (
            <AgencyForm 
              agency={agency} 
              setAgency={setAgency} 
              onSubmit={handleAgencySubmit}
            />
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          {profile && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleProfileUpdate(profile)
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          value={profile.first_name || ''}
                          onChange={(e) => profile.first_name = e.target.value}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={profile.last_name || ''}
                          onChange={(e) => profile.last_name = e.target.value}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={profile.phone_number || ''}
                        onChange={(e) => profile.phone_number = e.target.value}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => profile.email = e.target.value}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Enregistrer les modifications
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}