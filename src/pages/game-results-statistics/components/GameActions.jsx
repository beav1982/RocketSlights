import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameActions = ({ gameData, onPlayAgain, onNewGame }) => {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    // Maintain current room and players
    sessionStorage.setItem('playAgainData', JSON.stringify({
      roomCode: gameData.roomCode,
      players: gameData.players,
      settings: gameData.settings
    }));
    
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      navigate('/game-room-setup');
    }
  };

  const handleNewGame = () => {
    // Clear session data for fresh start
    sessionStorage.removeItem('gameState');
    sessionStorage.removeItem('playerData');
    sessionStorage.removeItem('playAgainData');
    
    if (onNewGame) {
      onNewGame();
    } else {
      navigate('/game-lobby-dashboard');
    }
  };

  const handleViewHistory = () => {
    navigate('/user-profile-management', { 
      state: { activeTab: 'history' } 
    });
  };

  const handleBackToLobby = () => {
    navigate('/game-lobby-dashboard');
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="Gamepad2" size={24} className="text-primary" />
            What's Next?
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Continue playing or explore other options
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Button
          variant="default"
          size="lg"
          onClick={handlePlayAgain}
          iconName="RotateCcw"
          iconPosition="left"
          fullWidth
        >
          Play Again
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleNewGame}
          iconName="Plus"
          iconPosition="left"
          fullWidth
        >
          New Game
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Button
          variant="ghost"
          size="default"
          onClick={handleViewHistory}
          iconName="History"
          iconPosition="left"
          fullWidth
        >
          Game History
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={handleBackToLobby}
          iconName="Home"
          iconPosition="left"
          fullWidth
        >
          Back to Lobby
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={() => navigate('/user-profile-management')}
          iconName="User"
          iconPosition="left"
          fullWidth
        >
          View Profile
        </Button>
      </div>

      {/* Game Info */}
      <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Hash" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                Room: {gameData.roomCode}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {gameData.duration}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {gameData.totalPlayers} players
            </span>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Icon name="Lightbulb" size={16} className="text-warning" />
          Quick Tips
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Icon name="ArrowRight" size={14} className="text-primary mt-0.5" />
            <span>
              "Play Again" keeps the same room and players for another round
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="ArrowRight" size={14} className="text-primary mt-0.5" />
            <span>
              "New Game" returns you to the lobby to find different players
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="ArrowRight" size={14} className="text-primary mt-0.5" />
            <span>
              Check your profile to see all-time statistics and achievements
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameActions;