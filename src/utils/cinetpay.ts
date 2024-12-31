export interface CustomerInfo {
  name: string
  surname: string
  email: string
  phone: string
}

export interface CinetPayConfig {
  apikey: string
  site_id: string
  notify_url: string
  return_url: string
  trans_id: string
  amount: number
  currency: string
  channels: string
  description: string
  customer_name: string
  customer_surname: string
  customer_email: string
  customer_phone_number: string
  customer_address: string
  customer_city: string
  customer_country: string
  customer_state: string
  customer_zip_code: string
  lang: string
  metadata: string
}

export interface CinetPayCallbacks {
  onClose: () => void
  onSuccess: (data: any) => void
  onError: (error: any) => void
}

export const initializeCinetPay = (config: CinetPayConfig, callbacks: CinetPayCallbacks) => {
  // @ts-ignore - CinetPay est chargé via CDN
  new window.CinetPay({
    ...config,
  }).getCheckout(callbacks)
}