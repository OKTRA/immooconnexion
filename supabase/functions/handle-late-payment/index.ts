import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { leaseId, periodIds, paymentMethod, paymentDate, amount } = await req.json()

    // 1. Récupérer les informations du bail
    const { data: lease, error: leaseError } = await supabaseClient
      .from('apartment_leases')
      .select('*')
      .eq('id', leaseId)
      .single()

    if (leaseError) throw leaseError

    // 2. Créer le paiement
    const { data: payment, error: paymentError } = await supabaseClient
      .from('apartment_lease_payments')
      .insert({
        lease_id: leaseId,
        amount,
        payment_date: paymentDate,
        status: 'paid',
        payment_method: paymentMethod,
        agency_id: lease.agency_id,
        payment_type: 'rent',
        payment_status_type: 'paid_late'
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    // 3. Mettre à jour le statut des périodes
    const { error: periodsError } = await supabaseClient
      .from('apartment_payment_periods')
      .update({ 
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .in('id', periodIds)

    if (periodsError) throw periodsError

    return new Response(
      JSON.stringify({ success: true, payment }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})