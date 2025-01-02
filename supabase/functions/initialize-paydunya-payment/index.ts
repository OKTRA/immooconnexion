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

    const PAYDUNYA_MASTER_KEY = Deno.env.get('PAYDUNYA_MASTER_KEY')
    const PAYDUNYA_PRIVATE_KEY = Deno.env.get('PAYDUNYA_PRIVATE_KEY')
    const PAYDUNYA_TOKEN = Deno.env.get('PAYDUNYA_TOKEN')

    if (!PAYDUNYA_MASTER_KEY || !PAYDUNYA_PRIVATE_KEY || !PAYDUNYA_TOKEN) {
      throw new Error("Missing PayDunya API keys")
    }

    // Use a fixed domain for development/testing
    const baseUrl = "https://apidxwaaogboeoctlhtz.supabase.co"
    console.log("Base URL for callbacks:", baseUrl)

    const payload = {
      store: {
        name: "Gestion Immobilière",
      },
      invoice: {
        total_amount: amount,
        description: description,
        callback_url: `${baseUrl}/functions/v1/handle-paydunya-webhook`,
        cancel_url: `${baseUrl}/payment-cancelled`,
        return_url: `${baseUrl}/payment-success`,
      },
      custom_data: metadata,
    }

    console.log("PayDunya payload:", payload)

    const response = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log("PayDunya API response:", data)

    if (data.response_code !== "00") {
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