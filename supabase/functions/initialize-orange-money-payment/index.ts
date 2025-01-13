import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  amount: number
  description: string
  metadata?: {
    agency_id?: string
    customer_email?: string
    customer_name?: string
    customer_phone?: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get('ORANGE_MONEY_CLIENT_ID')
    const clientSecret = Deno.env.get('ORANGE_MONEY_CLIENT_SECRET')
    const authHeader = Deno.env.get('ORANGE_MONEY_AUTH_HEADER')

    if (!clientId || !clientSecret || !authHeader) {
      throw new Error('Missing Orange Money configuration')
    }

    const { amount, description, metadata } = await req.json() as RequestBody

    // Log the incoming request data
    console.log('Request data:', { amount, description, metadata })

    // Get access token
    const tokenResponse = await fetch('https://api.orange.com/oauth/v3/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: 'grant_type=client_credentials'
    })

    const tokenData = await tokenResponse.json()
    console.log('Token response:', tokenData)

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token')
    }

    // Generate unique order ID
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Clean and format merchant key
    const cleanMerchantKey = clientId.trim().replace(/[\s\n\r]+/g, '')
    
    const requestBody = {
      merchant_key: cleanMerchantKey,
      currency: "OUV",
      order_id: orderId,
      amount: amount.toString(),
      return_url: "https://example.com/return",
      cancel_url: "https://example.com/cancel",
      notif_url: "https://example.com/notify",
      lang: "fr",
      reference: orderId,
      metadata: JSON.stringify(metadata || {})
    }

    console.log('Payment request body:', requestBody)

    const paymentResponse = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const paymentData = await paymentResponse.json()
    console.log('Payment response:', paymentData)

    if (!paymentResponse.ok) {
      throw new Error(`Error from Orange Money API: ${JSON.stringify(paymentData)}`)
    }

    return new Response(JSON.stringify(paymentData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})