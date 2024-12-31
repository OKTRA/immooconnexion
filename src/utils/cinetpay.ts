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
  return new Promise((resolve, reject) => {
    if (window.CinetPay) {
      resolve();
      return;
    }

    let attempts = 0;
    const maxAttempts = 50; // 5 secondes maximum

    const checkInterval = setInterval(() => {
      attempts++;
      console.log("Tentative de chargement de CinetPay:", attempts);

      if (window.CinetPay) {
        clearInterval(checkInterval);
        console.log("CinetPay SDK chargé avec succès");
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        reject(new Error("Le service de paiement n'est pas disponible. Veuillez vérifier votre connexion et réessayer."));
      }
    }, 100);
  });
};

export const initializeCinetPay = async (config: CinetPayConfig, callbacks: CinetPayCallbacks) => {
  try {
    console.log("Initialisation de CinetPay...");
    await waitForCinetPay();

    console.log("Configuration de CinetPay avec:", {
      apikey: config.apikey,
      site_id: config.site_id,
      mode: config.mode
    });

    // Configuration initiale
    window.CinetPay.setConfig({
      apikey: config.apikey,
      site_id: config.site_id,
      notify_url: config.notify_url,
      mode: config.mode
    });

    console.log("Démarrage du checkout avec:", {
      amount: config.amount,
      currency: config.currency,
      description: config.description
    });

    // Démarrage du checkout
    window.CinetPay.getCheckout({
      transaction_id: config.trans_id,
      amount: config.amount,
      currency: config.currency,
      channels: 'ALL',
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
    });

    // Gestion des réponses
    window.CinetPay.waitResponse((data: any) => {
      console.log("Réponse reçue de CinetPay:", data);
      if (data.status === "REFUSED") {
        callbacks.onError(data);
      } else if (data.status === "ACCEPTED") {
        callbacks.onSuccess(data);
      }
    });

    window.CinetPay.onError((error: any) => {
      console.error("Erreur CinetPay:", error);
      callbacks.onError(error);
    });

    window.CinetPay.onClose(() => {
      console.log("Fenêtre de paiement fermée");
      callbacks.onClose();
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation de CinetPay:", error);
    callbacks.onError(error);
  }
}