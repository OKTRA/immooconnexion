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
    registration_data?: any
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Request received:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    })

    const clientId = Deno.env.get('ORANGE_MONEY_CLIENT_ID')
    const clientSecret = Deno.env.get('ORANGE_MONEY_CLIENT_SECRET')
    const authHeader = Deno.env.get('ORANGE_MONEY_AUTH_HEADER')
    const merchantKey = '77bcbfa2'

    console.log('Environment check:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasAuthHeader: !!authHeader,
      merchantKey
    })

    if (!clientId || !clientSecret || !authHeader) {
      throw new Error('Configuration Orange Money manquante')
    }

    const { amount, description, metadata } = await req.json() as RequestBody
    
    if (!amount || amount <= 0) {
      throw new Error('Montant invalide')
    }

    const origin = req.headers.get('origin') || 'https://www.immoo.pro'
    console.log('Request origin:', origin)

    const returnUrl = `${origin}/login`
    const cancelUrl = `${origin}/pricing`
    const notifUrl = `${origin}/api/orange-money-webhook`

    console.log('URLs configured:', { returnUrl, cancelUrl, notifUrl })

    // Get access token
    const tokenResponse = await fetch('https://api.orange.com/oauth/v3/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: 'grant_type=client_credentials'
    })

    console.log('Token response status:', tokenResponse.status)
    const tokenData = await tokenResponse.json()
    console.log('Token response:', {
      success: !!tokenData.access_token,
      error: tokenData.error
    })

    if (!tokenData.access_token) {
      throw new Error('Échec de l\'authentification Orange Money')
    }

    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare payment request
    const paymentRequest = {
      merchant_key: merchantKey,
      currency: "OUV",
      order_id: orderId,
      amount: amount.toString(),
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notif_url: notifUrl,
      lang: "fr",
      reference: orderId,
      metadata: JSON.stringify({
        ...metadata,
        registration_data: metadata?.registration_data ? {
          ...metadata.registration_data,
          password: undefined,
          confirm_password: undefined
        } : undefined
      })
    }

    console.log('Initiating payment request:', {
      ...paymentRequest,
      metadata: 'HIDDEN'
    })

    const paymentResponse = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(paymentRequest)
    })

    console.log('Payment API response status:', paymentResponse.status)
    const paymentData = await paymentResponse.json()
    console.log('Payment API response:', paymentData)

    if (!paymentResponse.ok) {
      throw new Error(`Erreur de paiement Orange Money: ${paymentData.message || 'Erreur inconnue'}`)
    }

    return new Response(JSON.stringify(paymentData), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    })

  } catch (error) {
    console.error('Payment error:', error)
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