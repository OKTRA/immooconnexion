import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

interface CreateLeaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
}

export function CreateLeaseDialog({ open, onOpenChange, tenantId }: CreateLeaseDialogProps) {
  const { toast } = useToast()
  const [selectedUnitId, setSelectedUnitId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    rent_amount: "",
    deposit_amount: "",
    payment_frequency: "monthly" as const,
    duration_type: "fixed" as const,
    payment_type: "upfront" as const
  })

  const { data: availableUnits = [], isLoading: unitsLoading } = useQuery({
    queryKey: ["available-units"],
    queryFn: async () => {
      console.log("Fetching available units...")
      const { data: units, error } = await supabase
        .from("apartment_units")
        .select(`
          id,
          unit_number,
          rent_amount,
          deposit_amount,
          apartment:apartments(name)
        `)
        .eq("status", "available")

      if (error) {
        console.error("Error fetching units:", error)
        throw error
      }

      console.log("Available units:", units)
      return units
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUnitId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une unité",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      console.log("Creating lease with data:", { tenantId, selectedUnitId, formData })

      // 1. Récupérer l'agency_id
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Agency ID not found")

      // 2. Créer l'association tenant_units
      const { error: tenantUnitError } = await supabase
        .from("tenant_units")
        .insert({
          tenant_id: tenantId,
          unit_id: selectedUnitId,
          status: "active"
        })

      if (tenantUnitError) throw tenantUnitError

      // 3. Créer le bail
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .insert({
          tenant_id: tenantId,
          unit_id: selectedUnitId,
          start_date: formData.start_date,
          end_date: formData.duration_type === "fixed" ? formData.end_date : null,
          rent_amount: parseInt(formData.rent_amount),
          deposit_amount: parseInt(formData.deposit_amount),
          payment_frequency: formData.payment_frequency,
          duration_type: formData.duration_type,
          payment_type: formData.payment_type,
          status: "active",
          agency_id: profile.agency_id
        })

      if (leaseError) throw leaseError

      // 4. Mettre à jour le statut de l'unité
      const { error: unitError } = await supabase
        .from("apartment_units")
        .update({ status: "occupied" })
        .eq("id", selectedUnitId)

      if (unitError) throw unitError

      toast({
        title: "Succès",
        description: "Le bail a été créé avec succès"
      })

      onOpenChange(false)
    } catch (error: any) {
      console.error("Error creating lease:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du bail",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un bail</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Unité</Label>
                {unitsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Chargement des unités...</span>
                  </div>
                ) : (
                  <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une unité" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.apartment?.name} - Unité {unit.unit_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>

                {formData.duration_type === "fixed" && (
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Date de fin</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent_amount">Montant du loyer</Label>
                  <Input
                    id="rent_amount"
                    type="number"
                    value={formData.rent_amount}
                    onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit_amount">Montant de la caution</Label>
                  <Input
                    id="deposit_amount"
                    type="number"
                    value={formData.deposit_amount}
                    onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fréquence de paiement</Label>
                  <Select
                    value={formData.payment_frequency}
                    onValueChange={(value: any) => setFormData({ ...formData, payment_frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel</SelectItem>
                      <SelectItem value="yearly">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type de durée</Label>
                  <Select
                    value={formData.duration_type}
                    onValueChange={(value: any) => setFormData({ ...formData, duration_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Durée déterminée</SelectItem>
                      <SelectItem value="month_to_month">Mois par mois</SelectItem>
                      <SelectItem value="yearly">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type de paiement</Label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value: any) => setFormData({ ...formData, payment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upfront">Paiement d'avance</SelectItem>
                    <SelectItem value="end_of_period">Paiement en fin de période</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer le bail"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}