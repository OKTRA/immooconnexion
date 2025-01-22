import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface ContactFieldsProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    emergency_contacts?: Array<{
      name: string
      phone: string
      relationship: string
    }>
  }
  setFormData: (data: any) => void
}

export function ContactFields({ formData, setFormData }: ContactFieldsProps) {
  const addEmergencyContact = () => {
    setFormData({
      ...formData,
      emergency_contacts: [
        ...(formData.emergency_contacts || []),
        { name: "", phone: "", relationship: "" }
      ]
    })
  }

  const removeEmergencyContact = (index: number) => {
    const newContacts = [...(formData.emergency_contacts || [])]
    newContacts.splice(index, 1)
    setFormData({
      ...formData,
      emergency_contacts: newContacts
    })
  }

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const newContacts = [...(formData.emergency_contacts || [])]
    newContacts[index] = {
      ...newContacts[index],
      [field]: value
    }
    setFormData({
      ...formData,
      emergency_contacts: newContacts
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Téléphone</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Contacts d'urgence</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addEmergencyContact}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un contact
          </Button>
        </div>

        {formData.emergency_contacts?.map((contact, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeEmergencyContact(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
              <Label>Nom du contact</Label>
              <Input
                value={contact.name}
                onChange={(e) => updateEmergencyContact(index, "name", e.target.value)}
                placeholder="Nom complet"
              />
            </div>

            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                value={contact.phone}
                onChange={(e) => updateEmergencyContact(index, "phone", e.target.value)}
                placeholder="Numéro de téléphone"
                type="tel"
              />
            </div>

            <div className="space-y-2">
              <Label>Relation</Label>
              <Input
                value={contact.relationship}
                onChange={(e) => updateEmergencyContact(index, "relationship", e.target.value)}
                placeholder="Ex: Frère, Soeur, Parent..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}