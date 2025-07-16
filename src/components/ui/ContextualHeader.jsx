import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ContextualHeader = ({ 
  title, 
  subtitle, 
  actions = [], 
  showLogo = true, 
  className = '',
  gameCode = null,
  timer = null,
  connectionStatus = 'connected'
}) => {
  const location = useLocation();
  
  const getHeaderConfig = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/game-lobby-dashboard':
        return {
          title: 'Game Lobby',
          subtitle: 'Find and join games with friends',
          showLogo: true,
          actions: [
            { 
              label: 'Create Game', 
              variant: 'default', 
              iconName: 'Plus',
              onClick: () => console.log('Create game clicked')
            }
          ]
        };
        
      case '/game-room-setup':
        return {
          title: 'Room Setup',
          subtitle: gameCode ? `Room Code: ${gameCode}` : 'Setting up your game room',
          showLogo: false,
          actions: [
            { 
              label: 'Start Game', 
              variant: 'default', 
              iconName: 'Play',
              onClick: () => console.log('Start game clicked')
            },
            { 
              label: 'Settings', 
              variant: 'outline', 
              iconName: 'Settings',
              onClick: () => console.log('Settings clicked')
            }
          ]
        };
        
      case '/active-gameplay-interface':
        // Header hidden during active gameplay
        return null;
        
      case '/game-results-statistics':
        return {
          title: 'Game Results',
          subtitle: 'Round completed',
          showLogo: false,
          actions: [
            { 
              label: 'Play Again', 
              variant: 'default', 
              iconName: 'RotateCcw',
              onClick: () => console.log('Play again clicked')
            },
            { 
              label: 'Share', 
              variant: 'outline', 
              iconName: 'Share2',
              onClick: () => console.log('Share clicked')
            }
          ]
        };
        
      case '/user-profile-management':
        return {
          title: 'Profile',
          subtitle: 'Manage your gaming profile',
          showLogo: true,
          actions: [
            { 
              label: 'Edit', 
              variant: 'outline', 
              iconName: 'Edit3',
              onClick: () => console.log('Edit profile clicked')
            }
          ]
        };
        
      default:
        return {
          title: title || 'Slights Game',
          subtitle: subtitle || '',
          showLogo: showLogo,
          actions: actions
        };
    }
  };

  const config = getHeaderConfig();
  
  // Don't render header during active gameplay
  if (!config) {
    return null;
  }

  const finalTitle = title || config.title;
  const finalSubtitle = subtitle || config.subtitle;
  const finalActions = actions.length > 0 ? actions : config.actions;
  const finalShowLogo = showLogo !== undefined ? showLogo : config.showLogo;

  return (
    <header className={`
      sticky top-0 z-90 bg-background/95 backdrop-blur-sm border-b border-border
      transition-all duration-300 ease-out
      ${className}
    `}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left section - Logo and title */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {finalShowLogo && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={18} className="text-white" />
                </div>
                <span className="font-display font-medium text-lg text-foreground hidden sm:block">
                  Slights
                </span>
              </div>
            )}
            
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-foreground truncate">
                {finalTitle}
              </h1>
              {finalSubtitle && (
                <p className="text-sm text-muted-foreground truncate">
                  {finalSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Center section - Game status indicators */}
          {(gameCode || timer || connectionStatus !== 'connected') && (
            <div className="flex items-center space-x-4 mx-4">
              {gameCode && (
                <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-1">
                  <Icon name="Hash" size={14} className="text-muted-foreground" />
                  <span className="font-mono text-sm font-medium text-foreground">
                    {gameCode}
                  </span>
                </div>
              )}
              
              {timer && (
                <div className="flex items-center space-x-2 bg-warning/10 text-warning rounded-lg px-3 py-1">
                  <Icon name="Clock" size={14} />
                  <span className="font-mono text-sm font-medium">
                    {timer}
                  </span>
                </div>
              )}
              
              {connectionStatus !== 'connected' && (
                <div className={`
                  flex items-center space-x-2 rounded-lg px-3 py-1
                  ${connectionStatus === 'connecting' ?'bg-warning/10 text-warning animate-pulse-glow' :'bg-error/10 text-error'
                  }
                `}>
                  <Icon 
                    name={connectionStatus === 'connecting' ? 'Loader2' : 'WifiOff'} 
                    size={14} 
                    className={connectionStatus === 'connecting' ? 'animate-spin' : ''}
                  />
                  <span className="text-sm font-medium capitalize">
                    {connectionStatus}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Right section - Actions */}
          {finalActions.length > 0 && (
            <div className="flex items-center space-x-2">
              {finalActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size={action.size || 'default'}
                  iconName={action.iconName}
                  iconPosition={action.iconPosition || 'left'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="whitespace-nowrap"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ContextualHeader;