import React from 'react';
import Icon from '../../../components/AppIcon';

const WinningCards = ({ winningCombinations }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="Sparkles" size={24} className="text-secondary" />
            Winning Combinations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            The funniest slight-curse pairings that earned points
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {winningCombinations.map((combination, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-border/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-warning-foreground">
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  Round {combination.round}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Trophy" size={16} className="text-warning" />
                <span className="text-sm font-medium text-foreground">
                  {combination.winner}
                </span>
              </div>
            </div>

            {/* Card Combination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slight Card */}
              <div className="bg-card rounded-lg p-4 border-l-4 border-l-primary">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="MessageSquare" size={16} className="text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    Slight
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {combination.slightCard}
                </p>
              </div>

              {/* Curse Card */}
              <div className="bg-card rounded-lg p-4 border-l-4 border-l-secondary">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Zap" size={16} className="text-secondary" />
                  <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                    Curse
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {combination.curseCard}
                </p>
              </div>
            </div>

            {/* Reaction Stats */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Laugh" size={16} className="text-warning" />
                  <span className="text-sm text-muted-foreground">
                    {combination.laughs} laughs
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Heart" size={16} className="text-error" />
                  <span className="text-sm text-muted-foreground">
                    {combination.favorites} favorites
                  </span>
                </div>
              </div>
              <div className="text-sm font-medium text-primary">
                +{combination.points} points
              </div>
            </div>
          </div>
        ))}
      </div>

      {winningCombinations.length === 0 && (
        <div className="text-center py-8">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No winning combinations to display
          </p>
        </div>
      )}
    </div>
  );
};

export default WinningCards;