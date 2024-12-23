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
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Clear any existing session first to ensure we start fresh
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          await supabase.auth.signOut();
        }

        // Get fresh session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) setIsAuthenticated(false);
          return;
        }

        if (!session) {
          if (mounted) setIsAuthenticated(false);
          return;
        }

        // Verify the session is valid by getting the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User verification error:', userError);
          await supabase.auth.signOut();
          if (mounted) setIsAuthenticated(false);
          return;
        }

        // Then check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile check error:', profileError);
          toast({
            title: "Erreur",
            description: "Impossible de vérifier votre profil",
            variant: "destructive"
          });
          if (mounted) setIsAuthenticated(false);
          return;
        }

        // If profile doesn't exist, create it
        if (!profile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: user.id,
              email: user.email,
              role: 'user'
            }]);

          if (insertError) {
            console.error('Profile creation error:', insertError);
            toast({
              title: "Erreur",
              description: "Impossible de créer votre profil",
              variant: "destructive"
            });
            if (mounted) setIsAuthenticated(false);
            return;
          }
        }

        if (mounted) setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) setIsAuthenticated(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (mounted) setIsAuthenticated(false);
        return;
      }
      
      if (mounted) {
        await checkAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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