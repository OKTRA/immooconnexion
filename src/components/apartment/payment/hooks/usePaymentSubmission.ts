import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PaymentFormData } from "../types"

export function usePaymentSubmission() {
  return useMutation(async (data: PaymentFormData) => {
    const { email, password, agency_name, agency_address, agency_phone, country, city, first_name, last_name } = data

    // Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
        }
      }
    })

    if (signUpError) throw signUpError

    if (!authData.user) {
      throw new Error("Erreur lors de la création du compte")
    }

    // Create agency
    const { data: agency, error: agencyError } = await supabase
      .from('agencies')
      .insert([{
        name: agency_name,
        address: agency_address,
        phone: agency_phone,
        email,
        country,
        city,
        status: 'active'
      }])
      .select()
      .single()

    if (agencyError) throw agencyError

    // Update user profile with agency_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        agency_id: agency.id,
        role: 'admin',
        first_name,
        last_name,
        phone_number: agency_phone,
        status: 'active'
      })
      .eq('id', authData.user?.id)

    if (profileError) throw profileError

    return { user: authData.user, agency }
  })
}
