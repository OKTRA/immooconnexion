import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { createHmac } from "https://deno.land/std@0.208.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paydunya-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log("PayDunya IPN Webhook starting...")

function verifyPayDunyaSignature(payload: any, signature: string): boolean {
  try {
    const masterKey = Deno.env.get('PAYDUNYA_MASTER_KEY')?.trim()
    if (!masterKey) {
      console.error("PAYDUNYA_MASTER_KEY not found in environment")
      return false
    }

    // Log for debugging
    console.log("Verifying PayDunya signature:")
    console.log("Received signature:", signature)
    console.log("Payload:", JSON.stringify(payload))

    // Create HMAC using master key
    const hmac = createHmac("sha512", masterKey)
    hmac.update(JSON.stringify(payload))
    const calculatedSignature = hmac.digest("hex")

    console.log("Calculated signature:", calculatedSignature)
    
    // For testing, we'll accept all signatures
    // In production, uncomment the following line:
    return signature === calculatedSignature
  } catch (error) {
    console.error("Error verifying signature:", error)
    return false
  }
}

serve(async (req) => {
  // Log request details
  console.log("Received request method:", req.method)
  console.log("Received headers:", Object.fromEntries(req.headers.entries()))

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get and parse request body
    const rawBody = await req.text()
    console.log("Received raw body:", rawBody)

    let payload
    try {
      payload = JSON.parse(rawBody)
    } catch (e) {
      console.log("Error parsing JSON:", e)
      throw new Error("Invalid JSON payload")
    }

    console.log("Processing PayDunya IPN notification:", payload)

    // Verify PayDunya signature
    const paydunyaSignature = req.headers.get('x-paydunya-signature')
    if (!paydunyaSignature) {
      console.log("No PayDunya signature provided")
      throw new Error("Missing PayDunya signature")
    }

    if (!verifyPayDunyaSignature(payload, paydunyaSignature)) {
      throw new Error("Invalid PayDunya signature")
    }

    // Process the payment notification
    if (payload.status === "completed") {
      // Update agency status if payment is for agency subscription
      if (payload.custom_data?.agency_id) {
        const { error: updateError } = await supabase
          .from('agencies')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', payload.custom_data.agency_id)

        if (updateError) {
          console.error("Error updating agency status:", updateError)
          throw updateError
        }
      }

      // Record the payment
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert({
          agency_id: payload.custom_data?.agency_id,
          amount: payload.amount,
          status: 'completed',
          provider: 'paydunya',
          transaction_id: payload.token,
          payment_method: payload.mode,
          created_at: new Date().toISOString()
        })

      if (paymentError) {
        console.error("Error recording payment:", paymentError)
        throw paymentError
      }

      console.log("Successfully processed PayDunya payment")
    }

    // Send success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Webhook processed successfully"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200
      }
    )
  } catch (error) {
    console.error("Error processing webhook:", error)
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: error.message.includes("Invalid") ? 400 : 500
      }
    )
  }
})