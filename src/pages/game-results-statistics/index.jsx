import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import GameFlowContainer from '../../components/ui/GameFlowContainer';
import WinnerAnnouncement from './components/WinnerAnnouncement';
import ScoreboardTable from './components/ScoreboardTable';
import WinningCards from './components/WinningCards';
import PersonalStatistics from './components/PersonalStatistics';
import SocialSharing from './components/SocialSharing';
import GameActions from './components/GameActions';
import Icon from '../../components/AppIcon';

const GameResultsStatistics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  // Mock game results data
  const mockGameData = {
    gameId: "game_" + Date.now(),
    roomCode: "SLGHT123",
    totalRounds: 8,
    totalPlayers: 5,
    duration: "24:35",
    completedAt: new Date().toISOString(),
    winner: {
      id: "player_1",
      username: "GameMaster2024",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GameMaster2024",
      score: 12,
      roundsWon: 4,
      isWinner: true
    },
    players: [
      {
        id: "player_1",
        username: "GameMaster2024",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GameMaster2024",
        score: 12,
        roundsWon: 4,
        isWinner: true
      },
      {
        id: "player_2",
        username: "ComedyKing",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ComedyKing",
        score: 10,
        roundsWon: 3,
        isWinner: false
      },
      {
        id: "player_3",
        username: "WittyPlayer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WittyPlayer",
        score: 8,
        roundsWon: 2,
        isWinner: false
      },
      {
        id: "player_4",
        username: "FunnyBone",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FunnyBone",
        score: 6,
        roundsWon: 1,
        isWinner: false
      },
      {
        id: "player_5",
        username: "JokeMaster",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JokeMaster",
        score: 4,
        roundsWon: 1,
        isWinner: false
      }
    ],
    settings: {
      maxRounds: 10,
      timeLimit: 60,
      judgeRotation: true
    }
  };

  const mockRoundDetails = {
    "player_1": [
      { round: 1, won: true, points: 2, submission: "May your coffee always be cold when you need it hot" },
      { round: 2, won: false, points: 0, submission: "May your phone battery die at 1%" },
      { round: 3, won: true, points: 2, submission: "May your WiFi disconnect during important calls" },
      { round: 4, won: false, points: 0, submission: "May your favorite show get cancelled" },
      { round: 5, won: true, points: 2, submission: "May your socks always be slightly damp" },
      { round: 6, won: true, points: 2, submission: "May your headphones tangle themselves" },
      { round: 7, won: false, points: 0, submission: "May your pizza always arrive cold" },
      { round: 8, won: true, points: 2, submission: "May your autocorrect betray you" }
    ],
    "player_2": [
      { round: 1, won: false, points: 0, submission: "May your keys hide when you\'re late" },
      { round: 2, won: true, points: 2, submission: "May your streaming service buffer forever" },
      { round: 3, won: false, points: 0, submission: "May your alarm not go off" },
      { round: 4, won: true, points: 2, submission: "May your food be too hot then too cold" },
      { round: 5, won: false, points: 0, submission: "May your pen run out of ink" },
      { round: 6, won: false, points: 0, submission: "May your elevator be out of order" },
      { round: 7, won: true, points: 2, submission: "May your GPS lead you astray" },
      { round: 8, won: false, points: 0, submission: "May your favorite song get stuck in your head" }
    ]
  };

  const mockWinningCombinations = [
    {
      round: 1,
      winner: "GameMaster2024",
      slightCard: "When someone cuts in line at the grocery store",
      curseCard: "May your coffee always be cold when you need it hot",
      points: 2,
      laughs: 8,
      favorites: 3
    },
    {
      round: 3,
      winner: "GameMaster2024",
      slightCard: "When your coworker takes credit for your idea",
      curseCard: "May your WiFi disconnect during important calls",
      points: 2,
      laughs: 7,
      favorites: 4
    },
    {
      round: 5,
      winner: "GameMaster2024",
      slightCard: "When someone doesn't return their shopping cart",
      curseCard: "May your socks always be slightly damp",
      points: 2,
      laughs: 9,
      favorites: 5
    }
  ];

  const mockPlayerStats = {
    cardsPlayed: 8,
    roundsWon: 4,
    totalPoints: 12,
    winRate: 50,
    favoriteSubmissions: 12,
    judgeSelections: 3,
    topSubmissions: [
      {
        round: 1,
        text: "May your coffee always be cold when you need it hot",
        votes: 4
      },
      {
        round: 5,
        text: "May your socks always be slightly damp",
        votes: 5
      },
      {
        round: 6,
        text: "May your headphones tangle themselves",
        votes: 3
      }
    ]
  };

  const mockAchievements = [
    {
      title: "Victory Royale",
      description: "Won your first game!",
      icon: "Trophy"
    },
    {
      title: "Comedy Gold",
      description: "Got the most laughs in a single round",
      icon: "Laugh"
    },
    {
      title: "Crowd Favorite",
      description: "Received 5+ favorites in one game",
      icon: "Heart"
    }
  ];

  // Load game data on component mount
  useEffect(() => {
    const loadGameData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Try to get data from session storage or use mock data
        const storedGameData = sessionStorage.getItem('gameResults');
        const storedPlayerData = sessionStorage.getItem('playerData');
        
        if (storedGameData) {
          setGameData(JSON.parse(storedGameData));
        } else {
          setGameData(mockGameData);
        }
        
        if (storedPlayerData) {
          setCurrentPlayer(JSON.parse(storedPlayerData));
        } else {
          setCurrentPlayer(mockGameData.players[0]); // Default to first player
        }
        
      } catch (error) {
        console.error('Error loading game data:', error);
        setGameData(mockGameData);
        setCurrentPlayer(mockGameData.players[0]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameData();
  }, []);

  // Handle play again action
  const handlePlayAgain = () => {
    sessionStorage.setItem('playAgainData', JSON.stringify({
      roomCode: gameData.roomCode,
      players: gameData.players,
      settings: gameData.settings
    }));
    navigate('/game-room-setup');
  };

  // Handle new game action
  const handleNewGame = () => {
    sessionStorage.removeItem('gameState');
    sessionStorage.removeItem('playerData');
    sessionStorage.removeItem('gameResults');
    sessionStorage.removeItem('playAgainData');
    navigate('/game-lobby-dashboard');
  };

  // Loading state
  if (isLoading) {
    return (
      <GameFlowContainer>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Calculating Results...
            </h2>
            <p className="text-muted-foreground">
              Analyzing your performance and generating statistics
            </p>
          </div>
        </div>
      </GameFlowContainer>
    );
  }

  // Error state
  if (!gameData) {
    return (
      <GameFlowContainer>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <Icon name="AlertCircle" size={64} className="text-error mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Game Data Found
            </h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the results for your game. This might happen if you navigated here directly.
            </p>
            <button
              onClick={() => navigate('/game-lobby-dashboard')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Return to Lobby
            </button>
          </div>
        </div>
      </GameFlowContainer>
    );
  }

  return (
    <GameFlowContainer gameState={gameData} playerData={currentPlayer}>
      <div className="min-h-screen bg-background">
        <ContextualHeader />
        
        <main className="pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Winner Announcement */}
            <div className="mb-8">
              <WinnerAnnouncement 
                winner={gameData.winner} 
                gameData={gameData} 
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Scoreboard and Winning Cards */}
              <div className="lg:col-span-2 space-y-6">
                <ScoreboardTable 
                  players={gameData.players} 
                  roundDetails={mockRoundDetails} 
                />
                
                <WinningCards 
                  winningCombinations={mockWinningCombinations} 
                />
              </div>

              {/* Right Column - Statistics and Actions */}
              <div className="space-y-6">
                <PersonalStatistics 
                  playerStats={mockPlayerStats} 
                  achievements={mockAchievements} 
                />
                
                <SocialSharing 
                  gameData={gameData}
                  playerStats={mockPlayerStats}
                  winningCombinations={mockWinningCombinations}
                />
                
                <GameActions 
                  gameData={gameData}
                  onPlayAgain={handlePlayAgain}
                  onNewGame={handleNewGame}
                />
              </div>
            </div>
          </div>
        </main>

        <BottomTabNavigation />
      </div>
    </GameFlowContainer>
  );
};

export default GameResultsStatistics;