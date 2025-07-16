import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import GameFlowContainer from '../../components/ui/GameFlowContainer';
import SlightCard from './components/SlightCard';
import PlayerHand from './components/PlayerHand';
import JudgeSubmissions from './components/JudgeSubmissions';
import GameScoreboard from './components/GameScoreboard';
import GameChat from './components/GameChat';
import ConnectionStatus from './components/ConnectionStatus';
import WinCelebration from './components/WinCelebration';
import { 
  getRandomSlightCard, 
  getRandomCurseCards, 
  GAME_SETTINGS 
} from '../../constants/gameCards';

const ActiveGameplayInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Game state
  const [gameState, setGameState] = useState('submission'); // 'submission' | 'judging' | 'results' | 'finished'
  const [currentRound, setCurrentRound] = useState(1);
  const [timer, setTimer] = useState(GAME_SETTINGS.SUBMISSION_TIME);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  
  // Player state
  const [currentPlayer, setCurrentPlayer] = useState({
    id: 'player-1',
    username: 'You',
    score: 2,
    isJudge: false
  });
  
  // Game data - Initialize with actual card data
  const [currentSlight, setCurrentSlight] = useState(getRandomSlightCard());
  const [playerHand, setPlayerHand] = useState(getRandomCurseCards(GAME_SETTINGS.HAND_SIZE));
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Judge state
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Players and scoring
  const [players, setPlayers] = useState([
    { id: 'player-1', username: 'You', score: 2, isConnected: true },
    { id: 'player-2', username: 'Sarah', score: 3, isConnected: true },
    { id: 'player-3', username: 'Mike', score: 1, isConnected: true },
    { id: 'player-4', username: 'Emma', score: 4, isConnected: false }
  ]);
  
  const [currentJudge, setCurrentJudge] = useState({ id: 'player-2', username: 'Sarah' });
  const [nextJudge, setNextJudge] = useState({ id: 'player-3', username: 'Mike' });
  
  // UI state
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      senderId: 'player-2',
      senderName: 'Sarah',
      text: 'This slight is so relatable! 😂',
      timestamp: Date.now() - 120000,
      type: 'message'
    },
    {
      id: 'msg-2',
      senderId: 'system',
      text: 'Mike has submitted their card',
      timestamp: Date.now() - 60000,
      type: 'system'
    }
  ]);

  // Timer management
  useEffect(() => {
    if (timer > 0 && gameState !== 'finished') {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleTimeUp();
    }
  }, [timer, gameState]);

  // Check for game winner
  useEffect(() => {
    const winner = players.find(player => player.score >= GAME_SETTINGS.WINNING_SCORE);
    if (winner && gameState !== 'finished') {
      setGameState('finished');
      setShowWinCelebration(true);
    }
  }, [players, gameState]);

  // Load game state from session storage
  useEffect(() => {
    const savedGameState = sessionStorage.getItem('gameState');
    if (savedGameState) {
      try {
        const parsed = JSON.parse(savedGameState);
        // Restore relevant game state
        setCurrentRound(parsed.round || 1);
        setGameState(parsed.phase || 'submission');
      } catch (error) {
        console.error('Failed to restore game state:', error);
      }
    }
  }, []);

  // Simulate network connection changes
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      if (Math.random() > 0.98) { // 2% chance of connection issue
        setConnectionStatus('reconnecting');
        setTimeout(() => setConnectionStatus('connected'), 3000);
      }
    }, 5000);

    return () => clearInterval(connectionInterval);
  }, []);

  const handleTimeUp = () => {
    if (gameState === 'submission' && !isSubmitted) {
      // Auto-submit random card if player hasn't submitted
      const randomCard = playerHand[Math.floor(Math.random() * playerHand.length)];
      handleSubmitCard(randomCard);
    } else if (gameState === 'judging' && currentPlayer.isJudge && !selectedSubmission) {
      // Auto-select random submission if judge hasn't selected
      const randomSubmission = submissions[Math.floor(Math.random() * submissions.length)];
      handleSelectWinner(randomSubmission);
    }
  };

  const handleCardSelect = (card) => {
    if (isSubmitted || currentPlayer.isJudge) return;
    setSelectedCard(card);
  };

  const handleSubmitCard = async (card = selectedCard) => {
    if (!card || isSubmitted || currentPlayer.isJudge) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setSelectedCard(null);
      
      // Add system message
      setChatMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        senderId: 'system',
        text: 'You have submitted your card',
        timestamp: Date.now(),
        type: 'system'
      }]);
      
      // Simulate other players submitting
      setTimeout(() => {
        setGameState('judging');
        setTimer(GAME_SETTINGS.JUDGING_TIME);
        
        // Mock submissions for judge - use real curse cards
        if (currentPlayer.isJudge) {
          const mockSubmissions = getRandomCurseCards(3);
          setSubmissions(mockSubmissions.map((card, index) => ({
            id: `sub-${index + 1}`,
            text: card.text,
            playerId: `anonymous-${index + 1}`
          })));
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to submit card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmissionSelect = (submission) => {
    if (!currentPlayer.isJudge) return;
    setSelectedSubmission(submission);
  };

  const handleSelectWinner = async (submission = selectedSubmission) => {
    if (!submission || !currentPlayer.isJudge) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update scores (mock)
      setPlayers(prev => prev.map(player => 
        player.id === 'player-3' // Mock winner
          ? { ...player, score: player.score + 1 }
          : player
      ));
      
      // Add system message
      setChatMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        senderId: 'system',
        text: 'Mike wins this round!',
        timestamp: Date.now(),
        type: 'system'
      }]);
      
      // Move to next round
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setGameState('submission');
        setTimer(GAME_SETTINGS.SUBMISSION_TIME);
        setIsSubmitted(false);
        setSelectedCard(null);
        setSelectedSubmission(null);
        setSubmissions([]);
        
        // Rotate judge
        setCurrentJudge(nextJudge);
        setNextJudge(players.find(p => p.id !== nextJudge.id && p.id !== currentJudge.id) || players[0]);
        
        // Update current player judge status
        setCurrentPlayer(prev => ({
          ...prev,
          isJudge: nextJudge.id === prev.id
        }));
        
        // Generate new slight card for next round
        setCurrentSlight(getRandomSlightCard());
        
        // Deal new cards to player's hand (replace used cards)
        const newHandSize = GAME_SETTINGS.HAND_SIZE;
        const newHand = getRandomCurseCards(newHandSize);
        setPlayerHand(newHand);
        
      }, 3000);
      
    } catch (error) {
      console.error('Failed to select winner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentPlayer.id,
      senderName: currentPlayer.username,
      text: message,
      timestamp: Date.now(),
      type: 'message'
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // Simulate other players responding
    setTimeout(() => {
      const responses = [
        "Haha, good one!",
        "That\'s perfect for this slight!",
        "I wish I had that card!",
        "Nice choice!"
      ];
      
      const randomPlayer = players.find(p => p.id !== currentPlayer.id && p.isConnected);
      if (randomPlayer && Math.random() > 0.5) {
        setChatMessages(prev => [...prev, {
          id: `msg-${Date.now() + 1}`,
          senderId: randomPlayer.id,
          senderName: randomPlayer.username,
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: Date.now() + 1000,
          type: 'message'
        }]);
      }
    }, 2000);
  };

  const handleReconnect = () => {
    setConnectionStatus('connecting');
    setTimeout(() => setConnectionStatus('connected'), 2000);
  };

  const handlePlayAgain = () => {
    // Reset game state
    setGameState('submission');
    setCurrentRound(1);
    setTimer(GAME_SETTINGS.SUBMISSION_TIME);
    setIsSubmitted(false);
    setSelectedCard(null);
    setSelectedSubmission(null);
    setSubmissions([]);
    setShowWinCelebration(false);
    
    // Reset game with new cards
    setCurrentSlight(getRandomSlightCard());
    setPlayerHand(getRandomCurseCards(GAME_SETTINGS.HAND_SIZE));
    
    // Reset scores
    setPlayers(prev => prev.map(player => ({ ...player, score: 0 })));
    
    navigate('/game-room-setup');
  };

  const handleReturnToLobby = () => {
    navigate('/game-lobby-dashboard');
  };

  const connectedPlayers = players.filter(p => p.isConnected).length;
  const winner = players.find(player => player.score >= GAME_SETTINGS.WINNING_SCORE);

  return (
    <GameFlowContainer
      gameState={{ 
        phase: gameState, 
        round: currentRound, 
        timer,
        isJudge: currentPlayer.isJudge 
      }}
      playerData={currentPlayer}
      className="bg-background min-h-screen"
    >
      {/* Connection status */}
      <ConnectionStatus
        status={connectionStatus}
        playersConnected={connectedPlayers}
        totalPlayers={players.length}
        onReconnect={handleReconnect}
      />

      {/* Main game interface */}
      <div className="flex flex-col min-h-screen pb-20">
        {/* Current slight */}
        <div className="p-4">
          <SlightCard
            slightText={currentSlight.text}
            roundNumber={currentRound}
            timer={timer}
            isJudge={currentPlayer.isJudge}
          />
        </div>

        {/* Game content */}
        <div className="flex-1 p-4">
          {currentPlayer.isJudge ? (
            <JudgeSubmissions
              submissions={submissions}
              selectedSubmission={selectedSubmission}
              onSubmissionSelect={handleSubmissionSelect}
              onSelectWinner={handleSelectWinner}
              isLoading={isLoading}
            />
          ) : (
            <PlayerHand
              cards={playerHand}
              selectedCard={selectedCard}
              onCardSelect={handleCardSelect}
              onSubmit={handleSubmitCard}
              isSubmitted={isSubmitted}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Floating UI elements */}
      <GameScoreboard
        players={players}
        currentJudge={currentJudge}
        nextJudge={nextJudge}
        winningScore={GAME_SETTINGS.WINNING_SCORE}
        isCollapsed={!isScoreboardOpen}
        onToggle={() => setIsScoreboardOpen(!isScoreboardOpen)}
      />

      <GameChat
        messages={chatMessages}
        currentPlayer={currentPlayer}
        onSendMessage={handleSendMessage}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Win celebration */}
      <WinCelebration
        winner={winner}
        finalScores={players}
        gameStats={{ totalRounds: currentRound, duration: '15m 30s' }}
        onPlayAgain={handlePlayAgain}
        onReturnToLobby={handleReturnToLobby}
        isVisible={showWinCelebration}
      />

      {/* Bottom navigation */}
      <BottomTabNavigation />
    </GameFlowContainer>
  );
};

export default ActiveGameplayInterface;