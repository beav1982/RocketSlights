import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WinnerAnnouncement = ({ winner, gameData }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: ['#7C3AED', '#F97316', '#06B6D4', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-2xl p-8 text-center overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                top: '-10px'
              }}
            />
          ))}
        </div>
      )}

      {/* Winner Crown */}
      <div className="relative inline-block mb-6">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Icon name="Crown" size={32} className="text-warning animate-pulse-glow" />
        </div>
        
        {/* Winner Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-warning shadow-lg overflow-hidden mx-auto">
            <Image
              src={winner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${winner.username}`}
              alt={`${winner.username} avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center">
            <Icon name="Trophy" size={16} className="text-warning-foreground" />
          </div>
        </div>
      </div>

      {/* Winner Details */}
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          🎉 {winner.username} Wins! 🎉
        </h1>
        <p className="text-lg text-muted-foreground">
          Congratulations on your victory!
        </p>
      </div>

      {/* Final Score */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {winner.score}
          </div>
          <div className="text-sm text-muted-foreground">
            Final Score
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="text-xl font-semibold text-foreground">
              {gameData.totalRounds}
            </div>
            <div className="text-xs text-muted-foreground">
              Rounds
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-foreground">
              {gameData.totalPlayers}
            </div>
            <div className="text-xs text-muted-foreground">
              Players
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-foreground">
              {gameData.duration}
            </div>
            <div className="text-xs text-muted-foreground">
              Duration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;