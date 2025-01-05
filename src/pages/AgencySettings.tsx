import { useState } from "react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Building2, User, UserCircle, UserPlus } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { AgencySettingsTab } from "@/components/admin/agency/AgencySettingsTab"
import { AuthSettingsTab } from "@/components/admin/agency/AuthSettingsTab"
import { ProfileSettingsTab } from "@/components/admin/agency/ProfileSettingsTab"
import { Button } from "@/components/ui/button"
import { AddProfileDialog } from "@/components/admin/profile/AddProfileDialog"

const AgencySettings = () => {
  const [profileData, setProfileData] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
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
              <AgencySettingsTab
                agency={profile.agencies}
                onAgencyUpdate={(agency) => {
                  setProfileData({
                    ...profileData,
                    agencies: agency
                  })
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="auth">
            <AuthSettingsTab
              profile={profile}
              onProfileUpdate={() => {
                // Refresh profile data
                window.location.reload()
              }}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des profils</h2>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            </div>
            
            <ProfileSettingsTab
              profileData={profileData}
              onProfileUpdate={setProfileData}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddProfileDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        agencyId={profile?.agencies?.id}
        onProfileCreated={() => {
          setShowAddDialog(false)
          toast({
            title: "Succès",
            description: "Le profil a été créé avec succès",
          })
        }}
      />
    </AgencyLayout>
  )
}

export default AgencySettings