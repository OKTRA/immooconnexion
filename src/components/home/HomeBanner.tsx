import { Button } from "@/components/ui/button"

export function HomeBanner() {
  return (
    <div className="relative h-[400px] w-full mb-8">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/lovable-uploads/05ccf5ff-f3aa-45af-8afe-d3d4ac242474.png')",
          filter: "brightness(0.7)"
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl font-bold mb-4">Locations de Prestige</h1>
        <p className="text-xl mb-8">
          Découvrez des propriétés d'exception pour des séjours inoubliables
        </p>
      </div>
    </div>
  )
}