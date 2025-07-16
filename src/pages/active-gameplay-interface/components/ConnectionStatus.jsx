import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionStatus = ({ 
  status = 'connected', 
  playersConnected = 0,
  totalPlayers = 0,
  onReconnect = () => {},
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: 'Wifi',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          message: 'Connected',
          showReconnect: false
        };
      case 'connecting':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          message: 'Connecting...',
          showReconnect: false,
          animate: 'animate-spin'
        };
      case 'reconnecting':
        return {
          icon: 'RefreshCw',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          message: 'Reconnecting...',
          showReconnect: true,
          animate: 'animate-spin'
        };
      case 'disconnected':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          message: 'Connection lost',
          showReconnect: true
        };
      default:
        return {
          icon: 'Wifi',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          message: 'Unknown status',
          showReconnect: false
        };
    }
  };

  const config = getStatusConfig();

  if (status === 'connected' && playersConnected === totalPlayers) {
    return null; // Hide when everything is normal
  }

  return (
    <div className={`
      fixed top-4 left-1/2 transform -translate-x-1/2 z-100
      ${config.bgColor} ${config.borderColor} border rounded-lg px-4 py-2
      backdrop-blur-sm shadow-game-modal
      ${className}
    `}>
      <div className="flex items-center space-x-3">
        {/* Status icon */}
        <Icon 
          name={config.icon} 
          size={16} 
          className={`${config.color} ${config.animate || ''}`} 
        />

        {/* Status message */}
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${config.color}`}>
            {config.message}
          </span>
          
          {/* Player count */}
          {totalPlayers > 0 && (
            <span className="text-xs text-muted-foreground">
              ({playersConnected}/{totalPlayers} players)
            </span>
          )}
        </div>

        {/* Reconnect button */}
        {config.showReconnect && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReconnect}
            iconName="RefreshCw"
            className="p-1 h-6 w-6"
          />
        )}
      </div>

      {/* Additional info for disconnected state */}
      {status === 'disconnected' && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Game state will be preserved during reconnection
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;