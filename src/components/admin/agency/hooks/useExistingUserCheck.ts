import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useExistingUserCheck = () => {
  const { toast } = useToast();

  const checkExistingUser = async (email: string) => {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      toast({
        title: "Erreur",
        description: "Cet email existe déjà dans le système. Utilisez un autre email.",
        variant: "destructive",
      });
      return true;
    }
    return false;
  };

  return { checkExistingUser };
};