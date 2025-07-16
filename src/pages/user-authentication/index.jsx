import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticationHeader from './components/AuthenticationHeader';
import AuthenticationForm from './components/AuthenticationForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import AuthenticationFooter from './components/AuthenticationFooter';
import LoadingOverlay from './components/LoadingOverlay';

const UserAuthentication = () => {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp, resetPassword, authError, clearError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Check for existing authentication on mount
  useEffect(() => {
    // Only redirect if not loading and user exists
    if (!loading && user) {
      console.log('User already authenticated, redirecting to lobby');
      navigate('/game-lobby-dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const validateForm = (formData) => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validation
    if (mode === 'register') {
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required';
      } else if (formData.displayName.length < 2) {
        newErrors.displayName = 'Display name must be at least 2 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    return newErrors;
  };

  const handleAuthentication = async (formData) => {
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    clearError();

    try {
      let result;
      
      if (mode === 'login') {
        result = await signIn(formData.email, formData.password);
      } else if (mode === 'register') {
        result = await signUp(formData.email, formData.password, {
          displayName: formData.displayName
        });
      }

      if (result?.success) {
        console.log(`${mode} successful, redirecting to lobby`);
        navigate('/game-lobby-dashboard', { replace: true });
      } else {
        setErrors({ form: result?.error || `${mode} failed` });
      }

    } catch (error) {
      console.log('Authentication error:', error);
      setErrors({ form: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrors({});
    clearError();
    
    try {
      // Import authService for Google auth
      const authService = (await import('../../utils/authService')).default;
      const result = await authService.signInWithGoogle();

      if (!result?.success) {
        setErrors({ form: result?.error || 'Google authentication failed' });
      }
      // Success will be handled by the auth state change listener

    } catch (error) {
      console.log('Google authentication error:', error);
      setErrors({ form: 'Google authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (formData) => {
    setIsLoading(true);
    setErrors({});
    clearError();

    try {
      const result = await resetPassword(formData.email);

      if (result?.success) {
        setForgotPasswordSuccess(true);
      } else {
        setErrors({ form: result?.error || 'Failed to send reset email' });
      }

    } catch (error) {
      console.log('Password reset error:', error);
      setErrors({ form: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrors({});
    setForgotPasswordSuccess(false);
    clearError();
  };

  const handleBackToLogin = () => {
    setMode('login');
    setErrors({});
    setForgotPasswordSuccess(false);
    clearError();
  };

  const handleForgotPasswordClick = () => {
    setMode('forgot');
    setErrors({});
    clearError();
  };

  // Display auth error from context
  const displayErrors = authError ? { ...errors, form: authError } : errors;

  // Show loading state during initial auth check
  if (loading) {
    return (
      <LoadingOverlay 
        isVisible={true} 
        message="Checking authentication..."
      />
    );
  }

  // Don't render if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <AuthenticationHeader mode={mode} />

          {/* Authentication Forms */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg mb-6">
            {mode === 'forgot' ? (
              <ForgotPasswordForm
                onSubmit={handleForgotPassword}
                onBackToLogin={handleBackToLogin}
                isLoading={isLoading}
                errors={displayErrors}
                isSuccess={forgotPasswordSuccess}
              />
            ) : (
              <AuthenticationForm
                mode={mode}
                onModeChange={handleModeChange}
                onSubmit={handleAuthentication}
                isLoading={isLoading}
                errors={displayErrors}
                onGoogleAuth={handleGoogleAuth}
                onForgotPassword={handleForgotPasswordClick}
              />
            )}
          </div>

          {/* Footer */}
          <AuthenticationFooter />
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isLoading} 
        message={
          mode === 'login' ? 'Signing you in...' :
          mode === 'register' ? 'Creating your account...' :
          mode === 'forgot'? 'Sending reset link...' : 'Processing...'
        }
      />
    </div>
  );
};

export default UserAuthentication;