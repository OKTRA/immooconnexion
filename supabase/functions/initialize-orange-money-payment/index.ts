import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Orange Money Payment Function starting...")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, metadata } = await req.json()
    console.log("Received request with:", { amount, description, metadata })

    // Génération d'un ID de transaction unique
    const orderId = `TRANS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log("Generated order ID:", orderId)

    // Récupération des clés d'API depuis les variables d'environnement
    const merchantKey = Deno.env.get('ORANGE_MONEY_CLIENT_ID')
    const authHeader = Deno.env.get('ORANGE_MONEY_AUTH_HEADER')

    console.log("Checking environment variables:", {
      hasMerchantKey: !!merchantKey,
      hasAuthHeader: !!authHeader
    })

    if (!merchantKey || !authHeader) {
      console.error("Missing Orange Money configuration")
      throw new Error('Configuration Orange Money manquante')
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173'
    console.log("Using origin:", origin)

    // Construction du corps de la requête pour Orange Money
    const requestBody = {
      merchant_key: merchantKey,
      currency: "OUV",
      order_id: orderId,
      amount: amount,
      return_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-cancel`,
      notif_url: `${origin}/api/orange-money-webhook`,
      lang: "fr",
      reference: description || "Payment Immoov",
      metadata: metadata
    }

    console.log("Sending request to Orange Money API:", {
      ...requestBody,
      merchant_key: '[REDACTED]'
    })

    // Appel à l'API Orange Money
    const response = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authHeader}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const responseData = await response.json()
    console.log("Orange Money API response:", {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    })

    if (!response.ok) {
      console.error("Error response from Orange Money API:", responseData)
      throw new Error(`Error from Orange Money API: ${JSON.stringify(responseData)}`)
    }

    return new Response(
      JSON.stringify({
        payment_url: responseData.payment_url,
        pay_token: responseData.pay_token,
        order_id: orderId
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 201
      }
    )
  } catch (error) {
    console.error("Detailed error in initialize-orange-money-payment function:", {
      error: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500
      }
    )
  }
})