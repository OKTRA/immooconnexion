import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserMinus, Trash2, UserPlus, Edit, UserCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AdminProfiles() {
  const [searchTerm, setSearchTerm] = useState("")
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

  const handleToggleBlockUser = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "blocked" ? "user" : "blocked"
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)

      if (error) throw error

      toast({
        title: currentRole === "blocked" ? "Utilisateur débloqué" : "Utilisateur bloqué",
        description: currentRole === "blocked" 
          ? "L'utilisateur a été débloqué avec succès"
          : "L'utilisateur a été bloqué avec succès",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (userId: string) => {
    try {
      // Pour l'instant, on simule juste une mise à jour
      toast({
        title: "Fonctionnalité à venir",
        description: "La modification de profil sera bientôt disponible",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)

      if (error) throw error

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const handleAddUser = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de profil sera bientôt disponible",
    })
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
          placeholder="Rechercher par nom, prénom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2" />
          Ajouter un profil
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-mono">{profile.id}</TableCell>
                <TableCell>{profile.first_name || "-"}</TableCell>
                <TableCell>{profile.last_name || "-"}</TableCell>
                <TableCell>{profile.email || "-"}</TableCell>
                <TableCell>
                  <Badge variant={profile.role === "admin" ? "default" : profile.role === "blocked" ? "destructive" : "secondary"}>
                    {profile.role || "user"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(profile.created_at), "Pp", { locale: fr })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleBlockUser(profile.id, profile.role || "user")}
                      title={profile.role === "blocked" ? "Débloquer" : "Bloquer"}
                    >
                      {profile.role === "blocked" ? (
                        <UserCheck className="h-4 w-4" />
                      ) : (
                        <UserMinus className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateUser(profile.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteUser(profile.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}