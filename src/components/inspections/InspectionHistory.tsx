import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TenantReceipt } from "../tenants/TenantReceipt";

interface InspectionHistoryProps {
  contractId: string;
}

export function InspectionHistory({ contractId }: InspectionHistoryProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);

  const { data: inspections, isLoading } = useQuery({
    queryKey: ['inspections', contractId],
    queryFn: async () => {
      // First, get the contract details including tenant_id
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('tenant_id, property_id, montant')
        .eq('id', contractId)
        .single();

      if (contractError) throw contractError;

      if (!contract?.tenant_id) {
        return [];
      }

      // Then get the tenant details
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('nom, prenom, phone_number, agency_fees')
        .eq('id', contract.tenant_id)
        .single();

      if (tenantError) throw tenantError;

      // Finally get the inspections with the collected data
      const { data: inspectionsData, error: inspectionsError } = await supabase
        .from('property_inspections')
        .select('*')
        .eq('contract_id', contractId);

      if (inspectionsError) throw inspectionsError;

      // Combine the data
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
    return <div>Chargement...</div>;
  }

  if (!inspections || inspections.length === 0) {
    return <div className="text-center py-4">Aucune inspection enregistrée</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Date d'inspection</th>
              <th className="p-2 text-left">État</th>
              <th className="p-2 text-left">Dégâts</th>
              <th className="p-2 text-left">Coûts réparation</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <tr key={inspection.id} className="border-b">
                <td className="p-2">
                  {format(new Date(inspection.inspection_date), 'PP', { locale: fr })}
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    inspection.status === 'completé' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {inspection.status}
                  </span>
                </td>
                <td className="p-2">
                  <span className={inspection.has_damages ? 'text-red-600' : 'text-green-600'}>
                    {inspection.has_damages ? 'Oui' : 'Non'}
                  </span>
                </td>
                <td className="p-2">
                  {inspection.repair_costs?.toLocaleString()} FCFA
                </td>
                <td className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowReceipt(inspection)}
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

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          {selectedInspection && (
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}