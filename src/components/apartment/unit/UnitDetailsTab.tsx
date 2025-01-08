import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApartmentUnit } from "@/components/apartment/types"
import { 
  Receipt, 
  CreditCard, 
  ClipboardList, 
  Clock,
  Edit, 
  Trash2
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { InspectionDialog } from "@/components/inspections/InspectionDialog"
import { TenantReceipt } from "@/components/tenants/TenantReceipt"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface UnitDetailsTabProps {
  unit: ApartmentUnit & {
    current_lease?: Array<{
      id: string;
      status: string;
      deposit_amount?: number | null;
      tenant: {
        id: string;
        first_name: string;
        last_name: string;
      };
    }>;
  };
  hasActiveLease: boolean;
}

export function UnitDetailsTab({ unit, hasActiveLease }: UnitDetailsTabProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showInspection, setShowInspection] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)

  const handleEndLease = async () => {
    try {
      const { error } = await supabase
        .from('apartment_leases')
        .update({ status: 'terminated' })
        .eq('id', unit.current_lease?.[0]?.id)

      if (error) throw error

      toast({
        title: "Bail terminé",
        description: "Le bail a été terminé avec succès",
      })

      setShowInspection(true)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteLease = async () => {
    try {
      const { error } = await supabase
        .from('apartment_leases')
        .delete()
        .eq('id', unit.current_lease?.[0]?.id)

      if (error) throw error

      toast({
        title: "Bail supprimé",
        description: "Le bail a été supprimé avec succès",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'unité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Numéro d'unité</p>
              <p className="text-sm text-muted-foreground">{unit.unit_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Étage</p>
              <p className="text-sm text-muted-foreground">{unit.floor_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Surface</p>
              <p className="text-sm text-muted-foreground">{unit.area} m²</p>
            </div>
            <div>
              <p className="text-sm font-medium">Loyer</p>
              <p className="text-sm text-muted-foreground">{unit.rent_amount?.toLocaleString()} FCFA</p>
            </div>
            <div>
              <p className="text-sm font-medium">Caution</p>
              <p className="text-sm text-muted-foreground">{unit.deposit_amount?.toLocaleString()} FCFA</p>
            </div>
            <div>
              <p className="text-sm font-medium">Statut</p>
              <p className="text-sm text-muted-foreground">{unit.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasActiveLease && unit.current_lease?.[0] && (
        <Card>
          <CardHeader>
            <CardTitle>Information Bail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Locataire</p>
                <p className="text-sm text-muted-foreground">
                  {unit.current_lease[0].tenant.first_name} {unit.current_lease[0].tenant.last_name}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReceipt(true)}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Reçu initial
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/agence/paiements/${unit.current_lease?.[0].tenant.id}`)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Paiements
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/agence/paiements/${unit.current_lease?.[0].tenant.id}`)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Historique
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/agence/bails/${unit.current_lease?.[0].id}/modifier`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDeleteLease}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEndLease}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Mettre fin au bail
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasActiveLease && (
        <div className="flex justify-end">
          <Button onClick={() => navigate(`/agence/unite/${unit.id}/locataires/ajouter`)}>
            Ajouter un locataire
          </Button>
        </div>
      )}

      {showInspection && unit.current_lease?.[0] && (
        <InspectionDialog
          open={showInspection}
          onOpenChange={setShowInspection}
          lease={unit.current_lease[0]}
        />
      )}

      {showReceipt && unit.current_lease?.[0] && (
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent>
            <TenantReceipt 
              tenant={{
                nom: unit.current_lease[0].tenant.last_name,
                prenom: unit.current_lease[0].tenant.first_name,
                telephone: "",
                fraisAgence: "0",
                propertyId: unit.id,
              }}
              contractId={unit.current_lease[0].id}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}