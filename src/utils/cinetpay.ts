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
  customer_name?: string
  customer_surname?: string
  customer_email?: string
  customer_phone_number?: string
  customer_address?: string
  customer_city?: string
  customer_country?: string
  customer_state?: string
  customer_zip_code?: string
  lang: string
  metadata: string
  mode: 'PRODUCTION' | 'TEST'
}

export interface CinetPayCallbacks {
  onClose: () => void
  onSuccess: (data: any) => void
  onError: (error: any) => void
}

declare global {
  interface Window {
    CinetPay: any
  }
}

const waitForCinetPay = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.CinetPay) {
      resolve();
      return;
    }

    // Add script tag if not already present
    if (!document.getElementById('cinetpay-script')) {
      const script = document.createElement('script');
      script.id = 'cinetpay-script';
      script.src = 'https://cdn.cinetpay.com/seamless/latest/sdk.js';
      script.async = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    }

    const checkInterval = setInterval(() => {
      if (window.CinetPay) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      throw new Error("CinetPay SDK failed to load");
    }, 10000);
  });
};

export const initializeCinetPay = async (config: CinetPayConfig, callbacks: CinetPayCallbacks) => {
  try {
    console.log("Initializing CinetPay with config:", config);
    
    // Wait for CinetPay SDK to be loaded
    await waitForCinetPay();
    
    console.log("CinetPay SDK loaded successfully");

    // Configuration initiale
    window.CinetPay.setConfig({
      apikey: config.apikey,
      site_id: config.site_id,
      notify_url: config.notify_url,
      mode: config.mode || 'PRODUCTION'
    });

    console.log("CinetPay config set, starting checkout");

    // Démarrage du checkout
    window.CinetPay.getCheckout({
      transaction_id: config.trans_id,
      amount: config.amount,
      currency: config.currency,
      channels: config.channels,
      description: config.description,
      customer_name: config.customer_name,
      customer_surname: config.customer_surname,
      customer_email: config.customer_email,
      customer_phone_number: config.customer_phone_number,
      customer_address: config.customer_address,
      customer_city: config.customer_city,
      customer_country: config.customer_country,
      customer_state: config.customer_state,
      customer_zip_code: config.customer_zip_code,
      metadata: config.metadata
    });

    console.log("CinetPay checkout initialized");

    // Gestion des réponses
    window.CinetPay.waitResponse((data: any) => {
      console.log("CinetPay response received:", data);
      if (data.status === "REFUSED") {
        callbacks.onError(data);
      } else if (data.status === "ACCEPTED") {
        callbacks.onSuccess(data);
      }
    });

    window.CinetPay.onError((error: any) => {
      console.error("CinetPay error:", error);
      callbacks.onError(error);
    });

    window.CinetPay.onClose(() => {
      console.log("CinetPay checkout closed");
      callbacks.onClose();
    });
  } catch (error) {
    console.error("Error initializing CinetPay:", error);
    callbacks.onError(error);
  }
}