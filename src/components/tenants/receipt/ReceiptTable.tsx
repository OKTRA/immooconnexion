import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReceiptTableProps {
  tenant: {
    fraisAgence: string;
  };
  propertyId: string;
  isEndOfContract?: boolean;
  contractId?: string;
  inspection?: any; // Added this line to fix the TypeScript error
}

export function ReceiptTable({ tenant, propertyId, isEndOfContract, contractId, inspection }: ReceiptTableProps) {
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

  const { data: inspectionData } = useQuery({
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

  const { data: contract } = useQuery({
    queryKey: ['contract-details', contractId],
    queryFn: async () => {
      if (!contractId) return null;
      
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contractId
  });

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
            {property && (
              <>
                <tr>
                  <td className="border p-2">Bien</td>
                  <td className="border p-2">{property.bien}</td>
                </tr>
                <tr>
                  <td className="border p-2">Loyer mensuel</td>
                  <td className="border p-2">{property.loyer?.toLocaleString()} FCFA</td>
                </tr>
              </>
            )}
            {contract && (
              <tr>
                <td className="border p-2">Durée du contrat</td>
                <td className="border p-2">
                  Du {format(new Date(contract.start_date), 'PP', { locale: fr })} 
                  {contract.end_date && ` au ${format(new Date(contract.end_date), 'PP', { locale: fr })}`}
                </td>
              </tr>
            )}
            {property?.caution && (
              <tr>
                <td className="border p-2">Caution payée</td>
                <td className="border p-2">{property.caution.toLocaleString()} FCFA</td>
              </tr>
            )}
            {inspection?.deposit_returned && (
              <tr>
                <td className="border p-2">Caution retournée</td>
                <td className="border p-2">{inspection.deposit_returned.toLocaleString()} FCFA</td>
              </tr>
            )}
            {inspection?.repair_costs && inspection.repair_costs > 0 && (
              <tr>
                <td className="border p-2">Coûts de réparation</td>
                <td className="border p-2 text-red-600">-{inspection.repair_costs.toLocaleString()} FCFA</td>
              </tr>
            )}
          </>
        )}
        <tr className="font-bold">
          <td className="border p-2">Total</td>
          <td className="border p-2">
            {isEndOfContract 
              ? (inspection?.deposit_returned || 0).toLocaleString()
              : ((property?.loyer || 0) + (property?.caution || 0) + parseFloat(tenant.fraisAgence || "0")).toLocaleString()
            } FCFA
          </td>
        </tr>
      </tbody>
    </table>
  );
}