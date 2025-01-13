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
    const clientSecret = Deno.env.get('ORANGE_MONEY_CLIENT_SECRET')
    const authHeader = Deno.env.get('ORANGE_MONEY_AUTH_HEADER')

    if (!clientId || !clientSecret || !authHeader) {
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

    console.log("Orange Money configuration found")

    // Génération d'un ID de transaction unique
    const transId = `TRANS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log("Generated transaction ID:", transId)

    // Construction du corps de la requête pour Orange Money
    const requestBody = {
      merchant_key: clientId,
      currency: "XOF",
      order_id: transId,
      amount: amount,
      return_url: `${req.headers.get('origin')}/payment-return`,
      cancel_url: `${req.headers.get('origin')}/payment-cancel`,
      notif_url: `${req.headers.get('origin')}/api/orange-money-webhook`,
      metadata: metadata,
      description: description
    }

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

    console.log("Payment initialization successful:", { transId, paymentData })

    return new Response(
      JSON.stringify({
        code: '201',
        message: 'Paiement initialisé',
        payment_url: paymentData.payment_url,
        payment_token: paymentData.pay_token,
        transaction_id: transId
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