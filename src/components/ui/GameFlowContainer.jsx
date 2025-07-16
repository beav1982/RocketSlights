import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GameFlowContainer = ({ 
  children, 
  gameState = null, 
  playerData = null,
  onGameStateChange = () => {},
  onPlayerUpdate = () => {},
  className = ''
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [gamePhase, setGamePhase] = useState('setup');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);

  const gameFlowPaths = [
    '/game-room-setup',
    '/active-gameplay-interface', 
    '/game-results-statistics'
  ];

  const isGameFlowPath = gameFlowPaths.includes(location.pathname);

  // WebSocket connection management - Fixed to prevent multiple connections
  useEffect(() => {
    if (!isGameFlowPath) {
      // Clean up connection when leaving game flow
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setConnectionStatus('disconnected');
      return;
    }

    // Prevent multiple connection attempts
    if (isConnectingRef.current || wsRef.current) {
      return;
    }

    const connectWebSocket = () => {
      if (isConnectingRef.current) return;
      
      isConnectingRef.current = true;
      
      try {
        // Mock WebSocket connection for demo
        setConnectionStatus('connecting');
        
        // Simulate connection establishment
        const connectTimeout = setTimeout(() => {
          if (isConnectingRef.current) {
            setConnectionStatus('connected');
            console.log('Game WebSocket connected');
            isConnectingRef.current = false;
          }
        }, 1000);

        // Simulate connection monitoring
        const heartbeatInterval = setInterval(() => {
          if (wsRef.current && Math.random() > 0.95) { // 5% chance of connection issue
            setConnectionStatus('reconnecting');
            setTimeout(() => {
              if (wsRef.current) {
                setConnectionStatus('connected');
              }
            }, 2000);
          }
        }, 5000);

        // Store references for cleanup
        wsRef.current = {
          close: () => {
            clearTimeout(connectTimeout);
            clearInterval(heartbeatInterval);
            isConnectingRef.current = false;
            setConnectionStatus('disconnected');
          }
        };

        return () => {
          clearTimeout(connectTimeout);
          clearInterval(heartbeatInterval);
          isConnectingRef.current = false;
        };
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionStatus('disconnected');
        isConnectingRef.current = false;
        scheduleReconnect();
      }
    };

    const scheduleReconnect = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isGameFlowPath && !wsRef.current) {
          connectWebSocket();
        }
      }, 3000);
    };

    const cleanup = connectWebSocket();

    return () => {
      if (cleanup) cleanup();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [isGameFlowPath, location.pathname]);

  // Game phase management
  useEffect(() => {
    const path = location.pathname;
    
    switch (path) {
      case '/game-room-setup': setGamePhase('setup');
        break;
      case '/active-gameplay-interface': setGamePhase('active');
        break;
      case '/game-results-statistics': setGamePhase('results');
        break;
      default:
        setGamePhase('idle');
    }
  }, [location.pathname]);

  // Game state persistence
  useEffect(() => {
    if (!isGameFlowPath || !gameState) return;

    try {
      sessionStorage.setItem('gameState', JSON.stringify({
        ...gameState,
        phase: gamePhase,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to persist game state:', error);
    }
  }, [gameState, gamePhase, isGameFlowPath]);

  // Player data persistence
  useEffect(() => {
    if (!isGameFlowPath || !playerData) return;

    try {
      sessionStorage.setItem('playerData', JSON.stringify({
        ...playerData,
        lastActive: Date.now()
      }));
    } catch (error) {
      console.error('Failed to persist player data:', error);
    }
  }, [playerData, isGameFlowPath]);

  // Handle game flow transitions
  const handleGameTransition = (nextPhase, data = {}) => {
    const transitions = {
      'setup-to-active': '/active-gameplay-interface',
      'active-to-results': '/game-results-statistics',
      'results-to-setup': '/game-room-setup',
      'exit-to-lobby': '/game-lobby-dashboard'
    };

    const targetPath = transitions[nextPhase];
    if (targetPath) {
      // Persist transition data
      if (Object.keys(data).length > 0) {
        sessionStorage.setItem('transitionData', JSON.stringify(data));
      }
      
      navigate(targetPath);
    }
  };

  // Real-time update handlers
  const handleRealTimeUpdate = (updateType, data) => {
    switch (updateType) {
      case 'gameState':
        onGameStateChange(data);
        break;
      case 'playerUpdate':
        onPlayerUpdate(data);
        break;
      case 'connectionStatus':
        setConnectionStatus(data.status);
        break;
      default:
        console.log('Unknown update type:', updateType, data);
    }
  };

  // Provide context to child components
  const gameFlowContext = {
    gamePhase,
    connectionStatus,
    gameState,
    playerData,
    onTransition: handleGameTransition,
    onRealTimeUpdate: handleRealTimeUpdate,
    isGameActive: gamePhase === 'active'
  };

  if (!isGameFlowPath) {
    return children;
  }

  return (
    <div className={`
      game-flow-container min-h-screen bg-background
      ${gamePhase === 'active' ? 'overflow-hidden' : ''}
      ${className}
    `}>
      {/* Connection status overlay */}
      {connectionStatus !== 'connected' && (
        <div className="fixed top-0 left-0 right-0 z-200 bg-warning/90 backdrop-blur-sm">
          <div className="flex items-center justify-center py-2 px-4">
            <div className="flex items-center space-x-2 text-warning-foreground">
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                {connectionStatus === 'connecting' && 'Connecting to game...'}
                {connectionStatus === 'reconnecting' && 'Reconnecting...'}
                {connectionStatus === 'disconnected' && 'Connection lost. Retrying...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Game flow content */}
      <div className={`
        game-flow-content
        ${connectionStatus !== 'connected' ? 'pt-10' : ''}
        ${gamePhase === 'active' ? 'h-screen' : 'min-h-screen'}
      `}>
        {React.isValidElement(children) 
          ? React.cloneElement(children, { 
              gameFlowContext,
              ...gameFlowContext 
            })
          : children
        }
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-20 right-4 bg-card border border-border rounded-lg p-2 text-xs font-mono z-90">
          <div>Phase: {gamePhase}</div>
          <div>Status: {connectionStatus}</div>
          <div>Path: {location.pathname}</div>
        </div>
      )}
    </div>
  );
};

export default GameFlowContainer;