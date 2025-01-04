import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
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
        <ScrollArea className="h-[calc(100vh-250px)] md:h-auto">
          <ExpenseFormFields propertyId={propertyId} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}