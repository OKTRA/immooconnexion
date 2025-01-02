import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("PayDunya IPN Webhook starting...")

function verifyPayDunyaSignature(payload: any, signature: string): boolean {
  const masterKey = Deno.env.get('PAYDUNYA_MASTER_KEY')
  const privateKey = Deno.env.get('PAYDUNYA_PRIVATE_KEY')
  
  // Implement PayDunya signature verification according to their documentation
  // This is a placeholder - implement actual verification logic
  return true
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log("Received PayDunya IPN notification:", payload)

    // Vérifier la signature PayDunya
    const paydunyaSignature = req.headers.get('X-PAYDUNYA-SIGNATURE')
    if (!paydunyaSignature || !verifyPayDunyaSignature(payload, paydunyaSignature)) {
      throw new Error("Invalid PayDunya signature")
    }

    if (payload.status === "completed") {
      // Mettre à jour le statut de l'agence
      const { error: updateError } = await supabaseClient
        .from('agencies')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', payload.custom_data.agency_id)

      if (updateError) {
        console.error("Error updating agency status:", updateError)
        throw updateError
      }

      // Créer un enregistrement de paiement
      const { error: paymentError } = await supabaseClient
        .from('payment_history')
        .insert({
          agency_id: payload.custom_data.agency_id,
          amount: payload.amount,
          status: 'completed',
          provider: 'paydunya',
          transaction_id: payload.transaction_id,
          payment_method: payload.payment_method,
          created_at: new Date().toISOString()
        })

      if (paymentError) {
        console.error("Error recording payment:", paymentError)
        throw paymentError
      }

      console.log("Successfully processed PayDunya payment for agency:", payload.custom_data.agency_id)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200
      }
    )
  } catch (error) {
    console.error("Error in PayDunya webhook:", error)
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400
      }
    )
  }
})