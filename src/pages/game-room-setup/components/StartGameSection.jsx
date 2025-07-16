import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StartGameSection = ({ 
  players, 
  gameSettings, 
  isRoomCreator, 
  onStartGame, 
  isStarting = false 
}) => {
  const minPlayers = 3;
  const canStartGame = players.length >= minPlayers && isRoomCreator;
  const connectedPlayers = players.filter(p => p.connectionStatus === 'connected');
  const allPlayersConnected = connectedPlayers.length === players.length;

  const getStartButtonText = () => {
    if (isStarting) return 'Starting Game...';
    if (!isRoomCreator) return 'Waiting for Host';
    if (players.length < minPlayers) return `Need ${minPlayers - players.length} More Players`;
    if (!allPlayersConnected) return 'Waiting for All Players';
    return 'Start Game';
  };

  const getStatusMessage = () => {
    if (!isRoomCreator) {
      return 'Only the room creator can start the game';
    }
    
    if (players.length < minPlayers) {
      return `You need at least ${minPlayers} players to start the game`;
    }
    
    if (!allPlayersConnected) {
      const disconnectedCount = players.length - connectedPlayers.length;
      return `${disconnectedCount} player${disconnectedCount > 1 ? 's' : ''} still connecting`;
    }
    
    return 'All players are ready! You can start the game now.';
  };

  const getStatusIcon = () => {
    if (!isRoomCreator) return 'Clock';
    if (players.length < minPlayers) return 'UserPlus';
    if (!allPlayersConnected) return 'Wifi';
    return 'CheckCircle';
  };

  const getStatusColor = () => {
    if (!isRoomCreator) return 'text-muted-foreground';
    if (players.length < minPlayers) return 'text-warning';
    if (!allPlayersConnected) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Game Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Game Summary</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Users" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">Players</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {players.length} / 8
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Score Limit</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {gameSettings.scoreLimit} points
            </div>
          </div>
        </div>

        {/* Game Options Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Active Options:</h4>
          <div className="flex flex-wrap gap-2">
            {gameSettings.allowSpectators && (
              <div className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium">
                Spectators Allowed
              </div>
            )}
            {gameSettings.customRules && (
              <div className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                Custom Rules
              </div>
            )}
            {gameSettings.anonymousSubmissions && (
              <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                Anonymous Mode
              </div>
            )}
            {gameSettings.quickRounds && (
              <div className="bg-warning/10 text-warning px-2 py-1 rounded text-xs font-medium">
                Quick Rounds
              </div>
            )}
            {!gameSettings.allowSpectators && !gameSettings.customRules && 
             !gameSettings.anonymousSubmissions && !gameSettings.quickRounds && (
              <div className="bg-muted/30 text-muted-foreground px-2 py-1 rounded text-xs">
                Standard Rules
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          canStartGame && allPlayersConnected ? 'bg-success/10' : 'bg-warning/10'
        }`}>
          <Icon 
            name={getStatusIcon()} 
            size={16} 
            className={getStatusColor()}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {canStartGame && allPlayersConnected ? 'Ready to Start' : 'Not Ready'}
          </p>
          <p className="text-xs text-muted-foreground">
            {getStatusMessage()}
          </p>
        </div>
      </div>

      {/* Connection Status */}
      {players.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Connection Status</span>
            <span className="text-xs text-muted-foreground">
              {connectedPlayers.length} / {players.length} connected
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${(connectedPlayers.length / players.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Start Game Button */}
      <Button
        variant="default"
        size="lg"
        fullWidth
        onClick={onStartGame}
        disabled={!canStartGame || !allPlayersConnected || isStarting}
        loading={isStarting}
        iconName={canStartGame && allPlayersConnected ? "Play" : "Clock"}
        iconPosition="left"
        className="mb-4"
      >
        {getStartButtonText()}
      </Button>

      {/* Additional Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          fullWidth
          iconName="Settings"
          iconPosition="left"
          disabled={!isRoomCreator}
        >
          Game Settings
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          iconName="LogOut"
          iconPosition="left"
        >
          Leave Room
        </Button>
      </div>

      {/* Game Rules Reminder */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Quick Rules:</p>
            <p>
              Players match "Curse" cards to "Slight" scenarios. The judge picks the funniest combination. 
              First to {gameSettings.scoreLimit} points wins!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartGameSection;