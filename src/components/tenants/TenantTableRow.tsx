import { TableCell, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { TenantActionButtons } from "./TenantActionButtons"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TenantReceipt } from "./TenantReceipt"
import { InspectionDialog } from "../inspections/InspectionDialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "../ui/use-toast"

interface TenantTableRowProps {
  tenant: {
    id: string
    nom: string
    prenom: string
    dateNaissance: string
    telephone: string
    photoIdUrl?: string
    fraisAgence?: string
    user_id?: string
    role?: string
  }
  onEdit: (tenant: any) => void
  onDelete: (id: string) => void
}

export function TenantTableRow({ tenant, onEdit, onDelete }: TenantTableRowProps) {
  const [showReceipt, setShowReceipt] = useState(false)
  const [showInspection, setShowInspection] = useState(false)
  const { toast } = useToast()

  const { data: contract } = useQuery({
    queryKey: ['tenant-contract', tenant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, property:properties(*)')
        .eq('tenant_id', tenant.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching contract:', error)
        throw error
      }

      return data
    }
  })

  return (
    <TableRow>
      <TableCell>{tenant.nom}</TableCell>
      <TableCell>{tenant.prenom}</TableCell>
      <TableCell>
        {tenant.dateNaissance ? format(new Date(tenant.dateNaissance), 'PP', { locale: fr }) : 'Non renseigné'}
      </TableCell>
      <TableCell>{tenant.telephone}</TableCell>
      <TableCell>{tenant.role || 'N/A'}</TableCell>
      <TableCell>{tenant.user_id || 'N/A'}</TableCell>
      <TableCell>
        <TenantActionButtons
          tenant={tenant}
          onPrintReceipt={() => setShowReceipt(true)}
          onPrintContract={() => {
            if (!contract) {
              toast({
                title: "Aucun contrat trouvé",
                description: "Ce locataire n'a pas de contrat actif",
                variant: "destructive"
              })
              return
            }
    const contractContent = `
      <html>
        <head>
          <title>Contrat de Location</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 20px 0; }
            .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Contrat de Location</h1>
            <p>Date: ${format(new Date(contract.created_at), 'PP', { locale: fr })}</p>
          </div>
          <div class="section">
            <h2>1. Parties</h2>
            <p><strong>Locataire:</strong> ${tenant.prenom} ${tenant.nom}</p>
            <p><strong>Propriété:</strong> ${contract.property?.bien || 'Non renseigné'}</p>
          </div>
          <div class="section">
            <h2>2. Conditions</h2>
            <p><strong>Loyer mensuel:</strong> ${contract.montant?.toLocaleString()} FCFA</p>
            <p><strong>Durée du bail:</strong> Du ${format(new Date(contract.start_date), 'PP', { locale: fr })} 
              ${contract.end_date ? `au ${format(new Date(contract.end_date), 'PP', { locale: fr })}` : '(En cours)'}</p>
          </div>
          <div class="signatures">
            <div>
              <p>Le Propriétaire:</p>
              <p>_____________________</p>
            </div>
            <div>
              <p>Le Locataire:</p>
              <p>_____________________</p>
            </div>
          </div>
        </body>
      </html>
    `
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(contractContent)
      printWindow.document.close()
      printWindow.print()
    }
  }
          }}
          onInspection={() => setShowInspection(true)}
        />
      </TableCell>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-3xl">
          <TenantReceipt
            tenant={{
              nom: tenant.nom,
              prenom: tenant.prenom,
              telephone: tenant.telephone,
              fraisAgence: tenant.fraisAgence || "0",
              propertyId: contract?.property_id || "",
            }}
            contractId={contract?.id}
          />
        </DialogContent>
      </Dialog>

      {contract && (
        <InspectionDialog
          contract={contract}
          open={showInspection}
          onOpenChange={setShowInspection}
        />
      )}
    </TableRow>
  )
}
