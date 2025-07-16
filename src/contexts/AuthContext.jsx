import React, { createContext, useContext, useEffect, useState } from "react";
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
      setLoading(true);
      setAuthError(null);

      try {
        const { data, error } = await authService.getSession();
        if (data?.session && isMounted) {
          const authUser = data.session.user;
          setUser(authUser);

          const profileResult = await authService.getUserProfile(authUser.id);
          if (profileResult?.success) {
            setUserProfile(profileResult.data);
          }
        }
      } catch (err) {
        setAuthError(err.message || "Authentication failed.");
      } finally {
        if (window.location.hash.includes("access_token")) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
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
