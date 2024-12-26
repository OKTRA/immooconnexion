import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, DollarSign, Calendar, CheckSquare, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PropertySaleDialog } from "./PropertySaleDialog"

export function PropertySalesTable() {
  const { toast } = useToast()
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const { data: sales = [], isLoading, refetch } = useQuery({
    queryKey: ['property-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_sales')
        .select(`
          *,
          property:properties(bien)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const handleDelete = async () => {
    try {
      if (!selectedSale) return

      const { error } = await supabase
        .from('property_sales')
        .delete()
        .eq('id', selectedSale.id)

      if (error) throw error

      toast({
        title: "Vente supprimée",
        description: "La vente a été supprimée avec succès"
      })

      refetch()
    } catch (error: any) {
      console.error('Error deleting sale:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      })
    } finally {
      setShowDeleteDialog(false)
      setSelectedSale(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Acheteur</TableHead>
            <TableHead>Prix de vente</TableHead>
            <TableHead>Date de vente</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.property.bien}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{sale.buyer_name}</p>
                  <p className="text-sm text-gray-500">{sale.buyer_contact}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {sale.sale_price.toLocaleString()} FCFA
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(sale.sale_date), 'Pp', { locale: fr })}
                </div>
              </TableCell>
              <TableCell>
                {sale.commission_amount?.toLocaleString() || '0'} FCFA
              </TableCell>
              <TableCell>
                <Badge variant={sale.payment_status === 'completed' ? 'success' : 'warning'}>
                  {sale.payment_status === 'completed' ? (
                    <div className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3" />
                      Payé
                    </div>
                  ) : (
                    'En attente'
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedSale(sale)
                      setShowEditDialog(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedSale(sale)
                      setShowDeleteDialog(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {sales.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Aucune vente enregistrée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement la vente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedSale && (
        <PropertySaleDialog
          propertyId={selectedSale.property_id}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          initialData={selectedSale}
          isEditing
        />
      )}
    </Card>
  )
}