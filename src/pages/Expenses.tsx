import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Expenses = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Dépenses</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter une dépense
            </Button>
          </div>

          {/* Table des dépenses à implémenter */}
          <div className="rounded-md border p-4">
            Table des dépenses à venir
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Expenses;