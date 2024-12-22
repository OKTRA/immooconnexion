import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TenantReceipt } from "../tenants/TenantReceipt";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InspectionHistoryProps {
  contractId: string;
}

export function InspectionHistory({ contractId }: InspectionHistoryProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);

  const { data: inspections, isLoading } = useQuery({
    queryKey: ['inspections', contractId],
    queryFn: async () => {
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('tenant_id, property_id, montant')
        .eq('id', contractId)
        .single();

      if (contractError) throw contractError;
      if (!contract?.tenant_id) return [];

      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('nom, prenom, phone_number, agency_fees')
        .eq('id', contract.tenant_id)
        .single();

      if (tenantError) throw tenantError;

      const { data: inspectionsData, error: inspectionsError } = await supabase
        .from('property_inspections')
        .select('*')
        .eq('contract_id', contractId);

      if (inspectionsError) throw inspectionsError;

      return inspectionsData.map(inspection => ({
        ...inspection,
        contract: {
          tenant_id: contract.tenant_id,
          property_id: contract.property_id,
          montant: contract.montant,
          tenant: tenant
        }
      }));
    }
  });

  const handleShowReceipt = (inspection: any) => {
    setSelectedInspection(inspection);
    setShowReceipt(true);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (!inspections || inspections.length === 0) {
    return <div className="text-center py-4">Aucune inspection enregistrée</div>;
  }

  return (
    <>
      <ScrollArea className="w-full">
        <div className="rounded-md border dark:border-gray-700">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="p-2 text-left text-sm md:text-base">Date</th>
                  <th className="p-2 text-left text-sm md:text-base">État</th>
                  <th className="p-2 text-left text-sm md:text-base">Dégâts</th>
                  <th className="p-2 text-left text-sm md:text-base">Coûts</th>
                  <th className="p-2 text-left text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((inspection) => (
                  <tr key={inspection.id} className="border-b dark:border-gray-700">
                    <td className="p-2 text-sm md:text-base whitespace-nowrap">
                      {format(new Date(inspection.inspection_date), 'PP', { locale: fr })}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        inspection.status === 'completé' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {inspection.status}
                      </span>
                    </td>
                    <td className="p-2 text-sm md:text-base">
                      <span className={inspection.has_damages ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        {inspection.has_damages ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="p-2 text-sm md:text-base whitespace-nowrap">
                      {inspection.repair_costs?.toLocaleString()} FCFA
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowReceipt(inspection)}
                        className="w-full md:w-auto text-xs md:text-sm"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Reçu de fin
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-3xl w-[95%] p-0">
          {selectedInspection && (
            <ScrollArea className="max-h-[80vh]">
              <div className="p-6">
                <TenantReceipt 
                  tenant={{
                    nom: selectedInspection.contract.tenant.nom,
                    prenom: selectedInspection.contract.tenant.prenom,
                    telephone: selectedInspection.contract.tenant.phone_number,
                    fraisAgence: selectedInspection.contract.tenant.agency_fees?.toString() || "0",
                    propertyId: selectedInspection.contract.property_id,
                  }}
                  contractId={contractId}
                  isEndOfContract={true}
                  inspection={selectedInspection}
                />
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}