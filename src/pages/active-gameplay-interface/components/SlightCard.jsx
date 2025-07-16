import React from 'react';
import Icon from '../../../components/AppIcon';

const SlightCard = ({ 
  slightText, 
  roundNumber, 
  timer, 
  isJudge = false,
  className = '' 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`
      bg-gradient-to-br from-primary/10 to-secondary/10 
      border-2 border-primary/20 rounded-xl p-6
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={20} className="text-primary" />
          <span className="text-sm font-medium text-primary">
            Round {roundNumber}
          </span>
        </div>
        
        {timer > 0 && (
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full
            ${timer <= 10 
              ? 'bg-error/20 text-error animate-pulse-glow' :'bg-warning/20 text-warning'
            }
          `}>
            <Icon name="Clock" size={16} />
            <span className="font-mono text-sm font-medium">
              {formatTime(timer)}
            </span>
          </div>
        )}
      </div>

      {/* Slight text */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {isJudge ? 'You are judging this round:' : 'Current Slight:'}
        </h2>
        <div className="bg-card/50 rounded-lg p-4 border border-border/50">
          <p className="text-foreground text-base leading-relaxed">
            {slightText}
          </p>
        </div>
      </div>

      {/* Judge indicator */}
      {isJudge && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-3 py-1 rounded-full">
            <Icon name="Crown" size={16} />
            <span className="text-sm font-medium">You're the Judge</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlightCard;