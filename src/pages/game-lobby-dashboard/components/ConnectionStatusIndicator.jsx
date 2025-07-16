import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatusIndicator = () => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate connection monitoring
    const checkConnection = () => {
      // Mock connection status changes
      const statuses = ['connected', 'connecting', 'disconnected'];
      const weights = [0.85, 0.10, 0.05]; // 85% connected, 10% connecting, 5% disconnected
      
      const random = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < statuses.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          setConnectionStatus(statuses[i]);
          setLastUpdate(new Date());
          break;
        }
      }
    };

    // Check connection every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    
    // Initial check
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: 'Wifi',
          text: 'Connected',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          pulse: false
        };
      case 'connecting':
        return {
          icon: 'Loader2',
          text: 'Connecting...',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          pulse: true
        };
      case 'disconnected':
        return {
          icon: 'WifiOff',
          text: 'Disconnected',
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          pulse: false
        };
      default:
        return {
          icon: 'Wifi',
          text: 'Unknown',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-border',
          pulse: false
        };
    }
  };

  const config = getStatusConfig();

  const formatLastUpdate = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastUpdate) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }
  };

  // Don't show indicator when connected (to reduce UI clutter)
  if (connectionStatus === 'connected') {
    return null;
  }

  return (
    <div className={`
      fixed top-4 right-4 z-90
      ${config.bgColor} ${config.borderColor} border rounded-lg p-3
      shadow-lg backdrop-blur-sm
      animate-in slide-in-from-top-2 duration-300
    `}>
      <div className="flex items-center space-x-2">
        <Icon 
          name={config.icon} 
          size={16} 
          className={`${config.color} ${config.pulse ? 'animate-spin' : ''}`} 
        />
        <div className="min-w-0">
          <div className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatLastUpdate()}
          </div>
        </div>
      </div>
      
      {connectionStatus === 'disconnected' && (
        <div className="mt-2 pt-2 border-t border-border">
          <button
            onClick={() => {
              setConnectionStatus('connecting');
              setTimeout(() => setConnectionStatus('connected'), 2000);
            }}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Retry connection
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;