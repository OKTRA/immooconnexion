import { supabase } from "@/integrations/supabase/client";

export const createTenantContract = async (
  propertyId: string,
  tenantId: string,
  montant: number
) => {
  const { error: contractError } = await supabase
    .from('contracts')
    .insert([
      {
        property_id: propertyId,
        tenant_id: tenantId,
        montant,
        type: 'location',
      }
    ]);

  if (contractError) throw contractError;

  // Update property status
  const { error: propertyError } = await supabase
    .from('properties')
    .update({ statut: 'occupé' })
    .eq('id', propertyId);

  if (propertyError) throw propertyError;
};