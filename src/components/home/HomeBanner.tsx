import { Button } from "@/components/ui/button"
import { Building2, MapPin, Phone } from "lucide-react"

export function HomeBanner() {
  return (
    <div className="relative h-[400px] w-full mb-8 rounded-xl overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/lovable-uploads/cfd536c2-5c73-4d0b-9529-0e4269ed3372.png')",
          filter: "brightness(0.65)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-12 lg:px-16">
        <div className="max-w-2xl space-y-5 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Trouvez Votre Prochain Chez-Vous
          </h1>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed">
            Découvrez une sélection exclusive de propriétés de qualité, adaptées à tous les styles de vie
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