import { Button } from "@/components/ui/button"
import { Building2, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function HomeBanner() {
  const navigate = useNavigate()

  return (
    <div className="relative h-[400px] w-full mb-8 rounded-xl overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/lovable-uploads/d592c87e-59cd-4922-b2a9-051762d83934.png')`,
          filter: "brightness(0.65)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-12 lg:px-16">
        <div className="max-w-2xl space-y-5 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            La Référence des Professionnels Immobiliers
          </h1>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed">
            Les meilleurs promoteurs et agences gèrent leurs biens sur Immoo. Découvrez des offres immobilières sélectionnées par des professionnels.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/properties")}
            >
              <Building2 className="mr-2 h-5 w-5" />
              Explorer les biens
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => navigate("/pricing")}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Gérer mes biens
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}