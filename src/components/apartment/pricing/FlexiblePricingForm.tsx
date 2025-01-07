import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface FlexiblePricingFormProps {
  unitId: string
  onSuccess?: () => void
}

export function FlexiblePricingForm({ unitId, onSuccess }: FlexiblePricingFormProps) {
  const [durationType, setDurationType] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from("apartment_unit_pricing")
        .insert({
          unit_id: unitId,
          duration_type: durationType,
          price: parseInt(price),
        })

      if (error) throw error

      toast({
        title: "Prix ajouté",
        description: "Le tarif a été ajouté avec succès",
      })

      setDurationType("")
      setPrice("")
      onSuccess?.()
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du tarif",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="durationType">Type de durée</Label>
        <Select value={durationType} onValueChange={setDurationType}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une durée" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">Par heure</SelectItem>
            <SelectItem value="day">Par jour</SelectItem>
            <SelectItem value="week">Par semaine</SelectItem>
            <SelectItem value="month">Par mois</SelectItem>
            <SelectItem value="year">Par année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Prix</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Montant en FCFA"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ajout en cours..." : "Ajouter le tarif"}
      </Button>
    </form>
  )
}