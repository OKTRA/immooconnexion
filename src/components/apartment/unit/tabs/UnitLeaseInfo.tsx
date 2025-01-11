import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ApartmentLease } from "@/types/apartment"

interface UnitLeaseInfoProps {
  lease: ApartmentLease | null;
}

export function UnitLeaseInfo({ lease }: UnitLeaseInfoProps) {
  if (!lease) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informations du bail</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aucun bail actif</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Actif</Badge>
      case "expired":
        return <Badge variant="destructive">Expiré</Badge>
      case "terminated":
        return <Badge variant="warning">Résilié</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentFrequency = (frequency: string) => {
    switch (frequency) {
      case "monthly":
        return "Mensuel"
      case "quarterly":
        return "Trimestriel"
      case "yearly":
        return "Annuel"
      default:
        return frequency
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du bail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Date de début</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(lease.start_date), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Date de fin</p>
            <p className="text-sm text-muted-foreground">
              {lease.end_date 
                ? format(new Date(lease.end_date), "d MMMM yyyy", { locale: fr })
                : "Non définie"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Statut</p>
            {getStatusBadge(lease.status)}
          </div>
          <div>
            <p className="text-sm font-medium">Fréquence de paiement</p>
            <p className="text-sm text-muted-foreground">
              {getPaymentFrequency(lease.payment_frequency)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Type de durée</p>
            <p className="text-sm text-muted-foreground">
              {lease.duration_type === "fixed" ? "Durée fixe" : "Mois par mois"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Type de paiement</p>
            <p className="text-sm text-muted-foreground">
              {lease.payment_type === "upfront" ? "Début de période" : "Fin de période"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}