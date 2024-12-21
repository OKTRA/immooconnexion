import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TenantsTable } from "@/components/TenantsTable";
import { TenantsDialog } from "@/components/TenantsDialog";

const Tenants = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any>(null);

  const handleAddTenant = () => {
    setEditingTenant(null);
    setDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Locataires</h1>
            <Button onClick={handleAddTenant}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un locataire
            </Button>
          </div>

          <TenantsTable onEdit={setEditingTenant} />
          <TenantsDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            tenant={editingTenant}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Tenants;