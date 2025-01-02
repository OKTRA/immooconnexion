import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paydunya-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log("PayDunya IPN Webhook starting...")

function verifyPayDunyaSignature(payload: any, signature: string): boolean {
  // Pour le test, on retourne true pour permettre à PayDunya de vérifier l'accessibilité
  // En production, il faudra implémenter la vérification réelle
  console.log("Received signature:", signature)
  console.log("Received payload:", JSON.stringify(payload))
  return true
}

serve(async (req) => {
  // Log the request method and headers for debugging
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
    // For testing purposes, log the raw request body
    const rawBody = await req.text()
    console.log("Received raw body:", rawBody)

    let payload
    try {
      payload = JSON.parse(rawBody)
    } catch (e) {
      console.log("Error parsing JSON:", e)
      payload = {}
    }

    console.log("Processing PayDunya IPN notification:", payload)

    // Get PayDunya signature from headers
    const paydunyaSignature = req.headers.get('x-paydunya-signature')
    console.log("PayDunya signature:", paydunyaSignature)

    // For testing, we'll accept all requests to verify accessibility
    // Later we'll implement proper signature verification
    if (!paydunyaSignature) {
      console.log("No signature provided, but accepting for testing")
    }

    // Send a success response to acknowledge receipt
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Webhook received successfully"
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
    console.error("Error in PayDunya webhook:", error)
    
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
        status: 500
      }
    )
  }
})