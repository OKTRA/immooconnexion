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
      console.log("Fetching profiles...")
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

      if (error) {
        console.error("Error fetching profiles:", error)
        throw error
      }
      
      console.log("Fetched profiles:", data)
      return data || []
    },
    meta: {
      errorHandler: (error: Error) => {
        console.error("Query error:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les profils. Veuillez réessayer.",
          variant: "destructive",
        })
      }
    }
  })

  const handleEditProfile = async (editedProfile: any) => {
    try {
      console.log("Updating profile:", editedProfile)
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          role: editedProfile.role,
          phone_number: editedProfile.phone_number,
          show_phone_on_site: editedProfile.show_phone_on_site,
          list_properties_on_site: editedProfile.list_properties_on_site,
          subscription_plan_id: editedProfile.subscription_plan_id,
        })
        .eq("id", editedProfile.id)

      if (error) throw error

      toast({
        title: "Profil mis à jour",
        description: "Le profil a été mis à jour avec succès",
      })
      refetch()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      })
    }
  }

  const handleAddUser = async (agencyData?: any) => {
    try {
      if (!newProfile.email || !newProfile.password) {
        toast({
          title: "Erreur",
          description: "L'email et le mot de passe sont obligatoires",
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

      let userId = existingUser?.id

      if (!userId) {
        console.log("Creating new user...")
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: newProfile.email,
          password: newProfile.password,
        })

        if (authError) throw authError
        if (!authData.user) throw new Error("Aucun utilisateur créé")
        
        userId = authData.user.id
        console.log("New user created:", userId)
      }

      let agencyId = null
      
      if (agencyData && agencyData.name) {
        console.log("Creating agency...")
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
        console.log("Agency created:", agencyId)
      }

      // Update or create the profile
      console.log("Updating profile...")
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
      console.error("Error adding/updating profile:", error)
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
        onEdit={handleEditProfile}
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