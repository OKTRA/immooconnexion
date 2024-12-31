import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('Webhook received:', body)

    // Validate payment status
    if (body.status !== 'ACCEPTED') {
      console.log('Payment not accepted:', body.status)
      return new Response(
        JSON.stringify({ message: 'Payment not accepted' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let metadata
    try {
      metadata = typeof body.metadata === 'string' ? JSON.parse(body.metadata) : body.metadata
      console.log('Parsed metadata:', metadata)
    } catch (error) {
      console.error('Error parsing metadata:', error)
      return new Response(
        JSON.stringify({ message: 'Invalid metadata format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create user
    const { data: userData, error: userError } = await supabaseClient.auth.admin.createUser({
      email: metadata.email,
      password: metadata.password,
      email_confirm: true
    })

    if (userError) {
      console.error('Error creating user:', userError)
      return new Response(
        JSON.stringify({ message: 'Error creating user', error: userError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('User created:', userData)

    // Create agency
    const { data: agencyData, error: agencyError } = await supabaseClient
      .from('agencies')
      .insert([{
        name: metadata.agencyName,
        email: metadata.email,
        phone: metadata.phone,
        address: metadata.address,
        status: 'active'
      }])
      .select()
      .single()

    if (agencyError) {
      console.error('Error creating agency:', agencyError)
      return new Response(
        JSON.stringify({ message: 'Error creating agency', error: agencyError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Agency created:', agencyData)

    // Update profile with agency_id
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        agency_id: agencyData.id,
        role: 'admin',
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        phone_number: metadata.phone
      })
      .eq('id', userData.user.id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      return new Response(
        JSON.stringify({ message: 'Error updating profile', error: profileError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create administrator record
    const { error: adminError } = await supabaseClient
      .from('administrators')
      .insert([{
        id: userData.user.id,
        agency_id: agencyData.id,
        is_super_admin: false
      }])

    if (adminError) {
      console.error('Error creating administrator:', adminError)
      return new Response(
        JSON.stringify({ message: 'Error creating administrator', error: adminError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Success', userId: userData.user.id, agencyId: agencyData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})