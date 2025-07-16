import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlayerHand = ({ 
  cards = [], 
  selectedCard = null, 
  onCardSelect = () => {},
  onSubmit = () => {},
  isSubmitted = false,
  isLoading = false,
  className = '' 
}) => {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (card) => {
    if (isSubmitted) return;
    
    if (selectedCard?.id === card.id) {
      setExpandedCard(expandedCard === card.id ? null : card.id);
    } else {
      onCardSelect(card);
      setExpandedCard(null);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Check" size={24} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Card Submitted!
          </h3>
          <p className="text-muted-foreground">
            Waiting for other players to submit their cards...
          </p>
          {isLoading && (
            <div className="flex items-center justify-center mt-4">
              <Icon name="Loader2" size={20} className="animate-spin text-primary mr-2" />
              <span className="text-sm text-muted-foreground">
                Processing submissions...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Your Hand
        </h3>
        <div className="text-sm text-muted-foreground">
          {cards.length} cards
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
        {cards.map((card) => {
          const isSelected = selectedCard?.id === card.id;
          const isExpanded = expandedCard === card.id;
          
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                relative bg-background border-2 rounded-lg p-3 cursor-pointer
                transition-all duration-200 hover:shadow-lg
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-game-card' 
                  : 'border-border hover:border-primary/50'
                }
                ${isExpanded ? 'col-span-full' : ''}
              `}
            >
              {/* Card content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-secondary">
                    CURSE
                  </span>
                  {isSelected && (
                    <Icon name="Check" size={16} className="text-primary" />
                  )}
                </div>
                
                <p className={`
                  text-sm text-foreground leading-relaxed
                  ${isExpanded ? 'text-base' : 'line-clamp-3'}
                `}>
                  {card.text}
                </p>
                
                {card.text.length > 100 && !isExpanded && (
                  <button className="text-xs text-primary hover:text-primary/80">
                    Read more...
                  </button>
                )}
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none animate-pulse-glow" />
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      <div className="flex justify-center">
        <Button
          variant="default"
          size="lg"
          onClick={onSubmit}
          disabled={!selectedCard || isLoading}
          loading={isLoading}
          iconName="Send"
          iconPosition="right"
          className="px-8"
        >
          Submit Card
        </Button>
      </div>
    </div>
  );
};

export default PlayerHand;