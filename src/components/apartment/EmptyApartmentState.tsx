import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ApartmentForm } from "./ApartmentForm"

interface EmptyApartmentStateProps {
  owners: Array<{
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  }>;
}

export function EmptyApartmentState({ owners }: EmptyApartmentStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center">
      <Building2 className="w-12 h-12 mb-4 text-muted-foreground" />
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
          <ApartmentForm owners={owners} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}