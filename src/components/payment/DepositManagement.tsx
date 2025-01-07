import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export function DepositManagement() {
  const [selectedLease, setSelectedLease] = useState<any>(null)
  const [returnAmount, setReturnAmount] = useState("")
  const [notes, setNotes] = useState("")

  const { data: leases = [], refetch } = useQuery({
    queryKey: ["deposit-leases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants(first_name, last_name),
          unit:apartment_units(
            unit_number,
            apartment:apartments(name)
          )
        `)
        .is("deposit_return_date", null)
        .gt("deposit_amount", 0)

      if (error) throw error
      return data
    },
  })

  const handleDepositReturn = async () => {
    try {
      const { error } = await supabase
        .from("apartment_leases")
        .update({
          deposit_return_date: new Date().toISOString(),
          deposit_return_amount: parseInt(returnAmount),
          deposit_return_notes: notes,
        })
        .eq("id", selectedLease.id)

      if (error) throw error

      toast({
        title: "Caution retournée",
        description: "Le retour de la caution a été enregistré avec succès",
      })

      setSelectedLease(null)
      setReturnAmount("")
      setNotes("")
      refetch()
    } catch (error) {
      console.error("Error returning deposit:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du retour de la caution",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des cautions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leases.map((lease) => (
              <div
                key={lease.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {lease.tenant?.first_name} {lease.tenant?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lease.unit?.apartment?.name} - Unité {lease.unit?.unit_number}
                  </p>
                  <p className="text-sm">
                    Caution: {lease.deposit_amount?.toLocaleString()} FCFA
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Date de début:{" "}
                    {format(new Date(lease.start_date), "PP", { locale: fr })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedLease(lease)
                    setReturnAmount(lease.deposit_amount.toString())
                  }}
                >
                  Retourner la caution
                </Button>
              </div>
            ))}
            {leases.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Aucune caution à retourner
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLease} onOpenChange={() => setSelectedLease(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retour de caution</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Montant à retourner</label>
              <Input
                type="number"
                value={returnAmount}
                onChange={(e) => setReturnAmount(e.target.value)}
                max={selectedLease?.deposit_amount}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Raison si le montant retourné est différent de la caution initiale..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedLease(null)}>
                Annuler
              </Button>
              <Button onClick={handleDepositReturn}>Confirmer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}