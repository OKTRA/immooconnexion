import { Building2, Users, Calendar, Shield, BarChart3, Settings, 
  Home, CreditCard, FileText, PieChart, Bell, MessageSquare,
  Receipt, ClipboardList, Key, Percent, Wallet, FileSpreadsheet
} from "lucide-react"
import { FeatureCard } from "./FeatureCard"

export function FeaturesGrid() {
  const features = [
    {
      icon: Building2,
      title: "Gestion Immobilière Complète",
      description: "Gérez efficacement tous vos biens immobiliers : maisons, appartements, studios, etc."
    },
    {
      icon: Users,
      title: "Gestion des Locataires",
      description: "Suivez vos locataires, leurs paiements et leurs contrats en un seul endroit"
    },
    {
      icon: Home,
      title: "Gestion des Appartements",
      description: "Gérez facilement vos immeubles et leurs unités avec notre système intuitif"
    },
    {
      icon: CreditCard,
      title: "Paiements Simplifiés",
      description: "Intégration avec CinetPay et PayDunya pour des paiements sécurisés"
    },
    {
      icon: Receipt,
      title: "Facturation Automatisée",
      description: "Générez et envoyez automatiquement les factures et les reçus"
    },
    {
      icon: FileSpreadsheet,
      title: "Rapports Détaillés",
      description: "Accédez à des rapports complets sur vos revenus, dépenses et occupation"
    },
    {
      icon: ClipboardList,
      title: "Gestion des États des Lieux",
      description: "Documentez l'état des propriétés avec photos et descriptions détaillées"
    },
    {
      icon: Key,
      title: "Gestion des Cautions",
      description: "Suivez les cautions versées et leur remboursement"
    },
    {
      icon: Percent,
      title: "Commissions Automatiques",
      description: "Calcul automatique des commissions sur les locations et ventes"
    },
    {
      icon: Bell,
      title: "Notifications en Temps Réel",
      description: "Restez informé des paiements, retards et événements importants"
    },
    {
      icon: MessageSquare,
      title: "Communication Intégrée",
      description: "Communiquez facilement avec vos locataires et propriétaires"
    },
    {
      icon: Wallet,
      title: "Gestion Financière",
      description: "Suivez vos revenus, dépenses et la rentabilité de chaque bien"
    }
  ]

  return (
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
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  )
}
