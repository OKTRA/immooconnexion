import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomerInfo } from "@/utils/cinetpay"

interface CustomerFormProps {
  customerInfo: CustomerInfo
  onChange: (info: CustomerInfo) => void
}

export function CustomerForm({ customerInfo, onChange }: CustomerFormProps) {
  const handleChange = (field: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...customerInfo, [field]: e.target.value })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          placeholder="Entrez votre nom"
          value={customerInfo.name}
          onChange={handleChange('name')}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="surname">Prénom <span className="text-red-500">*</span></Label>
        <Input
          id="surname"
          placeholder="Entrez votre prénom"
          value={customerInfo.surname}
          onChange={handleChange('surname')}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          value={customerInfo.email}
          onChange={handleChange('email')}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Téléphone <span className="text-red-500">*</span></Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+225 XX XX XX XX XX"
          value={customerInfo.phone}
          onChange={handleChange('phone')}
          required
        />
      </div>
    </div>
  )
}