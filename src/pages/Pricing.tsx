import { PublicHeader } from "@/components/layout/PublicHeader"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Pricing() {
  const { toast } = useToast()
  
  const { data: plans = [] } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleStartSubscription = async (plan: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount: plan.price,
          description: `Abonnement au plan ${plan.name}`
        }
      })

      if (error) throw error

      if (data.code === '201') {
        // @ts-ignore - CinetPay est chargé via CDN
        new window.CinetPay({
          apikey: data.apikey,
          site_id: data.site_id,
          notify_url: data.notify_url,
          return_url: data.return_url,
          trans_id: data.trans_id,
          amount: data.amount,
          currency: 'XOF',
          channels: 'ALL',
          description: data.description,
          lang: 'fr',
        }).getCheckout({
          onClose: () => {
            toast({
              title: "Paiement annulé",
              description: "Vous avez fermé la fenêtre de paiement",
            })
          },
          onSuccess: (data: any) => {
            console.log("Succès du paiement:", data)
            toast({
              title: "Paiement réussi",
              description: "Votre paiement a été effectué avec succès",
            })
          },
          onError: (error: any) => {
            console.error('Erreur CinetPay:', error)
            toast({
              title: "Erreur de paiement",
              description: "Une erreur est survenue lors du paiement",
              variant: "destructive",
            })
          },
        })
      }
    } catch (error: any) {
      console.error('Error initializing payment:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Tarifs simples et transparents
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choisissez le plan qui correspond le mieux à vos besoins. Tous nos plans incluent une période d'essai de 14 jours.
            </p>
          </div>
          <div className="isolate mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-3xl p-8 ring-1 ring-gray-200 bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold leading-8 text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">FCFA/mois</span>
                </div>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {plan.max_properties === -1 
                    ? "Propriétés illimitées" 
                    : `${plan.max_properties} propriété${plan.max_properties > 1 ? 's' : ''} maximum`}
                </p>
                <Button 
                  className="mt-6 w-full"
                  onClick={() => handleStartSubscription(plan)}
                >
                  Commencer
                </Button>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-blue-600" />
                      {feature}
                    </li>
                  ))}
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-blue-600" />
                    {plan.max_tenants === -1 
                      ? "Locataires illimités" 
                      : `Jusqu'à ${plan.max_tenants} locataire${plan.max_tenants > 1 ? 's' : ''}`}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}