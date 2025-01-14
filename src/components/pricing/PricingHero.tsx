import { Button } from "@/components/ui/button"

export function PricingHero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Des Plans Adaptés à Vos Besoins
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choisissez le plan qui correspond le mieux à votre activité. 
            Tous nos plans incluent une période d'essai de 14 jours.
          </p>
        </div>
      </div>
    </div>
  )
}