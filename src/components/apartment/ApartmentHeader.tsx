import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApartmentForm } from "./ApartmentForm"

export function ApartmentHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appartements</h1>
        <p className="text-muted-foreground">
          Gérez vos immeubles et leurs unités
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Appartement
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un appartement</DialogTitle>
          </DialogHeader>
          <ApartmentForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}