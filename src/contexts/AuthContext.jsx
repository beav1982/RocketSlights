import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../utils/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setLoading(true);
      setAuthError(null);

      // Step 1: Handle OAuth Redirect
      const redirectResult = await authService.handleOAuthRedirect();
      if (redirectResult?.success && redirectResult?.data?.session) {
        const authUser = redirectResult.data.session.user;
        if (isMounted) {
          setUser(authUser);
          const profileResult = await authService.getUserProfile(authUser.id);
          if (profileResult?.success) {
            setUserProfile(profileResult.data);
          }
        }
      } else {
        // Step 2: Try to recover an existing session
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

      // Step 3: Clean up URL hash after OAuth redirect
      if (window.location.hash.includes('access_token')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (isMounted) setLoading(false);
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, authError, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
