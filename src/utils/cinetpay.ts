import { supabase } from "@/integrations/supabase/client"

export interface CustomerInfo {
  name: string
  surname: string
  email: string
  phone: string
}

interface CinetPayInitParams {
  amount: number
  description: string
  metadata: any
}

interface CinetPayInitResponse {
  data?: {
    payment_token: string
    metadata: any
  }
  error?: any
}

export async function initializeCinetPay({
  amount,
  description,
  metadata
}: CinetPayInitParams): Promise<CinetPayInitResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('initialize-payment', {
      body: {
        amount,
        description,
        metadata
      }
    })

    if (error) {
      console.error("Error initializing CinetPay payment:", error)
      throw error
    }

    return { data }
  } catch (error) {
    console.error("Error in initializeCinetPay:", error)
    return { error }
  }
}