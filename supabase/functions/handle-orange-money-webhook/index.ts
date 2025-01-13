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
      throw new Error('Missing webhook signature')
    }

    // Création du client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Mise à jour du statut du paiement dans la base de données
    const { error: updateError } = await supabaseClient
      .from('apartment_lease_payments')
      .update({
        status: payload.status === 'SUCCESSFUL' ? 'paid' : 'failed',
        payment_date: new Date().toISOString(),
        payment_method: 'orange_money'
      })
      .eq('id', payload.metadata.payment_id)

    if (updateError) {
      console.error('Error updating payment status:', updateError)
      throw updateError
    }

    // Création d'une notification de paiement
    if (payload.status === 'SUCCESSFUL') {
      const { error: notificationError } = await supabaseClient
        .from('payment_notifications')
        .insert({
          tenant_id: payload.metadata.tenant_id,
          lease_id: payload.metadata.lease_id,
          type: 'payment_received',
          amount: payload.amount,
          due_date: new Date().toISOString()
        })

      if (notificationError) {
        console.error('Error creating payment notification:', notificationError)
        throw notificationError
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