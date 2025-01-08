import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptHeaderProps {
  tenant: {
    nom: string;
    prenom: string;
    telephone: string;
  };
  agencyId?: string;
}

export function ReceiptHeader({ tenant, agencyId }: ReceiptHeaderProps) {
  const { data: agency } = useQuery({
    queryKey: ['agency', agencyId],
    queryFn: async () => {
      if (!agencyId) return null;
      
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', agencyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!agencyId
  });

  return (
    <div className="space-y-4 mb-8">
      {agency && (
        <div className="text-center mb-4">
          {agency.logo_url && (
            <img 
              src={agency.logo_url} 
              alt={agency.name} 
              className="h-16 mx-auto mb-2"
            />
          )}
          <h3 className="font-bold">{agency.name}</h3>
          {agency.address && <p className="text-sm">{agency.address}</p>}
          {agency.phone && <p className="text-sm">Tél: {agency.phone}</p>}
        </div>
      )}
      
      <div className="text-center">
        <h2 className="text-2xl font-bold">Reçu de Paiement</h2>
        <p className="text-lg">
          Date: {format(new Date(), "d MMM yyyy", { locale: fr })}
        </p>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg">
          <span className="font-bold">Locataire:</span> {tenant.prenom} {tenant.nom}
        </p>
        <p className="text-lg">
          <span className="font-bold">Téléphone:</span> {tenant.telephone}
        </p>
      </div>
    </div>
  );
}