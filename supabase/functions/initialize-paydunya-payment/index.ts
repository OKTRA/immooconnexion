import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      amount,
      description,
      metadata
    } = await req.json()

    const PAYDUNYA_PRIVATE_KEY = Deno.env.get('PAYDUNYA_PRIVATE_KEY')
    const PAYDUNYA_TOKEN = Deno.env.get('PAYDUNYA_TOKEN')

    // Validate required environment variables
    if (!PAYDUNYA_PRIVATE_KEY || !PAYDUNYA_TOKEN) {
      console.error("Missing PayDunya credentials:", {
        hasPrivateKey: !!PAYDUNYA_PRIVATE_KEY,
        hasToken: !!PAYDUNYA_TOKEN
      })
      throw new Error("PayDunya API keys are not configured")
    }

    console.log("Initializing PayDunya payment with:", { amount, description })

    const payload = {
      store: {
        name: "Gestion Immobilière",
      },
      invoice: {
        total_amount: amount,
        description: description,
        callback_url: `${req.url.split('/functions/')[0]}/functions/v1/handle-paydunya-webhook`,
        cancel_url: `${new URL(req.url).origin}/payment-cancelled`,
        return_url: `${new URL(req.url).origin}/payment-success`,
      },
      custom_data: metadata,
    }

    console.log("PayDunya request payload:", payload)
    console.log("Using PayDunya API URL:", 'https://app.paydunya.com/api/v1/checkout-invoice/create')

    const response = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log("PayDunya API response:", data)

    if (data.response_code !== "00") {
      console.error("PayDunya error:", data)
      throw new Error(data.response_text || "PayDunya API error")
    }

    return new Response(
      JSON.stringify({ 
        token: data.token
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error("PayDunya error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})