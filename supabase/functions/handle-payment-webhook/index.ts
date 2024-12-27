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
  user_email: string
  user_first_name: string
  user_last_name: string
  user_phone: string
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Vérifier la signature du webhook Orange Money ici
    // TODO: Ajouter la vérification de la signature

    const payload: WebhookPayload = await req.json()
    console.log('Received webhook payload:', payload)

    // Vérifier que le paiement est réussi
    if (payload.status !== 'success') {
      throw new Error('Payment not successful')
    }

    // Créer le client Supabase
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

    // 1. Créer l'agence
    const { data: agency, error: agencyError } = await supabaseAdmin
      .from('agencies')
      .insert({
        name: payload.agency_name,
        subscription_plan_id: payload.subscription_plan_id,
        phone: payload.user_phone,
        email: payload.user_email
      })
      .select()
      .single()

    if (agencyError) throw agencyError
    console.log('Agency created:', agency)

    // 2. Créer l'utilisateur auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.user_email,
      password: crypto.randomUUID(), // Mot de passe temporaire
      email_confirm: true
    })

    if (authError) throw authError
    console.log('Auth user created:', authUser)

    // 3. Mettre à jour le profil
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: payload.user_first_name,
        last_name: payload.user_last_name,
        phone_number: payload.user_phone,
        role: 'admin',
        agency_id: agency.id
      })
      .eq('id', authUser.user.id)

    if (profileError) throw profileError

    // 4. Créer l'entrée dans la table administrators
    const { error: adminError } = await supabaseAdmin
      .from('administrators')
      .insert({
        id: authUser.user.id,
        agency_id: agency.id,
        is_super_admin: false
      })

    if (adminError) throw adminError

    // 5. Envoyer un email avec le lien de réinitialisation du mot de passe
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: payload.user_email
    })

    if (resetError) throw resetError

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