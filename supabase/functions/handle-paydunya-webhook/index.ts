import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("PayDunya IPN Webhook starting...")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer les données de la notification PayDunya
    const payload = await req.json()
    console.log("Received PayDunya IPN notification:", payload)

    // Vérifier la signature PayDunya (à implémenter selon la documentation PayDunya)
    // const isValidSignature = verifyPayDunyaSignature(payload)
    // if (!isValidSignature) {
    //   throw new Error("Invalid PayDunya signature")
    // }

    // Traiter le statut du paiement
    if (payload.status === "completed") {
      // Mettre à jour le statut de l'abonnement dans la base de données
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