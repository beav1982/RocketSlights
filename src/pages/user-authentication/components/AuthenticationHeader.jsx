import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthenticationHeader = ({ mode }) => {
  const getHeaderContent = () => {
    switch (mode) {
      case 'login':
        return {
          title: 'Welcome Back!',
          subtitle: 'Sign in to continue your gaming adventure'
        };
      case 'register':
        return {
          title: 'Join the Fun!',
          subtitle: 'Create your account to start playing with friends'
        };
      case 'forgot':
        return {
          title: 'Reset Password',
          subtitle: 'Enter your email to receive reset instructions'
        };
      default:
        return {
          title: 'Welcome to Slights',
          subtitle: 'The ultimate party game experience'
        };
    }
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-6 shadow-lg">
        <Icon name="Zap" size={36} className="text-white" />
      </div>

      {/* Game Branding */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2 font-display">
          Slights Game
        </h1>
        <p className="text-lg text-muted-foreground">
          The multiplayer party game that brings friends together
        </p>
      </div>

      {/* Mode-specific content */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthenticationHeader;