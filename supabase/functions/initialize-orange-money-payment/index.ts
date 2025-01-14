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
    const merchantKey = '77bcbfa2'

    if (!clientId || !clientSecret || !authHeader) {
      console.error('Missing Orange Money configuration')
      throw new Error('Configuration Orange Money manquante')
    }

    const { amount, description, metadata } = await req.json() as RequestBody

    console.log('Request data:', { amount, description, metadata })

    // Get the origin from the request headers
    const origin = req.headers.get('origin') || 'https://www.immoo.pro'
    console.log('Request origin:', origin)

    // Get access token with proper error handling and logging
    console.log('Requesting access token...')
    const tokenResponse = await fetch('https://api.orange.com/oauth/v3/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: 'grant_type=client_credentials'
    })

    console.log('Token response status:', tokenResponse.status)
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token response error:', errorText)
      throw new Error(`Échec de l'obtention du token: ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('Token obtained successfully')

    if (!tokenData.access_token) {
      throw new Error('Pas de token d\'accès dans la réponse')
    }

    // Generate unique order ID with timestamp and random string
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const returnUrl = `${origin}/payment-success`
    const cancelUrl = `${origin}/payment-cancel`
    const notifUrl = `${origin}/payment-notify`

    console.log('URLs configured:', { returnUrl, cancelUrl, notifUrl })
    
    const requestBody = {
      merchant_key: merchantKey,
      currency: "OUV",
      order_id: orderId,
      amount: amount.toString(),
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notif_url: notifUrl,
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
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Payment API response status:', paymentResponse.status)

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text()
      console.error('Payment API error:', errorText)
      throw new Error(`Erreur de l'API Orange Money: ${errorText}`)
    }

    const paymentData = await paymentResponse.json()
    console.log('Payment response:', paymentData)

    return new Response(JSON.stringify(paymentData), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      },
      status: 200
    })

  } catch (error) {
    console.error('Detailed error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})