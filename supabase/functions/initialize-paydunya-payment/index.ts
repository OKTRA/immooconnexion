import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Initialize PayDunya Payment Function Started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, agency_id, metadata } = await req.json()
    
    // Get PayDunya API keys from environment variables
    const masterKey = Deno.env.get("PAYDUNYA_MASTER_KEY")?.trim()
    const privateKey = Deno.env.get("PAYDUNYA_PRIVATE_KEY")?.trim()
    const publicKey = Deno.env.get("PAYDUNYA_PUBLIC_KEY")?.trim()
    const token = Deno.env.get("PAYDUNYA_TOKEN")?.trim()

    console.log("PayDunya Keys loaded:", {
      masterKeyLength: masterKey?.length,
      privateKeyLength: privateKey?.length,
      publicKeyLength: publicKey?.length,
      tokenLength: token?.length
    })

    if (!masterKey || !privateKey || !publicKey || !token) {
      throw new Error("Missing PayDunya API keys")
    }

    // Get the origin from the request headers or URL
    const origin = req.headers.get("origin") || new URL(req.url).origin
    console.log("Request origin:", origin)

    // Remove any trailing slashes and ensure proper URL format
    const baseUrl = origin.replace(/\/$/, "")
    console.log("Base URL for callbacks:", baseUrl)

    const payload = {
      master_key: masterKey,
      private_key: privateKey,
      public_key: publicKey,
      token: token,
      invoice: {
        total_amount: amount,
        description: description,
        callback_url: `${baseUrl}/api/payment-callback`,
        cancel_url: `${baseUrl}/payment-cancelled`,
        return_url: `${baseUrl}/payment-success`,
      },
      store: {
        name: "Gestion Immobilière",
        tagline: "Location et gestion immobilière",
        phone: metadata?.agency_data?.phone || "",
        postal_address: metadata?.agency_data?.address || "",
        logo_url: "https://your-logo-url.com/logo.png",
      },
      custom_data: {
        agency_id,
        metadata
      },
    }

    console.log("Sending request to PayDunya with payload:", {
      ...payload,
      master_key: "***",
      private_key: "***",
      public_key: "***",
      token: "***"
    })

    const response = await fetch("https://app.paydunya.com/api/v1/checkout-invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log("PayDunya API Response:", data)

    if (!response.ok) {
      throw new Error(data.message || "Failed to create PayDunya invoice")
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error) {
    console.error("Error in PayDunya payment initialization:", error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})