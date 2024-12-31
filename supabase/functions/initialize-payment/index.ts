import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const CINETPAY_API_KEY = Deno.env.get('CINETPAY_API_KEY')
const CINETPAY_SITE_ID = Deno.env.get('CINETPAY_SITE_ID')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, customer } = await req.json()

    // Générer un ID de transaction unique
    const transactionId = `TR${Date.now()}`

    const payload = {
      apikey: CINETPAY_API_KEY,
      site_id: CINETPAY_SITE_ID,
      transaction_id: transactionId,
      amount: amount,
      currency: 'XOF',
      description: description,
      customer_name: customer.name,
      customer_surname: customer.surname,
      customer_email: customer.email,
      customer_phone_number: customer.phone,
      channels: 'ALL',
      notify_url: `${req.headers.get('origin')}/api/payment-webhook`,
      return_url: `${req.headers.get('origin')}/payment-success`,
      lang: 'fr',
    }

    console.log('Initializing CinetPay payment with payload:', payload)

    const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log('CinetPay response:', data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error initializing payment:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})