import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ExpenseForm } from "./expense/ExpenseForm"

interface ExpenseDialogProps {
  propertyId: string
  propertyRent?: number
}

export function ExpenseDialog({ propertyId, propertyRent }: ExpenseDialogProps) {
  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      console.log("Fetching tenants")
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
      
      if (error) {
        console.error("Error fetching tenants:", error)
        throw error
      }
      console.log("Tenants data:", data)
      return data
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Enregistrer une dépense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer une dépense</DialogTitle>
          <DialogDescription>
            Enregistrez une dépense pour ce bien
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm 
          propertyId={propertyId}
          propertyRent={propertyRent}
          tenants={tenants}
        />
      </DialogContent>
    </Dialog>
  )
}