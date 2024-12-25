import { supabase } from "@/integrations/supabase/client";

export const useInitialPayments = () => {
  const createInitialPayments = async (
    tenantId: string, 
    agencyId: string, 
    propertyId: string, 
    fraisAgence: string
  ) => {
    try {
      // Créer le paiement des frais d'agence
      const { error: agencyFeesError } = await supabase
        .from('contracts')
        .insert({
          tenant_id: tenantId,
          property_id: propertyId,
          montant: parseFloat(fraisAgence),
          type: 'frais_agence',
          statut: 'payé',
          agency_id: agencyId,
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
        });

      if (agencyFeesError) throw agencyFeesError;

      // Récupérer le montant de la caution pour la propriété
      const { data: property } = await supabase
        .from('properties')
        .select('caution')
        .eq('id', propertyId)
        .single();

      if (property?.caution) {
        // Créer le paiement de la caution
        const { error: cautionError } = await supabase
          .from('contracts')
          .insert({
            tenant_id: tenantId,
            property_id: propertyId,
            montant: property.caution,
            type: 'caution',
            statut: 'payé',
            agency_id: agencyId,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
          });

        if (cautionError) throw cautionError;
      }
    } catch (error) {
      console.error('Erreur lors de la création des paiements initiaux:', error);
      throw error;
    }
  };

  return { createInitialPayments };
};