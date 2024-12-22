import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptTableProps {
  tenant: {
    fraisAgence: string;
  };
  propertyId: string;
  isEndOfContract?: boolean;
  contractId?: string;
}

export function ReceiptTable({ tenant, propertyId, isEndOfContract, contractId }: ReceiptTableProps) {
  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!propertyId
  });

  const { data: inspection } = useQuery({
    queryKey: ['inspection', contractId],
    queryFn: async () => {
      if (!contractId) return null;
      
      const { data, error } = await supabase
        .from('property_inspections')
        .select('*')
        .eq('contract_id', contractId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contractId && isEndOfContract
  });

  const calculateTotal = () => {
    if (isEndOfContract) {
      return inspection?.deposit_returned || 0;
    }
    return (property?.loyer || 0) + (property?.caution || 0) + parseFloat(tenant.fraisAgence || "0");
  };

  return (
    <table className="w-full border-collapse mb-8">
      <thead>
        <tr className="bg-gray-50">
          <th className="border p-2 text-left">Description</th>
          <th className="border p-2 text-left">Montant (FCFA)</th>
        </tr>
      </thead>
      <tbody>
        {!isEndOfContract ? (
          <>
            {property?.loyer && (
              <tr>
                <td className="border p-2">Loyer</td>
                <td className="border p-2">{property.loyer.toLocaleString()}</td>
              </tr>
            )}
            {property?.caution && (
              <tr>
                <td className="border p-2">Caution</td>
                <td className="border p-2">{property.caution.toLocaleString()}</td>
              </tr>
            )}
            <tr>
              <td className="border p-2">Frais d'agence</td>
              <td className="border p-2">{parseFloat(tenant.fraisAgence).toLocaleString()}</td>
            </tr>
          </>
        ) : (
          <>
            {inspection?.deposit_returned && (
              <tr>
                <td className="border p-2">Caution retournée</td>
                <td className="border p-2">{inspection.deposit_returned.toLocaleString()}</td>
              </tr>
            )}
            {inspection?.repair_costs && (
              <tr>
                <td className="border p-2">Coûts de réparation</td>
                <td className="border p-2">{inspection.repair_costs.toLocaleString()}</td>
              </tr>
            )}
          </>
        )}
        <tr className="font-bold">
          <td className="border p-2">Total</td>
          <td className="border p-2">{calculateTotal().toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  );
}