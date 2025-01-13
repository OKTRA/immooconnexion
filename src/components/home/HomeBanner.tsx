import { Button } from "@/components/ui/button"
import { Building2, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function HomeBanner() {
  const navigate = useNavigate()

  return (
    <div className="relative h-[600px] w-full mb-12 rounded-2xl overflow-hidden shadow-2xl">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ 
          backgroundImage: `url('/lovable-uploads/d592c87e-59cd-4922-b2a9-051762d83934.png')`,
          filter: "brightness(0.6)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            La Référence des<br />
            <span className="text-primary">Professionnels Immobiliers</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">
            Les meilleurs promoteurs et agences gèrent leurs biens sur Immoo. 
            Découvrez des offres immobilières sélectionnées par des professionnels.
          </p>
          <div className="flex flex-wrap gap-5 pt-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 transition-all duration-300 hover:translate-y-[-2px]"
              onClick={() => navigate("/properties")}
            >
              <Building2 className="mr-2 h-5 w-5" />
              Explorer les biens
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/5 hover:bg-white/15 text-white border-white/20 text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px]"
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