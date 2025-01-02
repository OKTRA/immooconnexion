import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("PayDunya payment initialization function starting...")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    const { amount, description, agency_id, metadata } = await req.json()

    console.log("Initializing PayDunya payment:", { amount, description, agency_id })

    const masterKey = Deno.env.get('PAYDUNYA_MASTER_KEY')
    const privateKey = Deno.env.get('PAYDUNYA_PRIVATE_KEY')
    const publicKey = Deno.env.get('PAYDUNYA_PUBLIC_KEY')
    const token = Deno.env.get('PAYDUNYA_TOKEN')

    if (!masterKey || !privateKey || !publicKey || !token) {
      console.error("Missing PayDunya configuration")
      throw new Error("PayDunya configuration manquante")
    }

    console.log("PayDunya configuration loaded, preparing request...")

    // Construire la requête PayDunya
    const payload = {
      invoice: {
        total_amount: amount,
        description: description,
        items: {
          item_0: {
            name: description,
            quantity: 1,
            unit_price: amount,
            total_price: amount,
          },
        },
      },
      store: {
        name: "ImmoGestion",
      },
      custom_data: {
        agency_id,
        metadata
      },
      actions: {
        cancel_url: `${req.headers.get('origin')}/pricing`,
        return_url: `${req.headers.get('origin')}/pricing`,
        callback_url: `${req.headers.get('origin')}/api/handle-paydunya-webhook`,
      },
    }

    console.log("Sending request to PayDunya API...")

    // Envoyer la requête à PayDunya
    const response = await fetch("https://app.paydunya.com/api/v1/checkout-invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": masterKey,
        "PAYDUNYA-PRIVATE-KEY": privateKey,
        "PAYDUNYA-PUBLIC-KEY": publicKey,
        "PAYDUNYA-TOKEN": token,
      },
      body: JSON.stringify(payload),
    })

    const paydunyaResponse = await response.json()
    console.log("PayDunya response:", paydunyaResponse)

    if (paydunyaResponse.response_code === "00") {
      return new Response(
        JSON.stringify({ 
          success: true,
          payment_url: paydunyaResponse.response_text,
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      )
    } else {
      console.error("PayDunya error:", paydunyaResponse)
      throw new Error(paydunyaResponse.response_text || "Erreur lors de l'initialisation du paiement")
    }
  } catch (error) {
    console.error("Error processing PayDunya payment:", error)
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: error.message.includes("configuration") ? 400 : 500,
      }
    )
  }
})