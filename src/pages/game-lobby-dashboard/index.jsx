import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GameFlowContainer from '../../components/ui/GameFlowContainer';
import ContextualHeader from '../../components/ui/ContextualHeader';
import CreateGameCard from './components/CreateGameCard';
import JoinGameCard from './components/JoinGameCard';
import UserStatsPanel from './components/UserStatsPanel';
import RecentGamesSection from './components/RecentGamesSection';
import LiveGameInvitations from './components/LiveGameInvitations';
import QuickActionsFloat from './components/QuickActionsFloat';
import ConnectionStatusIndicator from './components/ConnectionStatusIndicator';
import gameService from '../../utils/gameService';

const GameLobbyDashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [gameRooms, setGameRooms] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    // Only redirect if not loading and no user exists
    if (!loading && !user) {
      navigate('/user-authentication', { replace: true });
    }
  }, [user, loading, navigate]);

  // Load game rooms and user stats
  useEffect(() => {
    if (user && userProfile) {
      loadGameRooms();
      loadUserStats();
      
      // Subscribe to real-time game updates
      const channel = gameService.subscribeToGameUpdates((payload) => {
        console.log('Game update received:', payload);
        loadGameRooms(); // Refresh rooms on any update
      });

      return () => {
        gameService.unsubscribeFromChannel(channel);
      };
    }
  }, [user, userProfile]);

  const loadGameRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const result = await gameService.getGameRooms();
      if (result?.success) {
        setGameRooms(result.data || []);
        setIsConnected(true);
      } else {
        console.log('Failed to load game rooms:', result?.error);
        setIsConnected(false);
      }
    } catch (error) {
      console.log('Error loading game rooms:', error);
      setIsConnected(false);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const loadUserStats = async () => {
    if (!user?.id) return;
    
    try {
      const result = await gameService.getUserStats(user.id);
      if (result?.success) {
        setUserStats(result.data);
      }
    } catch (error) {
      console.log('Error loading user stats:', error);
    }
  };

  const handleCreateGame = async (gameData) => {
    if (!user?.id) {
      console.log('User not authenticated');
      return;
    }

    try {
      const result = await gameService.createGameRoom({
        ...gameData,
        hostId: user.id
      });

      if (result?.success) {
        console.log('Game room created successfully:', result.data);
        navigate('/game-room-setup', { 
          state: { roomId: result.data.id, roomCode: result.data.room_code } 
        });
      } else {
        console.log('Failed to create game:', result?.error);
        // You might want to show this error to the user
      }
    } catch (error) {
      console.log('Error creating game:', error);
    }
  };

  const handleJoinGame = async (roomCode) => {
    if (!user?.id) {
      console.log('User not authenticated');
      return;
    }

    try {
      // Find room by code
      const room = gameRooms.find(r => r.room_code === roomCode);
      if (!room) {
        console.log('Room not found');
        return;
      }

      const result = await gameService.joinGameRoom(room.id, user.id);
      
      if (result?.success) {
        console.log('Successfully joined game room:', result.data);
        navigate('/game-room-setup', { 
          state: { roomId: room.id, roomCode: room.room_code } 
        });
      } else {
        console.log('Failed to join game:', result?.error);
        // You might want to show this error to the user
      }
    } catch (error) {
      console.log('Error joining game:', error);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create':
        // Trigger create game modal or navigate
        break;
      case 'join':
        // Trigger join game modal or navigate
        break;
      case 'profile': navigate('/user-profile-management');
        break;
      default:
        break;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <GameFlowContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your game lobby...</p>
          </div>
        </div>
      </GameFlowContainer>
    );
  }

  // Don't render if user is not authenticated (redirect will handle this)
  if (!user) {
    return null;
  }

  return (
    <GameFlowContainer>
      {/* Header */}
      <ContextualHeader 
        title="Game Lobby" 
        subtitle={`Welcome back, ${userProfile?.display_name || 'Player'}!`}
        showBackButton={false}
        actions={[
          {
            label: 'Profile',
            onClick: () => navigate('/user-profile-management'),
            variant: 'outline'
          }
        ]}
      />

      {/* Connection Status */}
      <ConnectionStatusIndicator isConnected={isConnected} />

      {/* Main Content */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CreateGameCard onCreateGame={handleCreateGame} />
          <JoinGameCard 
            onJoinGame={handleJoinGame} 
            availableRooms={gameRooms}
            isLoading={isLoadingRooms}
          />
        </div>

        {/* User Stats */}
        <UserStatsPanel 
          stats={userStats}
          userProfile={userProfile}
        />

        {/* Live Game Invitations */}
        <LiveGameInvitations 
          gameRooms={gameRooms}
          onJoinGame={handleJoinGame}
          isLoading={isLoadingRooms}
        />

        {/* Recent Games */}
        <RecentGamesSection userId={user?.id} />
      </div>

      {/* Quick Actions Float */}
      <QuickActionsFloat onAction={handleQuickAction} />
    </GameFlowContainer>
  );
};

export default GameLobbyDashboard;