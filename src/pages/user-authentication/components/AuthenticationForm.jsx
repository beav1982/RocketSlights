import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuthenticationForm = ({ 
  mode, 
  onModeChange, 
  onSubmit, 
  isLoading, 
  errors = {},
  onGoogleAuth,
  onForgotPassword 
}) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeToTerms: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Password strength calculation
    if (field === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Fair';
        break;
      case 4:
        feedback = 'Good';
        break;
      case 5:
        feedback = 'Strong';
        break;
      default:
        feedback = '';
    }

    setPasswordStrength({ score, feedback });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode Tabs */}
      <div className="flex bg-muted rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => onModeChange('login')}
          className={`
            flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
            ${mode === 'login' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => onModeChange('register')}
          className={`
            flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
            ${mode === 'register' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          Sign Up
        </button>
      </div>

      {/* Authentication Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Name - Register only */}
        {mode === 'register' && (
          <Input
            label="Display Name"
            type="text"
            placeholder="Choose your display name"
            value={formData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            error={errors.displayName}
            required
            description="This will be shown to other players"
          />
        )}

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
          autoComplete="username"
        />

        {/* Password Field */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          required
          autoComplete="current-password"
        />

        {/* Password Strength Meter - Register only */}
        {mode === 'register' && formData.password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Password strength:</span>
              <span className={`
                font-medium
                ${passwordStrength.score <= 2 ? 'text-red-500' : ''}
                ${passwordStrength.score === 3 ? 'text-yellow-500' : ''}
                ${passwordStrength.score === 4 ? 'text-blue-500' : ''}
                ${passwordStrength.score === 5 ? 'text-green-500' : ''}
              `}>
                {passwordStrength.feedback}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Confirm Password - Register only */}
        {mode === 'register' && (
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />
        )}

        {/* Remember Me - Login only */}
        {mode === 'login' && (
          <Checkbox
            label="Remember me"
            checked={formData.rememberMe}
            onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
            description="Keep me signed in on this device"
          />
        )}

        {/* Terms Agreement - Register only */}
        {mode === 'register' && (
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            error={errors.agreeToTerms}
            required
          />
        )}

        {/* Form Error */}
        {errors.form && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{errors.form}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={mode === 'register' && !formData.agreeToTerms}
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>

        {/* Forgot Password - Login only */}
        {mode === 'login' && (
          <div className="text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Google OAuth */}
      <Button
        variant="outline"
        size="lg"
        fullWidth
        onClick={onGoogleAuth}
        iconName="Chrome"
        iconPosition="left"
        className="mb-4"
        disabled={isLoading}
      >
        Continue with Google
      </Button>
    </div>
  );
};

export default AuthenticationForm;