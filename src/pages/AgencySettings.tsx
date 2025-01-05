import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgencyForm } from "@/components/admin/agency/AgencyForm"
import { AgencyUsers } from "@/components/admin/agency/AgencyUsers"
import { useToast } from "@/hooks/use-toast"
import { Profile } from "@/types/profile"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

function AgencySettings() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [newProfile, setNewProfile] = useState<Profile>({
    id: '',
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "admin",
    agency_id: id || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_tenant: false,
    status: 'active',
    has_seen_warning: false
  })

  const { data: agency, isLoading, refetch } = useQuery({
    queryKey: ["agency", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        throw error
      }

      return data
    },
  })

  useEffect(() => {
    if (!isLoading && !agency) {
      navigate("/admin/agencies")
      toast({
        title: "Erreur",
        description: "Cette agence n'existe pas",
        variant: "destructive",
      })
    }
  }, [agency, isLoading, navigate, toast])

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!agency) {
    return null
  }

  const handleAgencyUpdate = async (updatedAgency: typeof agency) => {
    try {
      const { error } = await supabase
        .from("agencies")
        .update(updatedAgency)
        .eq("id", id)

      if (error) throw error

      refetch()
      toast({
        title: "Succès",
        description: "Les informations de l'agence ont été mises à jour",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/agencies")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux agences
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres de l'agence</h2>
        <p className="text-muted-foreground">
          Gérez les paramètres de l'agence et ses utilisateurs
        </p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <AgencyForm agency={agency} setAgency={handleAgencyUpdate} />
        </TabsContent>
        <TabsContent value="users">
          <AgencyUsers agencyId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AgencySettings