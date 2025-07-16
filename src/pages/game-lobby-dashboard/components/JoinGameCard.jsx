import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const JoinGameCard = ({ onGameJoined = () => {} }) => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleRoomCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setRoomCode(value);
      setError('');
    }
  };

  const handleJoinGame = async (e) => {
    e.preventDefault();
    
    if (!roomCode || roomCode.length < 4) {
      setError('Please enter a valid room code');
      return;
    }
    
    setIsJoining(true);
    setError('');
    
    try {
      // Simulate joining game
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - simulate some codes being invalid
      const validCodes = ['GAME01', 'PLAY22', 'FUN123', 'PARTY4'];
      
      if (!validCodes.includes(roomCode)) {
        throw new Error('Room not found or game has already started');
      }
      
      const gameData = {
        roomCode,
        hostId: 'other-user',
        joinedAt: new Date().toISOString(),
        maxPlayers: 8,
        currentPlayers: 3,
        status: 'waiting'
      };
      
      sessionStorage.setItem('currentGame', JSON.stringify(gameData));
      
      onGameJoined(gameData);
      navigate('/game-room-setup');
      
    } catch (error) {
      setError(error.message || 'Failed to join game. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl">
          <Icon name="LogIn" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Join Game
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter a room code to join an existing game
          </p>
        </div>
      </div>
      
      <form onSubmit={handleJoinGame} className="space-y-4">
        <Input
          label="Room Code"
          type="text"
          placeholder="Enter 4-6 character code"
          value={roomCode}
          onChange={handleRoomCodeChange}
          error={error}
          required
          className="font-mono text-center text-lg tracking-wider"
        />
        
        <Button
          type="submit"
          variant="outline"
          size="lg"
          fullWidth
          loading={isJoining}
          disabled={!roomCode || roomCode.length < 4}
          iconName="ArrowRight"
          iconPosition="right"
        >
          {isJoining ? 'Joining...' : 'Join Game'}
        </Button>
      </form>
      
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          <Icon name="Info" size={14} className="inline mr-1" />
          Ask your friend for the room code to join their game
        </p>
      </div>
    </div>
  );
};

export default JoinGameCard;