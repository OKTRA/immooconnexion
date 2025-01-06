import { Button } from "@/components/ui/button"
import { Edit, Plus, Trash } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface ApartmentHeaderProps {
  apartment: any;
  onDelete: () => void;
}

export function ApartmentHeader({ apartment, onDelete }: ApartmentHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{apartment.name}</h1>
        <p className="text-muted-foreground">{apartment.address}</p>
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </DialogTrigger>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
        </AlertDialog>
      </div>
    </div>
  )
}