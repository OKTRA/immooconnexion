import { Check } from "lucide-react"

interface StepsProps {
  currentStep: number
}

export function Steps({ currentStep }: StepsProps) {
  const steps = [
    { id: 1, name: 'Authentification' },
    { id: 2, name: 'Informations du profil' }
  ]

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0
              ${currentStep >= step.id ? 'border-primary' : 'border-gray-200'}`}>
              <span className="text-sm font-medium text-primary">Étape {step.id}</span>
              <span className="text-sm font-medium">
                {step.name}
                {currentStep > step.id && (
                  <Check className="ml-2 inline-block h-4 w-4 text-green-500" />
                )}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}