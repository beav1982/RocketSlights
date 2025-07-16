import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoomCodeDisplay = ({ roomCode, onShare, onCopy }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopySuccess(true);
      onCopy?.(roomCode);
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy room code:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join my Slights Game!',
      text: `Join my game room with code: ${roomCode}`,
      url: `${window.location.origin}/game-room-setup?code=${roomCode}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copy
        await handleCopyCode();
      }
      onShare?.(shareData);
    } catch (error) {
      console.error('Failed to share room code:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 mb-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Icon name="Hash" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Room Code</h3>
        </div>
        
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 mb-4">
          <div className="font-mono text-3xl font-bold text-primary tracking-wider mb-2">
            {roomCode}
          </div>
          <p className="text-sm text-muted-foreground">
            Share this code with friends to join your game
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            onClick={handleCopyCode}
            iconName={copySuccess ? "Check" : "Copy"}
            iconPosition="left"
            className={`transition-all duration-200 ${
              copySuccess ? 'bg-success text-success-foreground' : ''
            }`}
          >
            {copySuccess ? 'Copied!' : 'Copy Code'}
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            iconName="Share2"
            iconPosition="left"
          >
            Share Room
          </Button>
        </div>

        {/* Quick share options */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-3">Quick Share</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => {
                const text = `Join my Slights Game! Room code: ${roomCode}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="w-10 h-10 bg-green-500/10 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Share on WhatsApp"
            >
              <Icon name="MessageCircle" size={16} className="text-green-500" />
            </button>
            
            <button
              onClick={() => {
                const text = `Join my Slights Game! Room code: ${roomCode}`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Share on Twitter"
            >
              <Icon name="Twitter" size={16} className="text-blue-500" />
            </button>
            
            <button
              onClick={() => {
                const subject = 'Join my Slights Game!';
                const body = `Hey! Join my game room with code: ${roomCode}\n\nClick here to join: ${window.location.origin}/game-room-setup?code=${roomCode}`;
                window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
              }}
              className="w-10 h-10 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Share via Email"
            >
              <Icon name="Mail" size={16} className="text-orange-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCodeDisplay;