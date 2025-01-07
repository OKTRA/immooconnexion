import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApartmentUnitsSection } from "./ApartmentUnitsSection"
import { ApartmentUnit } from "@/types/apartment"

interface ApartmentUnitsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedApartmentId: string | null
  units: ApartmentUnit[]
  unitsLoading: boolean
  onCreateUnit: (data: ApartmentUnit) => Promise<void>
  onUpdateUnit: (data: ApartmentUnit) => Promise<void>
  onDeleteUnit: (unitId: string) => Promise<void>
}

export function ApartmentUnitsDialog({
  open,
  onOpenChange,
  selectedApartmentId,
  units,
  unitsLoading,
  onCreateUnit,
  onUpdateUnit,
  onDeleteUnit
}: ApartmentUnitsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestion des Unités</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="units" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="units">Unités</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          <TabsContent value="units">
            {selectedApartmentId && (
              <ApartmentUnitsSection
                apartmentId={selectedApartmentId}
                units={units}
                isLoading={unitsLoading}
                onCreateUnit={onCreateUnit}
                onUpdateUnit={onUpdateUnit}
                onDeleteUnit={onDeleteUnit}
                onEdit={() => {}}
              />
            )}
          </TabsContent>
          <TabsContent value="payments">
            <div className="p-4 text-center text-muted-foreground">
              Fonctionnalité à venir
            </div>
          </TabsContent>
          <TabsContent value="maintenance">
            <div className="p-4 text-center text-muted-foreground">
              Fonctionnalité à venir
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}