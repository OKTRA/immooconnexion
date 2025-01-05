import { useState } from "react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgencyForm } from "@/components/admin/agency/AgencyForm"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProfileForm } from "@/components/admin/profile/ProfileForm"
import { Building2, User } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const AgencySettings = () => {
  const [agency, setAgency] = useState<any>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const { data: profile } = useQuery({
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
      return data
    }
  })

  const handleAgencyUpdate = async (updatedAgency: any) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update(updatedAgency)
        .eq('id', updatedAgency.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Les informations de l'agence ont été mises à jour",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <AgencyLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Paramètres</h1>
        
        <Tabs defaultValue="agency" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agency" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Agence</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Profil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agency">
            {profile?.agencies && (
              <AgencyForm
                agency={profile.agencies}
                setAgency={setAgency}
                onSubmit={handleAgencyUpdate}
              />
            )}
          </TabsContent>

          <TabsContent value="profile">
            <ProfileForm
              profile={profile}
              isEditing={true}
              onSuccess={() => {
                toast({
                  title: "Succès",
                  description: "Votre profil a été mis à jour",
                })
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}

export default AgencySettings