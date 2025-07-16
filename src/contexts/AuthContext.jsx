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
      try {
        setLoading(true);
        setAuthError(null);

        // Handle OAuth redirect first (for new sign-ins)
        const redirectResult = await authService.handleOAuthRedirect();
        if (redirectResult.success && redirectResult.data?.session && isMounted) {
          const authUser = redirectResult.data.session.user;
          setUser(authUser);

          const profileResult = await authService.getUserProfile(authUser.id);
          if (profileResult.success) {
            setUserProfile(profileResult.data);
          }
        } else {
          // Fallback to existing session check
          const sessionResult = await authService.getSession();
          if (sessionResult.success && sessionResult.data?.session?.user && isMounted) {
            const authUser = sessionResult.data.session.user;
            setUser(authUser);

            const profileResult = await authService.getUserProfile(authUser.id);
            if (profileResult.success) {
              setUserProfile(profileResult.data);
            }
          }
        }

        // Cleanup any OAuth URL hash
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        if (isMounted) setAuthError(err.message || 'Authentication failed.');
      } finally {
        if (isMounted) setLoading(false);
      }
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
