import { Building, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApartmentForm } from "./ApartmentForm"

export function EmptyApartmentState() {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center">
      <Building className="w-12 h-12 mb-4 text-muted-foreground" />
      <CardTitle className="mb-2">Aucun appartement</CardTitle>
      <CardDescription>
        Vous n'avez pas encore ajouté d'appartement.
        Commencez par en créer un !
      </CardDescription>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
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
    </Card>
  )
}