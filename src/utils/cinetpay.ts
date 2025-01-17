interface CinetPayInitResponse {
  data?: {
    payment_token: string;
    metadata: any;
  };
  error?: any;
}

interface CinetPayInitParams {
  amount: number;
  description: string;
  metadata: any;
}

export async function initializeCinetPay({ 
  amount, 
  description, 
  metadata 
}: CinetPayInitParams): Promise<CinetPayInitResponse> {
  try {
    const response = await fetch('https://apidxwaaogboeoctlhtz.supabase.co/functions/v1/initialize-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        description,
        metadata,
        payment_method: 'cinetpay'
      }),
    })

    if (!response.ok) {
      throw new Error('Payment initialization failed')
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error('Error initializing CinetPay payment:', error)
    return { error }
  }
}