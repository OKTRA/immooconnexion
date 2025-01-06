import { Button } from "@/components/ui/button"
import { Edit, Plus, Trash } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface ApartmentHeaderProps {
  apartment?: {
    name: string;
    address?: string;
  };
  onDelete?: () => void;
  isLoading?: boolean;
}

export function ApartmentHeader({ apartment, onDelete, isLoading }: ApartmentHeaderProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle unité</h1>
          <p className="text-muted-foreground">Ajoutez une nouvelle unité à l'appartement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{apartment.name}</h1>
        {apartment.address && (
          <p className="text-muted-foreground">{apartment.address}</p>
        )}
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
  );
}