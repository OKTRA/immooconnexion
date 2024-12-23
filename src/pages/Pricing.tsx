import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { PublicNavbar } from "@/components/home/PublicNavbar"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function Pricing() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
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
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {plan.max_properties === -1 
                    ? "Propriétés illimitées" 
                    : `Jusqu'à ${plan.max_properties} propriétés`}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">FCFA/mois</span>
                </p>
                <Link to="/login">
                  <Button className="mt-6 w-full">
                    Commencer
                  </Button>
                </Link>
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
                      : `Jusqu'à ${plan.max_tenants} locataires`}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}