import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WinCelebration = ({ 
  winner = null,
  finalScores = [],
  gameStats = {},
  onPlayAgain = () => {},
  onReturnToLobby = () => {},
  isVisible = false,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('enter');

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      setAnimationPhase('enter');
      
      // Animation sequence
      const timer1 = setTimeout(() => setAnimationPhase('celebrate'), 500);
      const timer2 = setTimeout(() => setAnimationPhase('stable'), 2000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isVisible]);

  const handlePlayAgain = () => {
    onPlayAgain();
    navigate('/game-room-setup');
  };

  const handleReturnToLobby = () => {
    onReturnToLobby();
    navigate('/game-lobby-dashboard');
  };

  const handleViewResults = () => {
    navigate('/game-results-statistics');
  };

  if (!isVisible || !winner) {
    return null;
  }

  const sortedScores = [...finalScores].sort((a, b) => b.score - a.score);

  return (
    <div className={`
      fixed inset-0 z-200 bg-background/95 backdrop-blur-sm
      flex items-center justify-center p-4
      ${className}
    `}>
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 rounded-full animate-bounce
                ${i % 4 === 0 ? 'bg-primary' : ''}
                ${i % 4 === 1 ? 'bg-secondary' : ''}
                ${i % 4 === 2 ? 'bg-accent' : ''}
                ${i % 4 === 3 ? 'bg-warning' : ''}
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration modal */}
      <div className={`
        bg-card border border-border rounded-2xl p-8 max-w-md w-full
        shadow-game-modal text-center
        ${animationPhase === 'enter' ? 'animate-spring-scale' : ''}
        ${animationPhase === 'celebrate' ? 'animate-pulse-glow' : ''}
      `}>
        {/* Winner announcement */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-warning to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Crown" size={40} className="text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🎉 Game Over! 🎉
          </h1>
          
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold text-warning mb-1">
              {winner.username} Wins!
            </h2>
            <p className="text-sm text-muted-foreground">
              Final Score: {winner.score} points
            </p>
          </div>
        </div>

        {/* Final standings */}
        <div className="bg-background/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Final Standings
          </h3>
          <div className="space-y-2">
            {sortedScores.slice(0, 3).map((player, index) => (
              <div
                key={player.id}
                className={`
                  flex items-center justify-between p-2 rounded
                  ${index === 0 ? 'bg-warning/10' : 'bg-muted/20'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-warning text-warning-foreground' : 'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-foreground">
                    {player.username}
                  </span>
                </div>
                <span className="font-bold text-foreground">
                  {player.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Game stats */}
        {gameStats.totalRounds && (
          <div className="bg-background/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Game Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Rounds:</span>
                <span className="font-medium text-foreground ml-2">
                  {gameStats.totalRounds}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium text-foreground ml-2">
                  {gameStats.duration || '15m 30s'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={handlePlayAgain}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Play Again
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleViewResults}
              iconName="BarChart3"
              iconPosition="left"
            >
              View Stats
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReturnToLobby}
              iconName="Home"
              iconPosition="left"
            >
              Lobby
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinCelebration;