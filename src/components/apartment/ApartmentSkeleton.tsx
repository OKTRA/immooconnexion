import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ApartmentSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="h-3 w-1/4 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )
}