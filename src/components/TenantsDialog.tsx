
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TenantCreationForm } from "./tenants/TenantCreationForm";
import { TenantReceipt } from "./tenants/TenantReceipt";
import { useUserProfile } from "./tenants/hooks/useUserProfile";
import { useAvailableProperties } from "./tenants/hooks/useAvailableProperties";
import { TenantFormData } from "@/types/tenant";

interface TenantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: TenantFormData;
}

export function TenantsDialog({ open, onOpenChange, tenant }: TenantsDialogProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [formData, setFormData] = useState<Partial<TenantFormData>>({
    first_name: tenant?.first_name || "",
    last_name: tenant?.last_name || "",
    birth_date: tenant?.birth_date || "",
    phone_number: tenant?.phone_number || "",
    photo_id_url: tenant?.photo_id_url,
    agency_fees: tenant?.agency_fees,
    property_id: tenant?.property_id || "",
    profession: tenant?.profession || "",
    // Add missing required fields with default values
    agency_id: tenant?.agency_id || "",
    status: tenant?.status || "active"
  });

  const { data: userProfile } = useUserProfile();
  const { data: properties = [] } = useAvailableProperties(userProfile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] md:h-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] md:h-auto pr-4">
          {!showReceipt ? (
            <TenantCreationForm
              userProfile={userProfile}
              properties={properties}
              onSuccess={() => setShowReceipt(true)}
              onCancel={() => onOpenChange(false)}
              initialData={tenant}
              isEditing={!!tenant}
            />
          ) : (
            <div className="space-y-4">
              <TenantReceipt 
                tenant={{
                  first_name: formData.first_name || "",
                  last_name: formData.last_name || "",
                  phone_number: formData.phone_number || "",
                  agency_fees: formData.agency_fees,
                  property_id: formData.property_id,
                  profession: formData.profession,
                }}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReceipt(false);
                    onOpenChange(false);
                  }}
                  className="w-full md:w-auto"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
