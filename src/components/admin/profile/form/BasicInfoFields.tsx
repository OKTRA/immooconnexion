import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

interface BasicInfoFieldsProps {
  newProfile: any;
  setNewProfile: (profile: any) => void;
}

export function BasicInfoFields({ newProfile, setNewProfile }: BasicInfoFieldsProps) {
  const { toast } = useToast()
  const [newAgencyName, setNewAgencyName] = useState("")
  
  // Fetch available agencies
  const { data: agencies, refetch: refetchAgencies } = useQuery({
    queryKey: ["agencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .order("name")
      
      if (error) throw error
      return data
    }
  })

  const handleCreateAgency = async () => {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .insert([{ name: newAgencyName }])
        .select()
        .single()

      if (error) throw error

      if (data) {
        setNewProfile({ ...newProfile, agency_id: data.id })
        setNewAgencyName("")
        refetchAgencies()
        toast({
          title: "Agence créée",
          description: "L'agence a été créée avec succès",
        })
      }
    } catch (error) {
      console.error('Error creating agency:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'agence",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product_photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product_photos')
        .getPublicUrl(filePath)

      // Update agency with logo URL
      if (newProfile.agency_id) {
        const { error: updateError } = await supabase
          .from('agencies')
          .update({ logo_url: publicUrl })
          .eq('id', newProfile.agency_id)

        if (updateError) throw updateError

        toast({
          title: "Logo mis à jour",
          description: "Le logo de l'agence a été mis à jour avec succès",
        })
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du logo",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={newProfile.email}
          onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          id="first_name"
          value={newProfile.first_name}
          onChange={(e) => setNewProfile({ ...newProfile, first_name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="last_name">Nom</Label>
        <Input
          id="last_name"
          value={newProfile.last_name}
          onChange={(e) => setNewProfile({ ...newProfile, last_name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone_number">Numéro de téléphone</Label>
        <Input
          id="phone_number"
          value={newProfile.phone_number}
          onChange={(e) => setNewProfile({ ...newProfile, phone_number: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={newProfile.password}
          onChange={(e) => setNewProfile({ ...newProfile, password: e.target.value })}
          required
          placeholder="Entrez un mot de passe"
        />
      </div>
      <div>
        <Label htmlFor="agency">Agence existante</Label>
        <Select 
          value={newProfile.agency_id} 
          onValueChange={(value) => setNewProfile({ ...newProfile, agency_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une agence" />
          </SelectTrigger>
          <SelectContent>
            {agencies?.map((agency) => (
              <SelectItem key={agency.id} value={agency.id}>
                {agency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="new_agency">Ou créer une nouvelle agence</Label>
        <div className="flex gap-2">
          <Input
            id="new_agency"
            value={newAgencyName}
            onChange={(e) => setNewAgencyName(e.target.value)}
            placeholder="Nom de la nouvelle agence"
          />
          <button
            onClick={handleCreateAgency}
            disabled={!newAgencyName}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            Créer
          </button>
        </div>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="logo">Logo de l'agence (optionnel)</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}