import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface TenantFormProps {
  apartmentId?: string;
  onSuccess?: () => void;
}

export function TenantForm({ apartmentId, onSuccess }: TenantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    birth_date: "",
    profession: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Non authentifié")

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { error } = await supabase
        .from('apartment_tenants')
        .insert({
          ...formData,
          agency_id: userProfile.agency_id,
          unit_id: apartmentId
        })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le locataire a été ajouté avec succès",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Téléphone</Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">Date de naissance</Label>
        <Input
          id="birth_date"
          type="date"
          value={formData.birth_date}
          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        <Input
          id="profession"
          value={formData.profession}
          onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Chargement..." : "Ajouter"}
      </Button>
    </form>
  )
}