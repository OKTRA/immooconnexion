import { PublicHeader } from "@/components/layout/PublicHeader"
import { Button } from "@/components/ui/button"
import { 
  Building2, Users, Calendar, Shield, BarChart3, Settings, 
  Home, CreditCard, FileText, PieChart, Bell, MessageSquare,
  Receipt, ClipboardList, Key, Percent, Wallet, FileSpreadsheet
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { PaymentDialog } from "@/components/payment/PaymentDialog"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
      title: "Gestion Immobilière Complète",
      description: "Gérez efficacement tous vos biens immobiliers : maisons, appartements, studios, etc."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Gestion des Locataires",
      description: "Suivez vos locataires, leurs paiements et leurs contrats en un seul endroit"
    },
    {
      icon: <Home className="h-6 w-6 text-primary" />,
      title: "Gestion des Appartements",
      description: "Gérez facilement vos immeubles et leurs unités avec notre système intuitif"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Paiements Simplifiés",
      description: "Intégration avec CinetPay et PayDunya pour des paiements sécurisés"
    },
    {
      icon: <Receipt className="h-6 w-6 text-primary" />,
      title: "Facturation Automatisée",
      description: "Générez et envoyez automatiquement les factures et les reçus"
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-primary" />,
      title: "Rapports Détaillés",
      description: "Accédez à des rapports complets sur vos revenus, dépenses et occupation"
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-primary" />,
      title: "Gestion des États des Lieux",
      description: "Documentez l'état des propriétés avec photos et descriptions détaillées"
    },
    {
      icon: <Key className="h-6 w-6 text-primary" />,
      title: "Gestion des Cautions",
      description: "Suivez les cautions versées et leur remboursement"
    },
    {
      icon: <Percent className="h-6 w-6 text-primary" />,
      title: "Commissions Automatiques",
      description: "Calcul automatique des commissions sur les locations et ventes"
    },
    {
      icon: <Bell className="h-6 w-6 text-primary" />,
      title: "Notifications en Temps Réel",
      description: "Restez informé des paiements, retards et événements importants"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Communication Intégrée",
      description: "Communiquez facilement avec vos locataires et propriétaires"
    },
    {
      icon: <Wallet className="h-6 w-6 text-primary" />,
      title: "Gestion Financière",
      description: "Suivez vos revenus, dépenses et la rentabilité de chaque bien"
    }
  ]

  const handleStartSubscription = (plan: any) => {
    setSelectedPlan(plan)
    setShowPaymentDialog(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
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
              La Solution Complète pour la Gestion Immobilière
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Immoo révolutionne la gestion immobilière avec une suite complète d'outils professionnels. 
              Simplifiez votre gestion quotidienne et développez votre activité.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 sm:py-24 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Fonctionnalités Avancées
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Découvrez tous les outils dont vous avez besoin pour une gestion immobilière efficace
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={cn(
                  "relative p-6 hover:shadow-lg transition-shadow duration-300",
                  "bg-white/50 backdrop-blur-sm"
                )}
              >
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
              Choisissez le plan qui correspond le mieux à votre activité. 
              Tous nos plans incluent une période d'essai de 14 jours.
            </p>
          </div>
          
          <div className="isolate mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "rounded-3xl p-8 ring-1 ring-gray-200",
                  "hover:shadow-lg transition-shadow duration-300",
                  "bg-white/50 backdrop-blur-sm"
                )}
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