import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionMonitor = ({ 
  connectionStatus = 'connected', 
  onRetryConnection,
  roomCode 
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      setRetryCount(0);
      setIsRetrying(false);
    }
  }, [connectionStatus]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await onRetryConnection?.();
    } catch (error) {
      console.error('Retry connection failed:', error);
    } finally {
      setTimeout(() => {
        setIsRetrying(false);
      }, 2000);
    }
  };

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'Wifi',
          title: 'Connected',
          message: 'Connection stable',
          showRetry: false
        };
      case 'connecting':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'Loader2',
          title: 'Connecting',
          message: 'Establishing connection...',
          showRetry: false
        };
      case 'reconnecting':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'RotateCcw',
          title: 'Reconnecting',
          message: 'Attempting to reconnect...',
          showRetry: false
        };
      case 'disconnected':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'WifiOff',
          title: 'Disconnected',
          message: 'Connection lost. Some features may not work.',
          showRetry: true
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          icon: 'AlertCircle',
          title: 'Unknown',
          message: 'Connection status unknown',
          showRetry: true
        };
    }
  };

  const config = getStatusConfig();

  // Don't show monitor when connected
  if (connectionStatus === 'connected') {
    return null;
  }

  return (
    <div className={`
      fixed top-16 left-4 right-4 z-90 
      ${config.bgColor} border border-current/20 rounded-lg p-3
      backdrop-blur-sm
    `}>
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
          <Icon 
            name={config.icon} 
            size={16} 
            className={`${config.color} ${
              connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ?'animate-spin' :''
            }`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className={`font-medium ${config.color}`}>
              {config.title}
            </h4>
            {retryCount > 0 && (
              <span className="text-xs text-muted-foreground">
                (Attempt {retryCount})
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {config.message}
          </p>
        </div>

        {config.showRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`
              px-3 py-1 rounded text-xs font-medium transition-colors
              ${config.color} hover:bg-current/10 disabled:opacity-50
            `}
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </div>

      {/* Connection Tips */}
      {connectionStatus === 'disconnected' && (
        <div className="mt-3 pt-3 border-t border-current/20">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Check your internet connection</p>
            <p>• Try refreshing the page</p>
            <p>• Rejoin with room code: <span className="font-mono font-medium">{roomCode}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionMonitor;