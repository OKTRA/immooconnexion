import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ApartmentSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="h-[100px] bg-muted" />
      <CardContent className="h-[100px] bg-muted mt-2" />
    </Card>
  )
}