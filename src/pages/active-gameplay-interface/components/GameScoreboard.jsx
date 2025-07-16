import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameScoreboard = ({ 
  players = [], 
  currentJudge = null,
  nextJudge = null,
  winningScore = 7,
  isCollapsed = true,
  onToggle = () => {},
  className = '' 
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const leader = sortedPlayers[0];

  if (isCollapsed) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        iconName="Trophy"
        iconPosition="left"
        className={`fixed top-20 right-4 z-50 bg-card/95 backdrop-blur-sm ${className}`}
      >
        Scores
      </Button>
    );
  }

  return (
    <div className={`
      fixed top-20 right-4 z-50 bg-card border border-border rounded-xl p-4 
      shadow-game-modal backdrop-blur-sm w-80 max-w-[calc(100vw-2rem)]
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Trophy" size={20} className="text-warning" />
          <h3 className="text-lg font-semibold text-foreground">
            Scoreboard
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          iconName="X"
          className="p-1"
        />
      </div>

      {/* Win condition */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">First to win:</span>
          <span className="font-bold text-primary">{winningScore} points</span>
        </div>
      </div>

      {/* Players list */}
      <div className="space-y-2 mb-4">
        {sortedPlayers.map((player, index) => {
          const isCurrentJudge = currentJudge?.id === player.id;
          const isNextJudge = nextJudge?.id === player.id;
          const isLeader = leader.id === player.id && leader.score > 0;
          
          return (
            <div
              key={player.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${isCurrentJudge 
                  ? 'bg-accent/10 border-accent/20' :'bg-background border-border'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                {/* Rank */}
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${index === 0 && isLeader
                    ? 'bg-warning text-warning-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {index + 1}
                </div>

                {/* Player info */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">
                      {player.username}
                    </span>
                    {isCurrentJudge && (
                      <Icon name="Crown" size={14} className="text-accent" />
                    )}
                    {isNextJudge && (
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                    )}
                  </div>
                  {(isCurrentJudge || isNextJudge) && (
                    <span className="text-xs text-muted-foreground">
                      {isCurrentJudge ? 'Current Judge' : 'Next Judge'}
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="font-bold text-foreground">
                  {player.score}
                </div>
                <div className="text-xs text-muted-foreground">
                  {player.score === 1 ? 'point' : 'points'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Judge rotation info */}
      {currentJudge && nextJudge && (
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Judge rotation:</span>
            <div className="flex items-center space-x-2">
              <span className="text-foreground">{currentJudge.username}</span>
              <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
              <span className="text-foreground">{nextJudge.username}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScoreboard;