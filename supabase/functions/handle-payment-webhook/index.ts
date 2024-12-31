import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  cpm_trans_id: string
  payment_method: string
  cel_phone_num: string
  cpm_phone_prefixe: string
  signature: string
  payment_date: string
  cpm_amount: string
  cpm_currency: string
  cpm_payid: string
  cpm_custom: string
  cpm_result: string
  cpm_trans_status: string
  cpm_error_message: string
  cpm_processing_date: string
  cpm_platform_name: string
  cpm_verification_code: string
  created_at: string
  updated_at: string
  cpm_designation: string
  cpm_site_id: string
  cpm_version: string
  cpm_payment_config: string
  cpm_page_action: string
  cpm_language: string
  cpm_operation_date: string
  metadata: any
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Received webhook payload:', payload)

    // Extract metadata from the custom field
    const metadata = typeof payload.metadata === 'string' ? JSON.parse(payload.metadata) : payload.metadata
    console.log('Extracted metadata:', metadata)

    if (payload.cpm_result !== 'success') {
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

    const { user_data, agency_data, subscription_plan_id } = metadata

    // Create auth user first
    console.log('Creating auth user with data:', user_data)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user_data.email,
      password: user_data.password,
      email_confirm: true,
      user_metadata: {
        first_name: user_data.first_name,
        last_name: user_data.last_name
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      throw authError
    }
    console.log('Auth user created:', authUser)

    // Create agency
    console.log('Creating agency with data:', agency_data)
    const { data: agency, error: agencyError } = await supabaseAdmin
      .from('agencies')
      .insert({
        name: agency_data.name,
        address: agency_data.address,
        country: agency_data.country,
        city: agency_data.city,
        subscription_plan_id: subscription_plan_id,
        phone: user_data.phone,
        email: user_data.email,
        status: 'active'
      })
      .select()
      .single()

    if (agencyError) {
      console.error('Error creating agency:', agencyError)
      throw agencyError
    }
    console.log('Agency created:', agency)

    // Update profile
    console.log('Updating profile for user:', authUser.user.id)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: user_data.first_name,
        last_name: user_data.last_name,
        phone_number: user_data.phone,
        role: 'admin',
        agency_id: agency.id,
        status: 'active'
      })
      .eq('id', authUser.user.id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      throw profileError
    }

    // Create administrator entry
    console.log('Creating administrator entry')
    const { error: adminError } = await supabaseAdmin
      .from('administrators')
      .insert({
        id: authUser.user.id,
        agency_id: agency.id,
        is_super_admin: false
      })

    if (adminError) {
      console.error('Error creating administrator:', adminError)
      throw adminError
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