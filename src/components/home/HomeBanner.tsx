import { Button } from "@/components/ui/button"
import { Building2, MapPin, Phone } from "lucide-react"

export function HomeBanner() {
  return (
    <div className="relative h-[400px] w-full mb-8 rounded-xl overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80')",
          filter: "brightness(0.65)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-12 lg:px-16">
        <div className="max-w-2xl space-y-5 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            La Plateforme de Choix des Professionnels de l'Immobilier
          </h1>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed">
            Rejoignez les meilleurs promoteurs, propriétaires et agences qui gèrent efficacement leurs biens sur Immoo. Accédez aux meilleures offres immobilières, sélectionnées par des professionnels de confiance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Building2 className="mr-2 h-5 w-5" />
              Explorer les biens
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Phone className="mr-2 h-5 w-5" />
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}