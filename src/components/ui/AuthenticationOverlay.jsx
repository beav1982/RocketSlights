import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const AuthenticationOverlay = ({ 
  isVisible = true, 
  onAuthSuccess = () => {},
  onAuthError = () => {},
  className = ''
}) => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  // Check for existing authentication
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('userData');
      
      if (token && user) {
        try {
          const userData = JSON.parse(user);
          onAuthSuccess(userData);
          navigate('/game-lobby-dashboard');
        } catch (error) {
          console.error('Invalid stored user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    };

    if (isVisible) {
      checkAuth();
    }
  }, [isVisible, navigate, onAuthSuccess]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'register') {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful authentication
      const mockUser = {
        id: Date.now(),
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        avatar: null,
        createdAt: new Date().toISOString()
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store authentication data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));

      if (formData.rememberMe) {
        localStorage.setItem('rememberAuth', 'true');
      }

      onAuthSuccess(mockUser);
      navigate('/game-lobby-dashboard');

    } catch (error) {
      console.error('Authentication error:', error);
      onAuthError(error);
      setErrors({ submit: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = (mode) => {
    setAuthMode(mode);
    setErrors({});
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
  };

  const handleGuestAccess = () => {
    const guestUser = {
      id: 'guest-' + Date.now(),
      email: 'guest@slights.game',
      username: 'Guest Player',
      avatar: null,
      isGuest: true,
      createdAt: new Date().toISOString()
    };

    sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
    onAuthSuccess(guestUser);
    navigate('/game-lobby-dashboard');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`
      fixed inset-0 z-300 bg-background flex items-center justify-center p-4
      ${className}
    `}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
      </div>

      {/* Authentication form */}
      <div className="relative w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
            <Icon name="Zap" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Slights Game
          </h1>
          <p className="text-muted-foreground">
            {authMode === 'login' && 'Welcome back! Sign in to continue playing.'}
            {authMode === 'register' && 'Create your account to start playing with friends.'}
            {authMode === 'forgot' && 'Enter your email to reset your password.'}
          </p>
        </div>

        {/* Authentication form */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-game-modal">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field (register only) */}
            {authMode === 'register' && (
              <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                error={errors.username}
                required
                className="mb-4"
              />
            )}

            {/* Email field */}
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
              className="mb-4"
            />

            {/* Password field */}
            {authMode !== 'forgot' && (
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                required
                className="mb-4"
              />
            )}

            {/* Confirm password field (register only) */}
            {authMode === 'register' && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
                className="mb-4"
              />
            )}

            {/* Remember me checkbox (login only) */}
            {authMode === 'login' && (
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
            )}

            {/* Submit error */}
            {errors.submit && (
              <div className="text-error text-sm text-center mb-4">
                {errors.submit}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              className="mb-4"
            >
              {authMode === 'login' && 'Sign In'}
              {authMode === 'register' && 'Create Account'}
              {authMode === 'forgot' && 'Reset Password'}
            </Button>

            {/* Mode switching */}
            <div className="text-center space-y-2">
              {authMode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('register')}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {authMode === 'register' && (
                <div className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {authMode === 'forgot' && (
                <div className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Guest access */}
          {authMode === 'login' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleGuestAccess}
                iconName="UserX"
                iconPosition="left"
              >
                Continue as Guest
              </Button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default AuthenticationOverlay;