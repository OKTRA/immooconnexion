import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    console.log('🔔 Webhook received from Orange Money')
    
    // Get the webhook payload
    const payload = await req.json()
    console.log('📦 Webhook payload:', payload)

    // Verify webhook signature
    const signature = req.headers.get('x-orange-money-signature')
    if (!signature) {
      console.error('❌ Missing webhook signature')
      throw new Error('Missing webhook signature')
    }
    console.log('🔑 Webhook signature:', signature)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse metadata
    let metadata
    try {
      metadata = JSON.parse(payload.metadata || '{}')
      console.log('📋 Parsed metadata:', metadata)
    } catch (e) {
      console.error('❌ Error parsing metadata:', e)
      metadata = {}
    }

    // Validate required fields
    if (!payload.order_id || !payload.status) {
      throw new Error('Missing required fields in webhook payload')
    }

    // Process payment status
    const paymentStatus = payload.status === 'SUCCESSFUL' ? 'paid' : 'failed'
    console.log(`💰 Payment status: ${paymentStatus}`)

    // Update payment notification
    if (metadata.agency_id) {
      console.log('🏢 Updating payment status for agency:', metadata.agency_id)
      
      const { error: notificationError } = await supabaseClient
        .from('admin_payment_notifications')
        .insert({
          payment_id: payload.order_id,
          agency_id: metadata.agency_id,
          amount: parseInt(payload.amount),
          status: paymentStatus,
          payment_method: 'orange_money'
        })

      if (notificationError) {
        console.error('❌ Error updating payment notification:', notificationError)
        throw notificationError
      }

      // If payment successful and registration data present, create agency
      if (paymentStatus === 'paid' && metadata.registration_data) {
        console.log('✨ Processing successful registration payment')
        
        try {
          // Create agency
          const { data: agency, error: agencyError } = await supabaseClient
            .from('agencies')
            .insert({
              name: metadata.registration_data.agency_name,
              address: metadata.registration_data.agency_address,
              phone: metadata.registration_data.agency_phone,
              email: metadata.registration_data.email,
              country: metadata.registration_data.country,
              city: metadata.registration_data.city,
              subscription_plan_id: metadata.plan_id,
              status: 'active'
            })
            .select()
            .single()

          if (agencyError) {
            console.error('❌ Error creating agency:', agencyError)
            throw agencyError
          }

          console.log('✅ Agency created:', agency)

          // Create admin user profile
          if (agency) {
            const { error: profileError } = await supabaseClient
              .from('profiles')
              .insert({
                email: metadata.registration_data.email,
                agency_id: agency.id,
                role: 'admin'
              })

            if (profileError) {
              console.error('❌ Error creating admin profile:', profileError)
              throw profileError
            }

            console.log('👤 Admin profile created')
          }
        } catch (error) {
          console.error('❌ Error in agency/profile creation:', error)
          throw error
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})