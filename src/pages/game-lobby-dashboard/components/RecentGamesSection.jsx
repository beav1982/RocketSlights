import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentGamesSection = ({ onGameRejoin = () => {} }) => {
  const navigate = useNavigate();

  const recentGames = [
    {
      id: 'game-001',
      roomCode: 'PARTY4',
      roomName: 'Friday Night Fun',
      playerCount: 6,
      maxPlayers: 8,
      status: 'active',
      lastPlayed: new Date(Date.now() - 1800000), // 30 minutes ago
      canRejoin: true,
      hostName: 'Sarah M.'
    },
    {
      id: 'game-002',
      roomCode: 'LAUGH2',
      roomName: 'Weekend Warriors',
      playerCount: 4,
      maxPlayers: 6,
      status: 'completed',
      lastPlayed: new Date(Date.now() - 7200000), // 2 hours ago
      canRejoin: false,
      hostName: 'Mike R.',
      winner: 'Alex K.'
    },
    {
      id: 'game-003',
      roomCode: 'JOKES1',
      roomName: 'Office Break',
      playerCount: 5,
      maxPlayers: 8,
      status: 'completed',
      lastPlayed: new Date(Date.now() - 86400000), // 1 day ago
      canRejoin: false,
      hostName: 'Emma L.',
      winner: 'You'
    }
  ];

  const handleRejoinGame = (game) => {
    sessionStorage.setItem('currentGame', JSON.stringify({
      roomCode: game.roomCode,
      hostId: game.hostName,
      rejoinedAt: new Date().toISOString(),
      maxPlayers: game.maxPlayers,
      currentPlayers: game.playerCount,
      status: 'waiting'
    }));
    
    onGameRejoin(game);
    navigate('/game-room-setup');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'completed':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'Play';
      case 'completed':
        return 'CheckCircle';
      default:
        return 'Clock';
    }
  };

  if (recentGames.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <Icon name="GamepadIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Recent Games
        </h3>
        <p className="text-muted-foreground">
          Create or join your first game to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Games
        </h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="History"
          iconPosition="left"
          onClick={() => navigate('/user-profile-management')}
        >
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {recentGames.map((game) => (
          <div
            key={game.id}
            className="bg-card border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon 
                    name={getStatusIcon(game.status)} 
                    size={18} 
                    className={getStatusColor(game.status)} 
                  />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {game.roomName}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      {game.roomCode}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Users" size={14} />
                      <span>{game.playerCount}/{game.maxPlayers}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="User" size={14} />
                      <span>{game.hostName}</span>
                    </span>
                    <span>{formatTimeAgo(game.lastPlayed)}</span>
                  </div>
                  
                  {game.winner && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Icon name="Trophy" size={14} className="text-warning" />
                      <span className="text-sm text-warning font-medium">
                        Winner: {game.winner}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {game.canRejoin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejoinGame(game)}
                    iconName="LogIn"
                    iconPosition="left"
                  >
                    Rejoin
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MoreVertical"
                  className="w-8 h-8 p-0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentGamesSection;