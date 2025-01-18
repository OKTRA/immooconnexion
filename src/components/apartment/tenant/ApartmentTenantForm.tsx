import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentTenant } from "@/types/apartment"

interface ApartmentTenantFormProps {
  unitId: string
  onSuccess: () => void
  isSubmitting: boolean
  setIsSubmitting: (isSubmitting: boolean) => void
  initialData?: ApartmentTenant
}

export function ApartmentTenantForm({
  unitId,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  initialData,
}: ApartmentTenantFormProps) {
  const [firstName, setFirstName] = useState(initialData?.first_name || "")
  const [lastName, setLastName] = useState(initialData?.last_name || "")
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phone_number || "")
  const [birthDate, setBirthDate] = useState(initialData?.birth_date || "")
  const [profession, setProfession] = useState(initialData?.profession || "")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from("apartment_tenants")
        .upsert({
          id: initialData?.id,
          unit_id: unitId,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          birth_date: birthDate,
          profession: profession,
        })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Locataire enregistré avec succès.",
      })
      onSuccess()
    } catch (error: any) {
      console.error("Error saving tenant:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du locataire.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.first_name)
      setLastName(initialData.last_name)
      setPhoneNumber(initialData.phone_number)
      setBirthDate(initialData.birth_date)
      setProfession(initialData.profession)
    }
  }, [initialData])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="first_name">Prénom</Label>
        <Input
          id="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="last_name">Nom</Label>
        <Input
          id="last_name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone_number">Téléphone</Label>
        <Input
          id="phone_number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="birth_date">Date de naissance</Label>
        <Input
          id="birth_date"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="profession">Profession</Label>
        <Input
          id="profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}
