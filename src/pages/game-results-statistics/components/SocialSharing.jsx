import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialSharing = ({ gameData, playerStats, winningCombinations }) => {
  const [shareText, setShareText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    setIsGenerating(true);
    
    // Simulate text generation
    setTimeout(() => {
      const text = `🎉 Just played Slights Game! 🎉\n\n` +
        `🏆 Winner: ${gameData.winner.username} (${gameData.winner.score} points)\n` +
        `🎮 ${gameData.totalRounds} rounds with ${gameData.totalPlayers} players\n` +
        `⏱️ Game duration: ${gameData.duration}\n\n` +
        `My stats:\n` +
        `• ${playerStats.roundsWon} rounds won\n` +
        `• ${playerStats.totalPoints} total points\n` +
        `• ${playerStats.winRate}% win rate\n\n` +
        `Funniest moment: "${winningCombinations[0]?.slightCard}" + "${winningCombinations[0]?.curseCard}"\n\n` +
        `#SlightsGame #PartyGame #Gaming`;
      
      setShareText(text);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const shareToSocial = (platform) => {
    const encodedText = encodeURIComponent(shareText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${window.location.href}&text=${encodedText}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const downloadSummary = () => {
    const summaryData = {
      gameId: gameData.gameId,
      timestamp: new Date().toISOString(),
      winner: gameData.winner,
      players: gameData.players,
      rounds: gameData.totalRounds,
      duration: gameData.duration,
      winningCombinations: winningCombinations,
      personalStats: playerStats
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slights-game-${gameData.gameId}-summary.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="Share2" size={24} className="text-accent" />
            Share Results
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Share your game results with friends
          </p>
        </div>
      </div>

      {/* Generate Share Text */}
      <div className="mb-6">
        <Button
          onClick={generateShareText}
          loading={isGenerating}
          iconName="Sparkles"
          iconPosition="left"
          className="mb-4"
        >
          Generate Share Text
        </Button>

        {shareText && (
          <div className="bg-muted/20 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Generated Summary
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                iconName={copied ? "Check" : "Copy"}
                iconPosition="left"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-40 overflow-y-auto">
              {shareText}
            </div>
          </div>
        )}
      </div>

      {/* Social Media Buttons */}
      {shareText && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Share on Social Media
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareToSocial('twitter')}
              iconName="Twitter"
              iconPosition="left"
              className="justify-start"
            >
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareToSocial('facebook')}
              iconName="Facebook"
              iconPosition="left"
              className="justify-start"
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareToSocial('linkedin')}
              iconName="Linkedin"
              iconPosition="left"
              className="justify-start"
            >
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareToSocial('whatsapp')}
              iconName="MessageCircle"
              iconPosition="left"
              className="justify-start"
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareToSocial('telegram')}
              iconName="Send"
              iconPosition="left"
              className="justify-start"
            >
              Telegram
            </Button>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Export Game Data
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSummary}
            iconName="Download"
            iconPosition="left"
          >
            Download Summary
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            iconName="Printer"
            iconPosition="left"
          >
            Print Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialSharing;