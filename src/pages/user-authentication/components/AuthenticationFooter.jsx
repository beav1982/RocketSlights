import React from 'react';

const AuthenticationFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 text-center space-y-4">
      {/* Legal Links */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <a 
          href="/privacy-policy" 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy Policy
        </a>
        <span className="text-muted-foreground">•</span>
        <a 
          href="/terms-of-service" 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms of Service
        </a>
        <span className="text-muted-foreground">•</span>
        <a 
          href="/support" 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Support
        </a>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span>Secured with SSL encryption</span>
      </div>

      {/* Copyright */}
      <div className="text-xs text-muted-foreground">
        © {currentYear} Slights Game. All rights reserved.
      </div>

      {/* Gaming Platform Compliance */}
      <div className="text-xs text-muted-foreground">
        <p>This game is intended for players 18 years and older.</p>
        <p>Play responsibly and have fun!</p>
      </div>
    </footer>
  );
};

export default AuthenticationFooter;