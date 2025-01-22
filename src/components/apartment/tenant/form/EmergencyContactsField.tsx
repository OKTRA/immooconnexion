import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

interface EmergencyContactsFieldProps {
  contacts: EmergencyContact[]
  onChange: (contacts: EmergencyContact[]) => void
}

export function EmergencyContactsField({ contacts, onChange }: EmergencyContactsFieldProps) {
  const addContact = () => {
    onChange([...contacts, { name: "", phone: "", relationship: "" }])
  }

  const removeContact = (index: number) => {
    onChange(contacts.filter((_, i) => i !== index))
  }

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    onChange(newContacts)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Contacts d'urgence</Label>
        <Button type="button" variant="outline" onClick={addContact}>
          Ajouter un contact
        </Button>
      </div>

      {contacts.map((contact, index) => (
        <Card key={index} className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-4">
              <div>
                <Label>Nom</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                  placeholder="Nom du contact"
                />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input
                  value={contact.phone}
                  onChange={(e) => updateContact(index, "phone", e.target.value)}
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div>
                <Label>Relation</Label>
                <Input
                  value={contact.relationship}
                  onChange={(e) => updateContact(index, "relationship", e.target.value)}
                  placeholder="Relation avec le locataire"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeContact(index)}
              className="ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}