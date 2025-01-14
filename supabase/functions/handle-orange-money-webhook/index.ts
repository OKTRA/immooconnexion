import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Received Orange Money webhook:', payload)

    // Vérification de la signature du webhook
    const signature = req.headers.get('x-orange-money-signature')
    if (!signature) {
      console.error('Missing webhook signature')
      throw new Error('Missing webhook signature')
    }

    console.log('Webhook signature:', signature)

    // Création du client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extraction des métadonnées
    let metadata;
    try {
      metadata = JSON.parse(payload.metadata || '{}')
      console.log('Parsed metadata:', metadata)
    } catch (e) {
      console.error('Error parsing metadata:', e)
      metadata = {}
    }

    // Mise à jour du statut du paiement dans la base de données
    if (metadata.agency_id) {
      console.log('Updating payment status for agency:', metadata.agency_id)
      
      const { error: updateError } = await supabaseClient
        .from('admin_payment_notifications')
        .insert({
          payment_id: payload.order_id,
          agency_id: metadata.agency_id,
          amount: parseInt(payload.amount),
          status: payload.status === 'SUCCESSFUL' ? 'paid' : 'failed',
          payment_method: 'orange_money'
        })

      if (updateError) {
        console.error('Error updating payment status:', updateError)
        throw updateError
      }

      // Si le paiement est réussi et qu'il y a des données d'inscription
      if (payload.status === 'SUCCESSFUL' && metadata.registration_data) {
        console.log('Processing successful registration payment')
        
        // Créer l'agence
        const { data: agency, error: agencyError } = await supabaseClient
          .from('agencies')
          .insert({
            name: metadata.registration_data.agency_name,
            address: metadata.registration_data.agency_address,
            country: metadata.registration_data.country,
            city: metadata.registration_data.city,
            status: 'active'
          })
          .select()
          .single()

        if (agencyError) {
          console.error('Error creating agency:', agencyError)
          throw agencyError
        }

        console.log('Agency created:', agency)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})