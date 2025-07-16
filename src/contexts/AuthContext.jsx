import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase"; // ← needed for auth state change
import authService from "../utils/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        setAuthError(null);

        const { data, error } = await authService.handleOAuthRedirect();
        if (data?.session && isMounted) {
          const authUser = data.session.user;
          setUser(authUser);

          const profileResult = await authService.getUserProfile(authUser.id);
          if (profileResult?.success) {
            setUserProfile(profileResult.data);
          }
        }
          const sessionResult = await authService.getSession();
          if (sessionResult?.success && sessionResult?.data?.session?.user && isMounted) {
            const authUser = sessionResult.data.session.user;
            setUser(authUser);

            const profileResult = await authService.getUserProfile(authUser.id);
            if (profileResult?.success) {
              setUserProfile(profileResult.data);
            }
          }
        }

        if (window.location.hash.includes("access_token")) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

      } catch (err) {
        setAuthError(err.message || "Authentication failed.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Listen for login/logout session changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
