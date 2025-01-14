import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { AgencyRegistrationForm } from "./registration/AgencyRegistrationForm"

interface AgencyRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function AgencyRegistrationDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading
}: AgencyRegistrationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhone: ""
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inscription de l'agence</DialogTitle>
        </DialogHeader>

        <AgencyRegistrationForm 
          formData={formData}
          onChange={handleChange}
        />

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}