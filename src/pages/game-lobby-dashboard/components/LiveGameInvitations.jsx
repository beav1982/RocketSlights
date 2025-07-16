import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveGameInvitations = ({ onInvitationAccepted = () => {}, onInvitationDeclined = () => {} }) => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [processingInvite, setProcessingInvite] = useState(null);

  useEffect(() => {
    // Simulate receiving live invitations
    const generateMockInvitations = () => {
      const mockInvites = [
        {
          id: 'invite-001',
          fromUser: {
            id: 'user-456',
            name: 'Sarah Mitchell',
            avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
          },
          gameData: {
            roomCode: 'PARTY4',
            roomName: 'Friday Night Fun',
            currentPlayers: 4,
            maxPlayers: 8,
            gameMode: 'Classic'
          },
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          expiresAt: new Date(Date.now() + 600000), // Expires in 10 minutes
          status: 'pending'
        },
        {
          id: 'invite-002',
          fromUser: {
            id: 'user-789',
            name: 'Mike Rodriguez',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
          },
          gameData: {
            roomCode: 'LAUGH2',
            roomName: 'Weekend Warriors',
            currentPlayers: 3,
            maxPlayers: 6,
            gameMode: 'Speed Round'
          },
          timestamp: new Date(Date.now() - 120000), // 2 minutes ago
          expiresAt: new Date(Date.now() + 480000), // Expires in 8 minutes
          status: 'pending'
        }
      ];

      setInvitations(mockInvites);
    };

    // Generate initial invitations
    generateMockInvitations();

    // Simulate receiving new invitations periodically
    const inviteInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new invitation
        const newInvite = {
          id: `invite-${Date.now()}`,
          fromUser: {
            id: `user-${Date.now()}`,
            name: ['Alex Johnson', 'Emma Davis', 'Chris Wilson'][Math.floor(Math.random() * 3)],
            avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`
          },
          gameData: {
            roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            roomName: ['Quick Game', 'Fun Time', 'Game Night'][Math.floor(Math.random() * 3)],
            currentPlayers: Math.floor(Math.random() * 4) + 2,
            maxPlayers: 8,
            gameMode: ['Classic', 'Speed Round', 'Team Mode'][Math.floor(Math.random() * 3)]
          },
          timestamp: new Date(),
          expiresAt: new Date(Date.now() + 600000),
          status: 'pending'
        };

        setInvitations(prev => [newInvite, ...prev.slice(0, 2)]); // Keep max 3 invitations
      }
    }, 30000); // Check every 30 seconds

    // Clean up expired invitations
    const cleanupInterval = setInterval(() => {
      setInvitations(prev => prev.filter(invite => 
        invite.expiresAt > new Date() && invite.status === 'pending'
      ));
    }, 60000); // Check every minute

    return () => {
      clearInterval(inviteInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  const handleAcceptInvitation = async (invitation) => {
    setProcessingInvite(invitation.id);
    
    try {
      // Simulate accepting invitation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update invitation status
      setInvitations(prev => prev.map(invite => 
        invite.id === invitation.id 
          ? { ...invite, status: 'accepted' }
          : invite
      ));
      
      // Store game data and navigate
      sessionStorage.setItem('currentGame', JSON.stringify({
        roomCode: invitation.gameData.roomCode,
        hostId: invitation.fromUser.id,
        joinedAt: new Date().toISOString(),
        maxPlayers: invitation.gameData.maxPlayers,
        currentPlayers: invitation.gameData.currentPlayers + 1,
        status: 'waiting',
        invitedBy: invitation.fromUser.name
      }));
      
      onInvitationAccepted(invitation);
      navigate('/game-room-setup');
      
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    } finally {
      setProcessingInvite(null);
    }
  };

  const handleDeclineInvitation = async (invitation) => {
    setProcessingInvite(invitation.id);
    
    try {
      // Simulate declining invitation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove invitation from list
      setInvitations(prev => prev.filter(invite => invite.id !== invitation.id));
      
      onInvitationDeclined(invitation);
      
    } catch (error) {
      console.error('Failed to decline invitation:', error);
    } finally {
      setProcessingInvite(null);
    }
  };

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const diffInMinutes = Math.floor((expiresAt - now) / (1000 * 60));
    
    if (diffInMinutes <= 0) {
      return 'Expired';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m left`;
    } else {
      return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}m left`;
    }
  };

  if (invitations.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Bell" size={20} className="text-primary animate-pulse-glow" />
        <h2 className="text-lg font-semibold text-foreground">
          Game Invitations
        </h2>
        <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
          {invitations.length}
        </div>
      </div>
      
      <div className="space-y-3">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-4 animate-in slide-in-from-left-2 duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="relative">
                  <img
                    src={invitation.fromUser.avatar}
                    alt={invitation.fromUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {invitation.fromUser.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      invited you to
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-primary">
                      {invitation.gameData.roomName}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      {invitation.gameData.roomCode}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Users" size={14} />
                      <span>{invitation.gameData.currentPlayers}/{invitation.gameData.maxPlayers}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Gamepad2" size={14} />
                      <span>{invitation.gameData.gameMode}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{formatTimeRemaining(invitation.expiresAt)}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeclineInvitation(invitation)}
                  disabled={processingInvite === invitation.id}
                  iconName="X"
                  className="w-8 h-8 p-0"
                />
                
                <Button
                  variant="default"
                  size="sm"
                  loading={processingInvite === invitation.id}
                  onClick={() => handleAcceptInvitation(invitation)}
                  iconName="Check"
                  iconPosition="left"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveGameInvitations;