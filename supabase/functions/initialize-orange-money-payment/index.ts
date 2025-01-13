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

    // Validation des données requises
    if (!amount || !description || !metadata) {
      console.error("Missing required fields:", { amount, description, metadata })
      return new Response(
        JSON.stringify({
          code: '400',
          message: 'Amount, description and metadata are required'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Récupération des clés d'API depuis les variables d'environnement
    const clientId = Deno.env.get('ORANGE_MONEY_CLIENT_ID')
    const authHeader = Deno.env.get('ORANGE_MONEY_AUTH_HEADER')

    if (!clientId || !authHeader) {
      console.error("Missing Orange Money configuration")
      return new Response(
        JSON.stringify({
          code: '500',
          message: 'Configuration Orange Money manquante'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Génération d'un ID de transaction unique
    const orderId = `TRANS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log("Generated order ID:", orderId)

    // Construction du corps de la requête pour Orange Money
    const requestBody = {
      merchant_key: clientId,
      currency: "OUV",
      order_id: orderId,
      amount: amount,
      return_url: `${req.headers.get('origin')}/payment-success`,
      cancel_url: `${req.headers.get('origin')}/payment-cancel`,
      notif_url: `${req.headers.get('origin')}/api/orange-money-webhook`,
      lang: "fr",
      reference: description,
      metadata: metadata
    }

    console.log("Sending request to Orange Money API:", requestBody)

    // Appel à l'API Orange Money pour initialiser le paiement
    const response = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authHeader}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const paymentData = await response.json()
    console.log("Orange Money API response:", paymentData)

    if (!response.ok) {
      console.error("Orange Money API error:", paymentData)
      return new Response(
        JSON.stringify({
          code: '500',
          message: 'Erreur lors de l\'initialisation du paiement',
          details: paymentData
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    return new Response(
      JSON.stringify({
        code: '201',
        message: 'Paiement initialisé',
        payment_url: paymentData.payment_url,
        payment_token: paymentData.pay_token,
        order_id: orderId
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 201
      },
    )
  } catch (error) {
    console.error("Error in initialize-orange-money-payment function:", error)
    
    return new Response(
      JSON.stringify({
        code: '500',
        message: error.message || 'Une erreur est survenue'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500
      },
    )
  }
})