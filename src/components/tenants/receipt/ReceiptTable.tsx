import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReceiptTableProps {
  tenant: {
    fraisAgence: string;
    profession?: string;
  };
  propertyId: string;
  isEndOfContract?: boolean;
  contractId?: string;
  inspection?: any;
}

export function ReceiptTable({ tenant, propertyId, isEndOfContract, contractId, inspection }: ReceiptTableProps) {
  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      
      const { data, error } = await supabase
        .from('properties')
        .select('*, agencies(name)')
        .eq('id', propertyId)
        .single();
      
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
          <th className="border p-2 text-left">Détails</th>
        </tr>
      </thead>
      <tbody>
        {property && (
          <>
            <tr>
              <td className="border p-2">Agence</td>
              <td className="border p-2">{property.agencies?.name}</td>
            </tr>
            <tr>
              <td className="border p-2">Bien</td>
              <td className="border p-2">{property.bien}</td>
            </tr>
            {tenant.profession && (
              <tr>
                <td className="border p-2">Profession</td>
                <td className="border p-2">{tenant.profession}</td>
              </tr>
            )}
            <tr>
              <td className="border p-2">Loyer mensuel</td>
              <td className="border p-2">{property.loyer?.toLocaleString()} FCFA</td>
            </tr>
            <tr>
              <td className="border p-2">Caution</td>
              <td className="border p-2">{property.caution?.toLocaleString()} FCFA</td>
            </tr>
            <tr>
              <td className="border p-2">Frais d'agence</td>
              <td className="border p-2">{parseFloat(tenant.fraisAgence).toLocaleString()} FCFA</td>
            </tr>
            <tr className="font-bold">
              <td className="border p-2">Total</td>
              <td className="border p-2">
                {((property.loyer || 0) + (property.caution || 0) + parseFloat(tenant.fraisAgence || "0")).toLocaleString()} FCFA
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
}
