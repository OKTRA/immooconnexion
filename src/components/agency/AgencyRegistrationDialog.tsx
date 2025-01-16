import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AdminAccountFields } from '../pricing/agency-form/AdminAccountFields'
import { AgencyInfoFields } from '../pricing/agency-form/AgencyInfoFields'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'

interface FormData {
  email: string
  password: string
  confirm_password: string
  agency_name: string
  agency_address: string
  agency_phone: string
  country: string
  city: string
  first_name: string
  last_name: string
}

export function AgencyRegistrationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirm_password: '',
    agency_name: '',
    agency_address: '',
    agency_phone: '',
    country: '',
    city: '',
    first_name: '',
    last_name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirm_password) {
        throw new Error("Les mots de passe ne correspondent pas")
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      // Create agency
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .insert([{
          name: formData.agency_name,
          address: formData.agency_address,
          phone: formData.agency_phone,
          country: formData.country,
          city: formData.city,
          status: 'pending',
          subscription_plan_id: 'free'
        }])
        .select()
        .single()

      if (agencyError) throw agencyError

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          agency_id: agency.id,
          role: 'admin'
        })
        .eq('id', authData.user?.id)

      if (profileError) throw profileError

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous allez être redirigé.",
      })

      setTimeout(() => {
        onClose()
        navigate('/login')
      }, 2000)

    } catch (error: any) {
      console.error('Registration error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer votre compte agence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AdminAccountFields 
            form={{ 
              getValues: () => formData, 
              setValue: (field, value) => setFormData(prev => ({ ...prev, [field]: value })) 
            }} 
          />
          <AgencyInfoFields 
            form={{ 
              getValues: () => formData, 
              setValue: (field, value) => setFormData(prev => ({ ...prev, [field]: value })) 
            }} 
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}