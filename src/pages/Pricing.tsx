import { PublicHeader } from "@/components/layout/PublicHeader"
import { Button } from "@/components/ui/button"
import { Check, Building2, Users, Calendar, Shield, BarChart3, Settings, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { PaymentDialog } from "@/components/payment/PaymentDialog"
import { Card } from "@/components/ui/card"

export default function Pricing() {
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

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

  const features = [
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: "Gestion de Propriétés",
      description: "Gérez efficacement votre portefeuille immobilier avec nos outils professionnels"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Gestion des Locataires",
      description: "Suivez vos locataires, leurs paiements et leurs contrats en un seul endroit"
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Planification Simplifiée",
      description: "Organisez vos visites et vos rendez-vous avec un calendrier intégré"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Sécurité Maximale",
      description: "Vos données sont protégées avec les plus hauts standards de sécurité"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Rapports Détaillés",
      description: "Analysez vos performances avec des rapports personnalisés"
    },
    {
      icon: <Settings className="h-6 w-6 text-primary" />,
      title: "Support Premium",
      description: "Bénéficiez d'une assistance dédiée pour optimiser votre gestion"
    }
  ]

  const handleStartSubscription = (plan: any) => {
    setSelectedPlan(plan)
    setShowPaymentDialog(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Gérez Vos Biens Immobiliers Comme Un Pro
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Immoo vous offre tous les outils nécessaires pour une gestion immobilière efficace et professionnelle. 
              Rejoignez les meilleurs acteurs du secteur.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="relative p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Des Plans Adaptés à Vos Besoins
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choisissez le plan qui correspond le mieux à votre activité. Tous nos plans incluent une période d'essai de 14 jours.
            </p>
          </div>
          
          <div className="isolate mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="rounded-3xl p-8 ring-1 ring-gray-200 hover:shadow-lg transition-shadow duration-300"
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
                <Button 
                  className="mt-6 w-full"
                  onClick={() => handleStartSubscription(plan)}
                >
                  Commencer maintenant
                </Button>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features?.map((feature: string) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" />
                      {feature}
                    </li>
                  ))}
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" />
                    {plan.max_tenants === -1 
                      ? "Locataires illimités" 
                      : `Jusqu'à ${plan.max_tenants} locataire${plan.max_tenants > 1 ? 's' : ''}`}
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" />
                    {plan.max_properties === -1 
                      ? "Propriétés illimitées" 
                      : `Jusqu'à ${plan.max_properties} propriété${plan.max_properties > 1 ? 's' : ''}`}
                  </li>
                  <li className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" />
                    {plan.max_users === -1 
                      ? "Utilisateurs illimités" 
                      : `Jusqu'à ${plan.max_users} utilisateur${plan.max_users > 1 ? 's' : ''}`}
                  </li>
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
        />
      )}
    </div>
  )
}
