import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OwnerHeaderProps {
  owner: {
    first_name: string
    last_name: string
    email?: string
    phone_number?: string
  }
}

export function OwnerHeader({ owner }: OwnerHeaderProps) {
  if (!owner) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {owner.first_name} {owner.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{owner.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Téléphone</p>
            <p className="text-sm text-muted-foreground">{owner.phone_number || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}