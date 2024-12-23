import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AddProfileDialog } from "./profile/AddProfileDialog"
import { ProfilesTable } from "./profile/ProfilesTable"
import { supabase } from "@/integrations/supabase/client"

export function AdminProfiles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newProfile, setNewProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "user",
    agency_id: "",
    phone_number: "",
    show_phone_on_site: false,
    list_properties_on_site: false,
    subscription_plan_id: null,
    password: "",
  })
  const { toast } = useToast()
  
  const { data: profiles = [], refetch } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          agency:agencies(
            name,
            address,
            phone,
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const handleAddUser = async (agencyData?: any) => {
    try {
      if (!newProfile.password) {
        toast({
          title: "Erreur",
          description: "Le mot de passe est obligatoire",
          variant: "destructive",
        })
        return
      }

      if (newProfile.password.length < 6) {
        toast({
          title: "Erreur",
          description: "Le mot de passe doit contenir au moins 6 caractères",
          variant: "destructive",
        })
        return
      }

      // First check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newProfile.email)
        .maybeSingle()

      let userId

      if (existingUser) {
        userId = existingUser.id
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: newProfile.email,
          password: newProfile.password,
        })

        if (authError) throw authError
        if (!authData.user) throw new Error("Aucun utilisateur créé")
        
        userId = authData.user.id
      }

      let agencyId = null
      
      // Create agency if data is provided
      if (agencyData && agencyData.name) {
        const { data: agency, error: agencyError } = await supabase
          .from('agencies')
          .insert({
            name: agencyData.name,
            address: agencyData.address,
            phone: agencyData.phone,
            email: agencyData.email,
            profile_id: userId
          })
          .select()
          .single()

        if (agencyError) throw agencyError
        agencyId = agency.id
      }

      // Update or create the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          role: newProfile.role,
          agency_id: agencyId,
          phone_number: newProfile.phone_number,
          show_phone_on_site: newProfile.show_phone_on_site,
          list_properties_on_site: newProfile.list_properties_on_site,
          subscription_plan_id: newProfile.subscription_plan_id,
          email: newProfile.email,
        })

      if (profileError) throw profileError

      toast({
        title: existingUser ? "Profil mis à jour" : "Profil ajouté",
        description: existingUser 
          ? "Le profil a été mis à jour avec succès."
          : "Le nouveau profil a été ajouté avec succès.",
      })
      
      setShowAddDialog(false)
      setNewProfile({
        email: "",
        first_name: "",
        last_name: "",
        role: "user",
        agency_id: "",
        phone_number: "",
        show_phone_on_site: false,
        list_properties_on_site: false,
        subscription_plan_id: null,
        password: "",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du profil",
        variant: "destructive",
      })
    }
  }

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Rechercher par nom, prénom, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2" />
          Ajouter un profil
        </Button>
      </div>
      
      <ProfilesTable 
        profiles={filteredProfiles}
        refetch={refetch}
      />

      <AddProfileDialog
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        newProfile={newProfile}
        setNewProfile={setNewProfile}
        handleAddUser={handleAddUser}
      />
    </div>
  )
}