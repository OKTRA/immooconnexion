import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setIsAuthenticated(false);
          return;
        }

        // Verify the user exists in the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile) {
          // If profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: session.user.id }]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            toast({
              title: "Erreur",
              description: "Impossible de créer votre profil",
              variant: "destructive"
            });
            setIsAuthenticated(false);
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        return;
      }
      
      setIsAuthenticated(true);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};