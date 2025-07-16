import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PlayerList = ({ 
  players, 
  currentUserId, 
  roomCreatorId, 
  onKickPlayer, 
  onPromotePlayer,
  maxPlayers = 8 
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerMenu, setShowPlayerMenu] = useState(false);

  const isRoomCreator = currentUserId === roomCreatorId;

  const getConnectionStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'Wifi';
      case 'connecting':
        return 'Loader2';
      case 'disconnected':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  const handlePlayerLongPress = (player) => {
    if (!isRoomCreator || player.id === currentUserId) return;
    
    setSelectedPlayer(player);
    setShowPlayerMenu(true);
  };

  const handlePlayerAction = (action) => {
    if (!selectedPlayer) return;

    switch (action) {
      case 'kick':
        onKickPlayer?.(selectedPlayer.id);
        break;
      case 'promote':
        onPromotePlayer?.(selectedPlayer.id);
        break;
    }

    setSelectedPlayer(null);
    setShowPlayerMenu(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Players</h3>
            <p className="text-sm text-muted-foreground">
              {players.length} of {maxPlayers} players
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`
            w-2 h-2 rounded-full
            ${players.length >= 3 ? 'bg-success' : 'bg-warning'}
          `} />
          <span className="text-xs text-muted-foreground">
            {players.length >= 3 ? 'Ready to start' : 'Need more players'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={`
              flex items-center space-x-3 p-3 rounded-lg border transition-all
              ${player.id === currentUserId 
                ? 'border-primary/50 bg-primary/5' :'border-border hover:border-border/60 hover:bg-muted/30'
              }
              ${isRoomCreator && player.id !== currentUserId ? 'cursor-pointer' : ''}
            `}
            onContextMenu={(e) => {
              e.preventDefault();
              handlePlayerLongPress(player);
            }}
            onClick={() => {
              if (isRoomCreator && player.id !== currentUserId) {
                handlePlayerLongPress(player);
              }
            }}
          >
            {/* Player Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                {player.avatar ? (
                  <Image
                    src={player.avatar}
                    alt={`${player.displayName}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {player.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Connection Status Indicator */}
              <div className={`
                absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background
                flex items-center justify-center
                ${player.connectionStatus === 'connected' ? 'bg-success' : 
                  player.connectionStatus === 'connecting' ? 'bg-warning' : 'bg-error'}
              `}>
                <Icon 
                  name={getConnectionStatusIcon(player.connectionStatus)} 
                  size={8} 
                  className="text-white"
                />
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-foreground truncate">
                  {player.displayName}
                </h4>
                {player.id === roomCreatorId && (
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                    Host
                  </div>
                )}
                {player.id === currentUserId && (
                  <div className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium">
                    You
                  </div>
                )}
              </div>
              <p className={`text-sm ${getConnectionStatusColor(player.connectionStatus)}`}>
                {player.connectionStatus === 'connected' && 'Online'}
                {player.connectionStatus === 'connecting' && 'Connecting...'}
                {player.connectionStatus === 'disconnected' && 'Disconnected'}
              </p>
            </div>

            {/* Player Score (if available) */}
            {player.score !== undefined && (
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">
                  {player.score}
                </div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            )}

            {/* Action Menu Indicator */}
            {isRoomCreator && player.id !== currentUserId && (
              <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
            )}
          </div>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: maxPlayers - players.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex items-center space-x-3 p-3 rounded-lg border border-dashed border-border/50"
          >
            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
              <Icon name="UserPlus" size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Waiting for player...</p>
            </div>
          </div>
        ))}
      </div>

      {/* Player Action Menu */}
      {showPlayerMenu && selectedPlayer && (
        <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-4 w-full max-w-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                {selectedPlayer.avatar ? (
                  <Image
                    src={selectedPlayer.avatar}
                    alt={`${selectedPlayer.displayName}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {selectedPlayer.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-foreground">
                  {selectedPlayer.displayName}
                </h4>
                <p className="text-sm text-muted-foreground">Player Actions</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => handlePlayerAction('promote')}
                iconName="Crown"
                iconPosition="left"
              >
                Make Host
              </Button>
              
              <Button
                variant="destructive"
                fullWidth
                onClick={() => handlePlayerAction('kick')}
                iconName="UserX"
                iconPosition="left"
              >
                Remove Player
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setShowPlayerMenu(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerList;