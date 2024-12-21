import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PropertyTable } from "@/components/PropertyTable";

const Properties = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Biens</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un bien
            </Button>
          </div>

          <PropertyTable />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Properties;