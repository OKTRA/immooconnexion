import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { emails, agencyName, status } = await req.json()

    if (!emails || !emails.length || !agencyName) {
      throw new Error('Missing required parameters')
    }

    const subject = status === 'blocked' 
      ? `Accès bloqué - ${agencyName}`
      : `Accès rétabli - ${agencyName}`

    const html = status === 'blocked'
      ? `<p>Votre accès à l'agence ${agencyName} a été temporairement bloqué. Veuillez contacter l'administrateur pour plus d'informations.</p>`
      : `<p>Votre accès à l'agence ${agencyName} a été rétabli. Vous pouvez désormais vous reconnecter à votre compte.</p>`

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Acme <onboarding@resend.dev>',
        to: emails,
        subject,
        html,
      }),
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})