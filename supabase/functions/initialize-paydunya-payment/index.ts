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

    console.log("Received payment request:", { amount, description, agency_id })

    // Get API keys from environment
    const masterKey = Deno.env.get('PAYDUNYA_MASTER_KEY')
    const privateKey = Deno.env.get('PAYDUNYA_PRIVATE_KEY')
    const publicKey = Deno.env.get('PAYDUNYA_PUBLIC_KEY')
    const token = Deno.env.get('PAYDUNYA_TOKEN')

    // Validate API keys
    if (!masterKey || !privateKey || !publicKey || !token) {
      console.error("Missing PayDunya API keys")
      throw new Error("Configuration PayDunya manquante")
    }

    // Log API keys presence (not the actual values)
    console.log("PayDunya API keys validation:", {
      hasMasterKey: !!masterKey,
      hasPrivateKey: !!privateKey,
      hasPublicKey: !!publicKey,
      hasToken: !!token,
      masterKeyLength: masterKey.length,
      privateKeyLength: privateKey.length,
      publicKeyLength: publicKey.length,
      tokenLength: token.length
    })

    // Build PayDunya request payload
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

    console.log("Sending request to PayDunya API:", {
      url: "https://app.paydunya.com/api/v1/checkout-invoice/create",
      payload: JSON.stringify(payload)
    })

    // Send request to PayDunya
    const response = await fetch("https://app.paydunya.com/api/v1/checkout-invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": masterKey.trim(),
        "PAYDUNYA-PRIVATE-KEY": privateKey.trim(),
        "PAYDUNYA-PUBLIC-KEY": publicKey.trim(),
        "PAYDUNYA-TOKEN": token.trim(),
      },
      body: JSON.stringify(payload),
    })

    const paydunyaResponse = await response.json()
    console.log("PayDunya API response:", paydunyaResponse)

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
      console.error("PayDunya error response:", paydunyaResponse)
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