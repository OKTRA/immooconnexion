import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Orange Money Payment Function starting...")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, metadata } = await req.json()
    console.log("Received request with:", { amount, description, metadata })

    const clientId = Deno.env.get('ORANGE_MONEY_CLIENT_ID')
    const clientSecret = Deno.env.get('ORANGE_MONEY_CLIENT_SECRET')

    console.log("Checking environment variables:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret
    })

    if (!clientId || !clientSecret) {
      console.error("Missing Orange Money configuration")
      throw new Error('Configuration Orange Money manquante')
    }

    // 1. Obtenir le token d'accès
    console.log("Requesting access token...")
    const tokenResponse = await fetch('https://api.orange.com/oauth/v3/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    })

    const tokenData = await tokenResponse.json()
    console.log("Token response status:", tokenResponse.status)
    
    if (!tokenResponse.ok) {
      console.error("Token error response:", tokenData)
      throw new Error(`Error getting access token: ${JSON.stringify(tokenData)}`)
    }

    const accessToken = tokenData.access_token
    console.log("Access token obtained successfully")

    const origin = req.headers.get('origin') || 'http://localhost:5173'
    console.log("Using origin:", origin)

    // 2. Initialiser le paiement avec le token d'accès
    const requestBody = {
      merchant_key: clientId,
      currency: "OUV",
      order_id: `TRANS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

    const paymentResponse = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const responseData = await paymentResponse.json()
    console.log("Orange Money API response:", {
      status: paymentResponse.status,
      statusText: paymentResponse.statusText,
      data: responseData
    })

    if (!paymentResponse.ok) {
      console.error("Error response from Orange Money API:", responseData)
      throw new Error(`Error from Orange Money API: ${JSON.stringify(responseData)}`)
    }

    return new Response(
      JSON.stringify({
        payment_url: responseData.payment_url,
        pay_token: responseData.pay_token,
        order_id: requestBody.order_id
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200
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