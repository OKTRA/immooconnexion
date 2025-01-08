import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReceiptTableProps {
  tenant: {
    fraisAgence: string;
    profession?: string;
  };
  propertyId?: string;
  isInitialReceipt?: boolean;
  isEndReceipt?: boolean;
  lease?: any;
}

export function ReceiptTable({ 
  tenant, 
  propertyId, 
  isInitialReceipt,
  isEndReceipt,
  lease 
}: ReceiptTableProps) {
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

  const { data: inspection } = useQuery({
    queryKey: ['inspection', lease?.id],
    queryFn: async () => {
      if (!lease?.id) return null;
      
      const { data, error } = await supabase
        .from('property_inspections')
        .select('*')
        .eq('contract_id', lease.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!lease?.id && isEndReceipt
  });

  if (isEndReceipt && lease) {
    return (
      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Détails</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Date de fin</td>
            <td className="border p-2">
              {format(new Date(lease.end_date), "d MMM yyyy", { locale: fr })}
            </td>
          </tr>
          <tr>
            <td className="border p-2">Caution initiale</td>
            <td className="border p-2">
              {lease.deposit_amount?.toLocaleString()} FCFA
            </td>
          </tr>
          {inspection && (
            <>
              <tr>
                <td className="border p-2">Dégâts constatés</td>
                <td className="border p-2">
                  {inspection.has_damages ? "Oui" : "Non"}
                </td>
              </tr>
              {inspection.has_damages && (
                <>
                  <tr>
                    <td className="border p-2">Description des dégâts</td>
                    <td className="border p-2">{inspection.damage_description}</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Coût des réparations</td>
                    <td className="border p-2">
                      {inspection.repair_costs?.toLocaleString()} FCFA
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td className="border p-2">Caution remboursée</td>
                <td className="border p-2">
                  {inspection.deposit_returned?.toLocaleString()} FCFA
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    );
  }

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
              <td className="border p-2">{parseFloat(tenant.fraisAgence || "0").toLocaleString()} FCFA</td>
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