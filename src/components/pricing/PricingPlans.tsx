import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PricingCard } from "./PricingCard"

interface PricingPlansProps {
  onSelectPlan: (plan: any) => void
}

export function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const { data: plans = [], isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Des Plans Adaptés à Vos Besoins
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Choisissez le plan qui correspond le mieux à votre activité. 
            Tous nos plans incluent une période d'essai de 14 jours.
          </p>
        </div>
        
        <div className="isolate mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={onSelectPlan}
            />
          ))}
        </div>
      </div>
    </div>
  )
}