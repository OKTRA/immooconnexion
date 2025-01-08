import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenant } from "@/types/apartment"
import { useQueryClient } from "@tanstack/react-query"

interface ApartmentTenantFormProps {
  apartmentId: string
  initialData?: ApartmentTenant | null
  onSuccess: () => void
  onCancel: () => void
}

export function ApartmentTenantForm({
  apartmentId,
  initialData,
  onSuccess,
  onCancel
}: ApartmentTenantFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone_number: initialData?.phone_number || "",
    birth_date: initialData?.birth_date || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (initialData) {
        const { error } = await supabase
          .from("apartment_tenants")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("apartment_tenants")
          .insert([
            {
              ...formData,
              apartment_id: apartmentId,
            },
          ])

        if (error) throw error
      }

      await queryClient.invalidateQueries({ queryKey: ["apartment-tenants"] })
      toast({
        title: initialData ? "Locataire modifié" : "Locataire ajouté",
        description: "L'opération a été effectuée avec succès.",
      })
      onSuccess()
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          id="first_name"
          value={formData.first_name}
          onChange={(e) =>
            setFormData({ ...formData, first_name: e.target.value })
          }
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
        <Label htmlFor="phone_number">Téléphone</Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={(e) =>
            setFormData({ ...formData, phone_number: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">Date de naissance</Label>
        <Input
          id="birth_date"
          type="date"
          value={formData.birth_date}
          onChange={(e) =>
            setFormData({ ...formData, birth_date: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Chargement..."
            : initialData
            ? "Modifier"
            : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}