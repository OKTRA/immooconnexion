import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, CreditCard } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { EditPlanDialog } from "./EditPlanDialog"
import { PaymentDialog } from "./PaymentDialog"
import { SubscriptionPlanRowProps } from "./types"

export function SubscriptionPlanRow({ plan, onEdit, onDelete, refetch }: SubscriptionPlanRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const { toast } = useToast()

  const handleSaveEdit = async (updatedPlan: any) => {
    try {
      await onEdit(updatedPlan)
      setShowEditDialog(false)
      toast({
        title: "Plan mis à jour",
        description: "Le plan d'abonnement a été mis à jour avec succès",
      })
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du plan:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du plan",
        variant: "destructive",
      })
    }
  }

  const handlePaymentSuccess = () => {
    toast({
      title: "Paiement réussi",
      description: "Votre abonnement a été activé avec succès",
    })
    setShowPaymentDialog(false)
  }

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{plan.name}</TableCell>
        <TableCell>{plan.price.toLocaleString()} FCFA</TableCell>
        <TableCell className="hidden md:table-cell">
          {plan.max_properties === -1 ? "Illimité" : plan.max_properties}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {plan.max_tenants === -1 ? "Illimité" : plan.max_tenants}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {plan.max_users === -1 ? "Illimité" : plan.max_users}
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <ul className="list-disc list-inside">
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="truncate">{feature}</li>
            ))}
          </ul>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(plan.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={() => setShowPaymentDialog(true)}
            >
              <CreditCard className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <EditPlanDialog
        plan={plan}
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEdit}
      />

      <PaymentDialog
        plan={plan}
        isOpen={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}