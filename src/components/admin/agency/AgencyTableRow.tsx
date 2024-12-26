import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Agency } from "./types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AgencyOverview } from "./AgencyOverview"

interface AgencyTableRowProps {
  agency: Agency
  onEdit: (agency: Agency) => void
  refetch: () => void
}

export function AgencyTableRow({ agency, onEdit, refetch }: AgencyTableRowProps) {
  const { toast } = useToast()
  const [showOverview, setShowOverview] = useState(false)

  const handleDeleteAgency = async () => {
    try {
      const { error } = await supabase
        .from("agencies")
        .delete()
        .eq("id", agency.id)

      if (error) throw error

      toast({
        title: "Agence supprimée",
        description: "L'agence a été supprimée avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression de l'agence",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <TableRow>
        <TableCell>{agency.name}</TableCell>
        <TableCell>{agency.address || "-"}</TableCell>
        <TableCell>{agency.phone || "-"}</TableCell>
        <TableCell>{agency.email || "-"}</TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {format(new Date(agency.created_at), "Pp", { locale: fr })}
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowOverview(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(agency)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDeleteAgency}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={showOverview} onOpenChange={setShowOverview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vue d'ensemble de l'agence</DialogTitle>
          </DialogHeader>
          <AgencyOverview agency={agency} onRefetch={refetch} />
        </DialogContent>
      </Dialog>
    </>
  )
}