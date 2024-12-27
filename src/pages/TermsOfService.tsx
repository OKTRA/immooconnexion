import { PublicHeader } from "@/components/layout/PublicHeader"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation régissent l'utilisation de notre plateforme de gestion immobilière,
              y compris l'intégration des services de paiement Orange Money.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Services de Paiement</h2>
            <p>
              Notre plateforme utilise les services de paiement Orange Money pour faciliter les transactions financières.
              En utilisant ces services, vous acceptez également les conditions d'utilisation d'Orange Money.
            </p>
            <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Sécurité des Transactions</h3>
            <p>
              Toutes les transactions sont sécurisées et traitées par Orange Money. Nous ne stockons aucune information
              de paiement sensible sur nos serveurs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Protection des Données</h2>
            <p>
              Nous nous engageons à protéger vos données personnelles conformément aux lois et réglementations en vigueur.
              Les informations collectées sont uniquement utilisées dans le cadre de nos services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Responsabilités</h2>
            <p>
              Les utilisateurs sont responsables de la confidentialité de leurs identifiants de connexion et de toutes
              les actions effectuées sur leur compte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Modifications des CGU</h2>
            <p>
              Nous nous réservons le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des
              changements importants par email ou notification sur la plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
            <p>
              Pour toute question concernant ces CGU ou nos services, veuillez nous contacter à l'adresse suivante :
              support@votreplateforme.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}