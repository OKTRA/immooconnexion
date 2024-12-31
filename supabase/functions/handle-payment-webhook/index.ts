import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  payment_id: string
  status: string
  subscription_plan_id: string
  agency_name: string
  agency_address: string
  country: string
  city: string
  user_email: string
  user_first_name: string
  user_last_name: string
  user_phone: string
  password: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: WebhookPayload = await req.json()
    console.log('Received webhook payload:', payload)

    if (payload.status !== 'success') {
      throw new Error('Payment not successful')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 1. Create the auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.user_email,
      password: payload.password,
      email_confirm: true
    })

    if (authError) throw authError
    console.log('Auth user created:', authUser)

    // 2. Create the agency
    const { data: agency, error: agencyError } = await supabaseAdmin
      .from('agencies')
      .insert({
        name: payload.agency_name,
        address: payload.agency_address,
        country: payload.country,
        city: payload.city,
        subscription_plan_id: payload.subscription_plan_id,
        phone: payload.user_phone,
        email: payload.user_email,
        status: 'active'
      })
      .select()
      .single()

    if (agencyError) throw agencyError
    console.log('Agency created:', agency)

    // 3. Update the profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: payload.user_first_name,
        last_name: payload.user_last_name,
        phone_number: payload.user_phone,
        role: 'admin',
        agency_id: agency.id,
        status: 'active'
      })
      .eq('id', authUser.user.id)

    if (profileError) throw profileError

    // 4. Create the administrator entry
    const { error: adminError } = await supabaseAdmin
      .from('administrators')
      .insert({
        id: authUser.user.id,
        agency_id: agency.id,
        is_super_admin: false
      })

    if (adminError) throw adminError

    // 5. Notify super admins
    const { data: superAdmins } = await supabaseAdmin
      .from('administrators')
      .select('id')
      .eq('is_super_admin', true)

    for (const admin of superAdmins || []) {
      await supabaseAdmin
        .from('admin_notifications')
        .insert({
          admin_id: admin.id,
          type: 'new_agency_created'
        })
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Agency and user created successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})