import { useState } from "react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgencyForm } from "@/components/admin/agency/AgencyForm"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Building2, User, UserCircle } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ProfileForm } from "@/components/admin/profile/ProfileForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const AgencySettings = () => {
  const [profileData, setProfileData] = useState<any>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('*, agencies(*)')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfileData(data)
      return data
    }
  })

  const handleAgencyUpdate = async (updatedAgency: any) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({
          name: updatedAgency.name,
          address: updatedAgency.address,
          phone: updatedAgency.phone,
          email: updatedAgency.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedAgency.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Les informations de l'agence ont été mises à jour",
      })
    } catch (error: any) {
      console.error('Error updating agency:', error)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleProfileUpdate = async () => {
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

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <AgencyLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Paramètres</h1>
        
        <Tabs defaultValue="agency" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agency" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Agence</span>
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Authentification</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Profil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agency">
            {profile?.agencies && (
              <AgencyForm
                agency={profile.agencies}
                setAgency={(agency) => {
                  // Update local state
                  setProfileData({
                    ...profileData,
                    agencies: agency
                  })
                }}
                onSubmit={handleAgencyUpdate}
              />
            )}
          </TabsContent>

          <TabsContent value="auth">
            <ProfileForm
              newProfile={profile}
              isEditing={true}
              onUpdateProfile={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  Prénom
                </Label>
                <Input
                  id="first_name"
                  value={profileData?.first_name || ''}
                  onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="last_name"
                  value={profileData?.last_name || ''}
                  onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={profileData?.email || ''}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  value={profileData?.phone_number || ''}
                  onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleProfileUpdate}>
                Mettre à jour le profil
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}

export default AgencySettings