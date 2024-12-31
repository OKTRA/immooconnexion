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
    const { amount, description } = await req.json()

    // Validation des données requises
    if (!amount || !description) {
      throw new Error('Données manquantes')
    }

    // Récupération des clés d'API depuis les variables d'environnement
    const apiKey = Deno.env.get('CINETPAY_API_KEY')
    const siteId = Deno.env.get('CINETPAY_SITE_ID')

    if (!apiKey || !siteId) {
      throw new Error('Configuration CinetPay manquante')
    }

    // Génération d'un ID de transaction unique
    const transId = `TRANS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("Initializing payment with:", {
      amount,
      description,
      transId
    })

    // Construction de la réponse selon la documentation CinetPay
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
      description: description
    }

    console.log("Payment initialized successfully")

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error("Error in initialize-payment function:", error)

    return new Response(
      JSON.stringify({
        code: '400',
        message: error.message
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})