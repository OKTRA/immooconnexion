import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Initialize Payment Function starting...")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, metadata } = await req.json()
    console.log("Received request with:", { amount, description, metadata })

    // Validation des données requises
    if (!amount || !description) {
      console.error("Missing required fields:", { amount, description })
      return new Response(
        JSON.stringify({
          code: '400',
          message: 'Montant et description requis'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Récupération des clés d'API depuis les variables d'environnement
    const apiKey = Deno.env.get('CINETPAY_API_KEY')
    const siteId = Deno.env.get('CINETPAY_SITE_ID')

    if (!apiKey || !siteId) {
      console.error("Missing CinetPay configuration")
      return new Response(
        JSON.stringify({
          code: '500',
          message: 'Configuration CinetPay manquante'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    console.log("CinetPay configuration found")

    // Génération d'un ID de transaction unique
    const transId = `TRANS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log("Generated transaction ID:", transId)

    // Construction de la réponse
    const response = {
      code: '201',
      message: 'Paiement initialisé',
      apikey: apiKey,
      site_id: siteId,
      notify_url: `${req.headers.get('origin')}/api/payment-webhook`,
      return_url: `${req.headers.get('origin')}/payment-return`,
      trans_id: transId,
      amount: amount,
      currency: 'XOF',
      description: description,
      metadata: metadata
    }

    console.log("Payment initialization successful:", { transId, amount })

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 201
      },
    )
  } catch (error) {
    console.error("Error in initialize-payment function:", error)
    
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