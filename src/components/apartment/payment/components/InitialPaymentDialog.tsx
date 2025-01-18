import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PaymentFormFields } from "../PaymentFormFields"
import { useState } from "react"
import { PaymentFormData } from "../types"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface InitialPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InitialPaymentDialog({
  open,
  onOpenChange,
  onSuccess
}: InitialPaymentDialogProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    email: "",
    password: "",
    confirm_password: "",
    agency_name: "",
    agency_address: "",
    agency_phone: "",
    country: "",
    city: "",
    first_name: "",
    last_name: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            agency_name: formData.agency_name,
            agency_address: formData.agency_address,
            agency_phone: formData.agency_phone,
            country: formData.country,
            city: formData.city
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Inscription de l'agence</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentFormFields formData={formData} setFormData={setFormData} />
            <button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
