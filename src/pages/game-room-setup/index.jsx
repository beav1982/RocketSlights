import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ContextualHeader from '../../components/ui/ContextualHeader';
import GameFlowContainer from '../../components/ui/GameFlowContainer';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import GameSettingsPanel from './components/GameSettingsPanel';
import RoomCodeDisplay from './components/RoomCodeDisplay';
import PlayerList from './components/PlayerList';
import PreGameChat from './components/PreGameChat';
import StartGameSection from './components/StartGameSection';
import ConnectionMonitor from './components/ConnectionMonitor';

const GameRoomSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, loading } = useAuth();
  
  // Get room data from navigation state
  const { roomId, roomCode } = location.state || {};

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/user-authentication', { replace: true });
      return;
    }
  }, [user, loading, navigate]);

  // Redirect to lobby if no room data
  useEffect(() => {
    if (!loading && user && (!roomId || !roomCode)) {
      navigate('/game-lobby-dashboard', { replace: true });
      return;
    }
  }, [user, loading, roomId, roomCode, navigate]);

  // Game state
  const [gameSettings, setGameSettings] = useState({
    gameName: 'Slights Game Room',
    scoreLimit: 5,
    allowSpectators: false,
    customRules: false,
    anonymousSubmissions: true,
    quickRounds: false
  });

  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // Players state - Initialize with current user
  const [players, setPlayers] = useState([]);
  const [roomCreatorId, setRoomCreatorId] = useState(null);

  // Initialize players with current user
  useEffect(() => {
    if (user && userProfile) {
      const currentPlayer = {
        id: user.id,
        displayName: userProfile.display_name || user.email.split('@')[0],
        avatar: userProfile.avatar || null,
        connectionStatus: 'connected',
        score: 0
      };
      
      setPlayers([currentPlayer]);
      setRoomCreatorId(user.id);
    }
  }, [user, userProfile]);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      userId: user?.id,
      username: userProfile?.display_name || 'You',
      avatar: userProfile?.avatar || null,
      content: 'Welcome to the game room! 🎮',
      timestamp: new Date(),
      read: true
    }
  ]);

  // Simulate connection monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      if (Math.random() > 0.98) {
        setConnectionStatus('reconnecting');
        setTimeout(() => {
          setConnectionStatus('connected');
        }, 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle game settings change
  const handleSettingsChange = (newSettings) => {
    setGameSettings(newSettings);
  };

  // Handle room code sharing
  const handleRoomCodeShare = (shareData) => {
    console.log('Room code shared:', shareData);
  };

  const handleRoomCodeCopy = (code) => {
    console.log('Room code copied:', code);
  };

  // Handle player actions
  const handleKickPlayer = (playerId) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    console.log('Player kicked:', playerId);
  };

  const handlePromotePlayer = (playerId) => {
    console.log('Player promoted to host:', playerId);
    setRoomCreatorId(playerId);
  };

  // Handle chat
  const handleSendMessage = (message) => {
    setChatMessages(prev => [...prev, message]);
  };

  const handleToggleChatExpanded = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  // Handle game start
  const handleStartGame = async () => {
    if (players.length < 2) {
      alert('You need at least 2 players to start the game');
      return;
    }

    setIsStartingGame(true);

    try {
      // Simulate game initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to active gameplay
      navigate('/active-gameplay-interface', {
        state: {
          gameSettings,
          players,
          roomCode,
          roomId,
          currentUser: {
            id: user.id,
            displayName: userProfile?.display_name || user.email.split('@')[0],
            avatar: userProfile?.avatar || null,
            connectionStatus: 'connected'
          }
        }
      });
    } catch (error) {
      console.error('Failed to start game:', error);
      setIsStartingGame(false);
    }
  };

  // Handle connection retry
  const handleRetryConnection = async () => {
    setConnectionStatus('connecting');
    
    // Simulate reconnection attempt
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() > 0.3) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <GameFlowContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading game room...</p>
          </div>
        </div>
      </GameFlowContainer>
    );
  }

  // Don't render if user is not authenticated (redirect will handle this)
  if (!user || !roomId || !roomCode) {
    return null;
  }

  const isRoomCreator = user?.id === roomCreatorId;
  const currentUser = {
    id: user.id,
    displayName: userProfile?.display_name || user.email.split('@')[0],
    avatar: userProfile?.avatar || null,
    connectionStatus: 'connected'
  };

  return (
    <GameFlowContainer>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <ContextualHeader
          gameCode={roomCode}
          connectionStatus={connectionStatus}
        />

        {/* Connection Monitor */}
        <ConnectionMonitor
          connectionStatus={connectionStatus}
          onRetryConnection={handleRetryConnection}
          roomCode={roomCode}
        />

        {/* Main Content */}
        <div className="px-4 py-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
              {/* Left Column - Settings & Room Code */}
              <div className="space-y-6">
                <RoomCodeDisplay
                  roomCode={roomCode}
                  onShare={handleRoomCodeShare}
                  onCopy={handleRoomCodeCopy}
                />
                
                <GameSettingsPanel
                  gameSettings={gameSettings}
                  onSettingsChange={handleSettingsChange}
                  isRoomCreator={isRoomCreator}
                />
              </div>

              {/* Middle Column - Players */}
              <div>
                <PlayerList
                  players={players}
                  currentUserId={user.id}
                  roomCreatorId={roomCreatorId}
                  onKickPlayer={handleKickPlayer}
                  onPromotePlayer={handlePromotePlayer}
                />
              </div>

              {/* Right Column - Chat & Start */}
              <div className="space-y-6">
                <PreGameChat
                  messages={chatMessages}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  isExpanded={true}
                  onToggleExpanded={handleToggleChatExpanded}
                />
                
                <StartGameSection
                  players={players}
                  gameSettings={gameSettings}
                  isRoomCreator={isRoomCreator}
                  onStartGame={handleStartGame}
                  isStarting={isStartingGame}
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-6">
              <RoomCodeDisplay
                roomCode={roomCode}
                onShare={handleRoomCodeShare}
                onCopy={handleRoomCodeCopy}
              />

              <PlayerList
                players={players}
                currentUserId={user.id}
                roomCreatorId={roomCreatorId}
                onKickPlayer={handleKickPlayer}
                onPromotePlayer={handlePromotePlayer}
              />

              <GameSettingsPanel
                gameSettings={gameSettings}
                onSettingsChange={handleSettingsChange}
                isRoomCreator={isRoomCreator}
              />

              <PreGameChat
                messages={chatMessages}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                isExpanded={isChatExpanded}
                onToggleExpanded={handleToggleChatExpanded}
              />

              <StartGameSection
                players={players}
                gameSettings={gameSettings}
                isRoomCreator={isRoomCreator}
                onStartGame={handleStartGame}
                isStarting={isStartingGame}
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomTabNavigation />
      </div>
    </GameFlowContainer>
  );
};

export default GameRoomSetup;