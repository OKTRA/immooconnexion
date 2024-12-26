import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Home, DollarSign, Store } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { PropertySaleDialog } from "./PropertySaleDialog"

export function PropertiesForSale() {
  const navigate = useNavigate()
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [showSaleDialog, setShowSaleDialog] = useState(false)
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties-for-sale'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_for_sale', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const handleSale = (propertyId: string) => {
    setSelectedProperty(propertyId)
    setShowSaleDialog(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Prix de vente</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {property.bien}
                </div>
              </TableCell>
              <TableCell>{property.type}</TableCell>
              <TableCell>{property.ville}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {property.sale_price?.toLocaleString()} FCFA
                </div>
              </TableCell>
              <TableCell>
                <Badge>{property.statut}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/biens/${property.id}`)}
                  >
                    Détails
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSale(property.id)}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Vendre
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {properties.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Aucun bien à vendre
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedProperty && (
        <PropertySaleDialog
          propertyId={selectedProperty}
          open={showSaleDialog}
          onOpenChange={setShowSaleDialog}
        />
      )}
    </Card>
  )
}