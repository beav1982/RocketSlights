import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingOverlay = ({ isVisible, message = 'Authenticating...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg max-w-sm w-full mx-4">
        <div className="text-center space-y-4">
          {/* Animated Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl animate-pulse-glow">
            <Icon name="Zap" size={28} className="text-white" />
          </div>

          {/* Loading Spinner */}
          <div className="flex items-center justify-center">
            <Icon name="Loader2" size={24} className="text-primary animate-spin" />
          </div>

          {/* Loading Message */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {message}
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your request
            </p>
          </div>

          {/* Animated Dots */}
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-typing-dots" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-typing-dots" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-typing-dots" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;