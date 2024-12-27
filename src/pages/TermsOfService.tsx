import { PublicHeader } from "@/components/layout/PublicHeader"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Présentation de la Plateforme</h2>
            <p>
              Notre plateforme de gestion immobilière offre une solution complète pour la gestion de biens immobiliers,
              incluant la gestion des locataires, des paiements, des contrats et des propriétés. Cette application est
              destinée aux agences immobilières et aux professionnels du secteur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Services Proposés</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Gestion des biens immobiliers (ajout, modification, suppression)</li>
              <li>Gestion des locataires et des contrats de location</li>
              <li>Suivi des paiements et des loyers</li>
              <li>Gestion des états des lieux et des inspections</li>
              <li>Intégration des paiements via Orange Money</li>
              <li>Génération de rapports et statistiques</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Services de Paiement Orange Money</h2>
            <p>
              Notre plateforme utilise les services de paiement Orange Money pour faciliter les transactions financières.
              En utilisant ces services, vous acceptez les conditions suivantes :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Les transactions sont sécurisées et traitées par Orange Money</li>
              <li>Les paiements sont soumis aux frais et conditions d'Orange Money</li>
              <li>L'historique des transactions est conservé et accessible dans votre espace</li>
              <li>En cas de problème technique, le support Orange Money peut être contacté</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Protection des Données</h2>
            <p>
              Conformément à la réglementation en vigueur, nous nous engageons à :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Protéger les données personnelles des utilisateurs</li>
              <li>Ne collecter que les informations nécessaires au service</li>
              <li>Sécuriser l'accès aux données sensibles</li>
              <li>Permettre aux utilisateurs d'accéder et de modifier leurs données</li>
              <li>Ne pas partager les informations avec des tiers non autorisés</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Responsabilités des Utilisateurs</h2>
            <p>
              En tant qu'utilisateur de la plateforme, vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fournir des informations exactes et à jour</li>
              <li>Respecter la confidentialité de vos identifiants de connexion</li>
              <li>Utiliser la plateforme conformément à la législation en vigueur</li>
              <li>Ne pas tenter de compromettre la sécurité du système</li>
              <li>Signaler tout dysfonctionnement ou anomalie</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Abonnements et Tarification</h2>
            <p>
              Notre plateforme propose différents plans d'abonnement adaptés aux besoins des agences :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Les tarifs sont clairement indiqués sur la page de tarification</li>
              <li>Les abonnements sont facturés selon les conditions choisies</li>
              <li>Les fonctionnalités disponibles dépendent du plan souscrit</li>
              <li>Les modifications de tarifs seront notifiées à l'avance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Support et Assistance</h2>
            <p>
              Notre équipe est disponible pour vous accompagner :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Support technique par email</li>
              <li>Documentation utilisateur accessible en ligne</li>
              <li>Formation et accompagnement disponibles</li>
              <li>Assistance pour l'intégration des paiements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
            <p>
              Pour toute question concernant ces CGU ou nos services, vous pouvez nous contacter :
            </p>
            <ul className="list-none pl-6 mb-4">
              <li>Email : support@votreplateforme.com</li>
              <li>Téléphone : +XXX XX XX XX XX</li>
              <li>Adresse : [Votre adresse]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}