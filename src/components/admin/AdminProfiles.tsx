import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ProfileTableRow } from "./ProfileTableRow"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminProfiles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newProfile, setNewProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "user",
    agency_name: "",
    password: "changeme123", // Mot de passe temporaire
  })
  const { toast } = useToast()
  
  const { data: profiles = [], refetch } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const handleAddUser = async () => {
    try {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newProfile.email,
        password: newProfile.password,
        email_confirm: true,
      })

      if (authError) throw authError

      if (!authData.user) throw new Error("Aucun utilisateur créé")

      // 2. Mettre à jour le profil avec les informations supplémentaires
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          role: newProfile.role,
          agency_name: newProfile.agency_name,
        })
        .eq("id", authData.user.id)

      if (profileError) throw profileError

      toast({
        title: "Profil ajouté",
        description: "Le nouveau profil a été ajouté avec succès. Mot de passe temporaire: changeme123",
      })
      setShowAddDialog(false)
      setNewProfile({
        email: "",
        first_name: "",
        last_name: "",
        role: "user",
        agency_name: "",
        password: "changeme123",
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

  const handleEditUser = async (profile: any) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          role: profile.role,
          agency_name: profile.agency_name,
        })
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Profil mis à jour",
        description: "Le profil a été mis à jour avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      })
    }
  }

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.agency_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Rechercher par nom, prénom, email ou agence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2" />
          Ajouter un profil
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableHead>ID</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Agence</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filteredProfiles.map((profile) => (
              <ProfileTableRow
                key={profile.id}
                profile={profile}
                onEdit={handleEditUser}
                refetch={refetch}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={newProfile.email}
                onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                value={newProfile.first_name}
                onChange={(e) => setNewProfile({ ...newProfile, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                value={newProfile.last_name}
                onChange={(e) => setNewProfile({ ...newProfile, last_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="agency_name">Nom de l'agence</Label>
              <Input
                id="agency_name"
                value={newProfile.agency_name}
                onChange={(e) => setNewProfile({ ...newProfile, agency_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={newProfile.role}
                onValueChange={(value) => setNewProfile({ ...newProfile, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddUser} className="w-full">
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}