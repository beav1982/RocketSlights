import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ForgotPasswordForm = ({ 
  onSubmit, 
  onBackToLogin, 
  isLoading, 
  errors = {},
  isSuccess = false 
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email });
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
            <Icon name="CheckCircle" size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Reset Link Sent!
          </h3>
          <p className="text-sm text-green-700">
            We've sent password reset instructions to your email address. 
            Please check your inbox and follow the link to reset your password.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onBackToLogin}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Password Reset Instructions</p>
              <p>
                Enter your email address and we'll send you a link to reset your password. 
                Make sure to check your spam folder if you don't see the email.
              </p>
            </div>
          </div>
        </div>

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
          description="We'll send reset instructions to this email"
        />

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
          disabled={!email.trim()}
        >
          Send Reset Link
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            <span>Back to Sign In</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;