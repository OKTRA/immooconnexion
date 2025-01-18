import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { useState } from "react"
import { PropertyOwnerDialog } from "./PropertyOwnerDialog"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

interface PropertyOwnerRowProps {
  owner: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone_number: string | null
    status: 'active' | 'inactive'
  }
}

export function PropertyOwnerRow({ owner }: PropertyOwnerRowProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('property_owners')
        .delete()
        .eq('id', owner.id)

      if (error) throw error

      toast({
        title: "Propriétaire supprimé",
        description: "Le propriétaire a été supprimé avec succès"
      })

      queryClient.invalidateQueries({ queryKey: ['property-owners'] })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      })
    }
  }

  return (
    <>
      <TableRow>
        <TableCell>{owner.first_name} {owner.last_name}</TableCell>
        <TableCell>{owner.email || '-'}</TableCell>
        <TableCell>{owner.phone_number || '-'}</TableCell>
        <TableCell>
          <Badge variant={owner.status === 'active' ? 'default' : 'secondary'}>
            {owner.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <PropertyOwnerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        owner={owner}
      />
    </>
  )
}