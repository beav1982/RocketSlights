import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreateGameCard = ({ onCreateGame }) => {
  const { user, userProfile } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateGame = async () => {
    // Clear any previous errors
    setError(null);
    
    // Validate authentication
    if (!user?.id) {
      setError('You must be logged in to create a game');
      return;
    }

    // Validate user profile exists
    if (!userProfile) {
      setError('User profile not found. Please refresh the page and try again.');
      return;
    }

    setIsCreating(true);
    
    try {
      // Create game data with authenticated user
      const gameData = {
        name: `${userProfile?.display_name || user?.email?.split('@')[0] || 'Player'}'s Game`,
        hostId: user.id,
        maxPlayers: 8,
        scoreLimit: 5,
        settings: {
          scoreLimit: 5,
          allowSpectators: false,
          customRules: false,
          anonymousSubmissions: true,
          quickRounds: false
        }
      };
      
      // Call the parent's create game handler
      await onCreateGame(gameData);
      
    } catch (error) {
      console.log('Failed to create game:', error);
      setError('Failed to create game room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 mb-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
          <Icon name="Plus" size={28} className="text-white" />
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Create New Game
        </h2>
        
        <p className="text-muted-foreground mb-6">
          Start a new game room and invite your friends to join the fun
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        <Button
          variant="default"
          size="lg"
          fullWidth
          loading={isCreating}
          onClick={handleCreateGame}
          iconName="Gamepad2"
          iconPosition="left"
          className="animate-pulse-glow"
          disabled={!user?.id || !userProfile || isCreating}
        >
          {isCreating ? 'Creating Room...' : 'Create Game Room'}
        </Button>
        
        <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={16} />
            <span>2-8 Players</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={16} />
            <span>15-30 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGameCard;