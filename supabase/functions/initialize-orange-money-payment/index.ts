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

    // 1. Get access token
    console.log("Requesting access token...")
    const credentials = btoa(`${clientId}:${clientSecret}`)
    console.log("Using credentials (first 10 chars):", credentials.substring(0, 10))

    const tokenResponse = await fetch('https://api.orange.com/oauth/v3/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      }).toString()
    })

    console.log("Token response status:", tokenResponse.status)
    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      console.error("Token error response:", tokenData)
      throw new Error(`Error getting access token: ${JSON.stringify(tokenData)}`)
    }

    const accessToken = tokenData.access_token
    console.log("Access token obtained (first 10 chars):", accessToken.substring(0, 10))

    const origin = req.headers.get('origin') || 'http://localhost:5173'
    console.log("Using origin:", origin)

    // 2. Initialize payment with access token
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const requestBody = {
      merchant_key: clientId.trim().replace(/\s+/g, ''), // Remove all whitespace
      currency: "OUV",
      order_id: orderId,
      amount: amount.toString(), // Convert to string as required by the API
      return_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-cancel`,
      notif_url: `${origin}/api/orange-money-webhook`,
      lang: "fr",
      reference: description || "Payment Immoov",
      metadata: JSON.stringify(metadata), // Ensure metadata is stringified
      payment_mode: "test"
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

    const testPaymentUrl = `https://webpayment-ow-sb.orange-money.com/payment/pay_token/${responseData.pay_token}`

    return new Response(
      JSON.stringify({
        payment_url: testPaymentUrl,
        pay_token: responseData.pay_token,
        order_id: orderId
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