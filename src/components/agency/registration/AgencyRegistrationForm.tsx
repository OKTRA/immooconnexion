import { ScrollArea } from "@/components/ui/scroll-area"
import { AgencyBasicInfo } from "./AgencyBasicInfo"
import { AdminAccountInfo } from "./AdminAccountInfo"

interface AgencyRegistrationFormProps {
  formData: {
    name: string
    address: string
    phone: string
    email: string
    adminFirstName: string
    adminLastName: string
    adminEmail: string
    adminPhone: string
  }
  onChange: (field: string, value: string) => void
}

export function AgencyRegistrationForm({ formData, onChange }: AgencyRegistrationFormProps) {
  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Informations de l'agence</h3>
          <AgencyBasicInfo formData={formData} onChange={onChange} />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Compte administrateur</h3>
          <AdminAccountInfo formData={formData} onChange={onChange} />
        </div>
      </div>
    </ScrollArea>
  )
}