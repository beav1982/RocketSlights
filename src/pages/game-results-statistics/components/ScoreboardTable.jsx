import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const ScoreboardTable = ({ players, roundDetails }) => {
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  const togglePlayerExpansion = (playerId) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Icon name="Crown" size={20} className="text-warning" />;
      case 2:
        return <Icon name="Medal" size={20} className="text-slate-400" />;
      case 3:
        return <Icon name="Award" size={20} className="text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-medium">#{rank}</span>;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Icon name="BarChart3" size={24} className="text-primary" />
          Final Scoreboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Click on any player to see their round-by-round performance
        </p>
      </div>

      <div className="divide-y divide-border">
        {players.map((player, index) => (
          <div key={player.id} className="transition-colors hover:bg-muted/30">
            {/* Player Row */}
            <button
              onClick={() => togglePlayerExpansion(player.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                {/* Rank */}
                <div className="w-8 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`}
                    alt={`${player.username} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-foreground truncate">
                      {player.username}
                    </h3>
                    {player.isWinner && (
                      <Icon name="Trophy" size={16} className="text-warning" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {player.roundsWon} rounds won
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground">
                    {player.score}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    points
                  </div>
                </div>

                {/* Expand Icon */}
                <Icon
                  name={expandedPlayer === player.id ? "ChevronUp" : "ChevronDown"}
                  size={20}
                  className="text-muted-foreground ml-2"
                />
              </div>
            </button>

            {/* Expanded Round Details */}
            {expandedPlayer === player.id && (
              <div className="px-4 pb-4 bg-muted/10">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="font-medium text-foreground mb-3">
                    Round-by-Round Performance
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {roundDetails[player.id]?.map((round, roundIndex) => (
                      <div
                        key={roundIndex}
                        className={`
                          p-3 rounded-lg border text-sm
                          ${round.won 
                            ? 'bg-success/10 border-success/30 text-success-foreground' 
                            : 'bg-muted/20 border-border text-muted-foreground'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            Round {roundIndex + 1}
                          </span>
                          {round.won && (
                            <Icon name="Trophy" size={14} className="text-success" />
                          )}
                        </div>
                        <div className="text-xs opacity-80">
                          Points: +{round.points}
                        </div>
                        {round.submission && (
                          <div className="mt-2 text-xs italic">
                            "{round.submission}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreboardTable;