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
import { ExpenseFormFields } from "./expense/ExpenseFormFields"

interface ExpenseDialogProps {
  propertyId?: string
}

export function ExpenseDialog({ propertyId }: ExpenseDialogProps) {
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
        <ExpenseFormFields propertyId={propertyId} />
      </DialogContent>
    </Dialog>
  )
}