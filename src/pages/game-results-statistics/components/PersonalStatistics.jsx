import React from 'react';
import Icon from '../../../components/AppIcon';

const PersonalStatistics = ({ playerStats, achievements }) => {
  const statItems = [
    {
      label: 'Cards Played',
      value: playerStats.cardsPlayed,
      icon: 'Cards',
      color: 'text-primary'
    },
    {
      label: 'Rounds Won',
      value: playerStats.roundsWon,
      icon: 'Trophy',
      color: 'text-warning'
    },
    {
      label: 'Total Points',
      value: playerStats.totalPoints,
      icon: 'Target',
      color: 'text-success'
    },
    {
      label: 'Win Rate',
      value: `${playerStats.winRate}%`,
      icon: 'TrendingUp',
      color: 'text-accent'
    },
    {
      label: 'Favorite Submissions',
      value: playerStats.favoriteSubmissions,
      icon: 'Heart',
      color: 'text-error'
    },
    {
      label: 'Judge Selections',
      value: playerStats.judgeSelections,
      icon: 'Gavel',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="BarChart" size={24} className="text-accent" />
            Your Performance
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personal statistics from this game
          </p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statItems.map((stat, index) => (
          <div
            key={index}
            className="bg-muted/20 rounded-lg p-4 text-center hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-center mb-2">
              <Icon name={stat.icon} size={24} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <Icon name="Award" size={20} className="text-warning" />
            Achievements Unlocked
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-warning/10 to-secondary/10 rounded-lg p-4 border border-warning/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                    <Icon name={achievement.icon} size={20} className="text-warning" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Submissions */}
      {playerStats.topSubmissions && playerStats.topSubmissions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <Icon name="Star" size={20} className="text-warning" />
            Your Best Submissions
          </h3>
          <div className="space-y-3">
            {playerStats.topSubmissions.map((submission, index) => (
              <div
                key={index}
                className="bg-muted/10 rounded-lg p-4 border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Round {submission.round}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Icon name="Heart" size={14} className="text-error" />
                    <span className="text-sm text-muted-foreground">
                      {submission.votes} votes
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground italic">
                  "{submission.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalStatistics;