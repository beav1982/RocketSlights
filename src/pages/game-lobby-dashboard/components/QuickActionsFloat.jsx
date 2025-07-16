import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActionsFloat = ({ onInviteFriends = () => {}, onShareGame = () => {} }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const quickActions = [
    {
      id: 'invite-friends',
      label: 'Invite Friends',
      icon: 'UserPlus',
      color: 'bg-primary',
      onClick: () => {
        onInviteFriends();
        setIsExpanded(false);
      }
    },
    {
      id: 'share-game',
      label: 'Share Game',
      icon: 'Share2',
      color: 'bg-secondary',
      onClick: () => {
        setShowShareOptions(true);
        setIsExpanded(false);
      }
    },
    {
      id: 'random-join',
      label: 'Random Game',
      icon: 'Shuffle',
      color: 'bg-accent',
      onClick: () => {
        // Simulate joining a random game
        const randomCodes = ['RANDOM1', 'QUICK22', 'FAST33'];
        const randomCode = randomCodes[Math.floor(Math.random() * randomCodes.length)];
        
        sessionStorage.setItem('currentGame', JSON.stringify({
          roomCode: randomCode,
          hostId: 'random-host',
          joinedAt: new Date().toISOString(),
          maxPlayers: 8,
          currentPlayers: Math.floor(Math.random() * 6) + 2,
          status: 'waiting',
          isRandom: true
        }));
        
        navigate('/game-room-setup');
        setIsExpanded(false);
      }
    }
  ];

  const shareOptions = [
    {
      id: 'copy-link',
      label: 'Copy Link',
      icon: 'Copy',
      onClick: () => {
        navigator.clipboard.writeText('https://slights.game/join');
        setShowShareOptions(false);
      }
    },
    {
      id: 'share-whatsapp',
      label: 'WhatsApp',
      icon: 'MessageCircle',
      onClick: () => {
        window.open('https://wa.me/?text=Join me for a game of Slights! https://slights.game/join', '_blank');
        setShowShareOptions(false);
      }
    },
    {
      id: 'share-twitter',
      label: 'Twitter',
      icon: 'Twitter',
      onClick: () => {
        window.open('https://twitter.com/intent/tweet?text=Playing Slights Game! Join me: https://slights.game/join', '_blank');
        setShowShareOptions(false);
      }
    }
  ];

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
    setShowShareOptions(false);
  };

  return (
    <>
      {/* Main floating action button */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="relative">
          {/* Quick action buttons */}
          {isExpanded && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
              {quickActions.map((action, index) => (
                <div
                  key={action.id}
                  className="flex items-center space-x-3 animate-in slide-in-from-right-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="bg-card border border-border text-foreground text-sm font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    {action.label}
                  </span>
                  <button
                    onClick={action.onClick}
                    className={`
                      w-12 h-12 ${action.color} text-white rounded-full shadow-lg
                      flex items-center justify-center
                      hover:scale-110 active:scale-95
                      transition-all duration-200 ease-out
                      animate-pulse-glow
                    `}
                  >
                    <Icon name={action.icon} size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Main button */}
          <button
            onClick={handleMainButtonClick}
            className={`
              w-14 h-14 bg-gradient-to-br from-primary to-secondary text-white rounded-full shadow-lg
              flex items-center justify-center
              hover:scale-110 active:scale-95
              transition-all duration-200 ease-out
              animate-pulse-glow
              ${isExpanded ? 'rotate-45' : 'rotate-0'}
            `}
          >
            <Icon name="Plus" size={24} />
          </button>
        </div>
      </div>

      {/* Share options modal */}
      {showShareOptions && (
        <div className="fixed inset-0 z-200 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Share Slights Game
              </h3>
              <button
                onClick={() => setShowShareOptions(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Icon name="X" size={18} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-2">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                    <Icon name={option.icon} size={18} className="text-primary" />
                  </div>
                  <span className="font-medium text-foreground">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Invite friends to play Slights and have fun together!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for expanded state */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default QuickActionsFloat;