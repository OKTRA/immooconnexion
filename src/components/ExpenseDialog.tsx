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
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Enregistrer une dépense
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] h-[90vh] md:h-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">
            Enregistrer une dépense
          </DialogTitle>
          <DialogDescription>
            Enregistrez une dépense pour ce bien
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-180px)] md:h-auto pr-4">
          <ExpenseFormFields propertyId={propertyId} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}