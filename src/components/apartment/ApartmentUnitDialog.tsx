import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UnitFormFields } from "./unit-dialog/UnitFormFields";
import { useUnitForm } from "./unit-dialog/useUnitForm";
import { useUnitMutations } from "./unit-dialog/useUnitMutations";
import { ApartmentUnit } from "./types";

interface ApartmentUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartmentId: string;
  unitToEdit?: ApartmentUnit;
  onSuccess?: () => void;
}

export function ApartmentUnitDialog({
  open,
  onOpenChange,
  apartmentId,
  unitToEdit,
  onSuccess,
}: ApartmentUnitDialogProps) {
  const form = useUnitForm(unitToEdit);
  const { createUnit, updateUnit } = useUnitMutations(apartmentId);

  const onSubmit = async (data: any) => {
    try {
      if (unitToEdit) {
        await updateUnit.mutateAsync({ ...data, id: unitToEdit.id });
      } else {
        await createUnit.mutateAsync(data);
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {unitToEdit ? "Modifier l'unité" : "Nouvelle unité"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UnitFormFields form={form} />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={createUnit.isPending || updateUnit.isPending}
              >
                {unitToEdit ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}