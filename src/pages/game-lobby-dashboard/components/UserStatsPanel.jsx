import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStatsPanel = () => {
  const userStats = {
    gamesPlayed: 47,
    gamesWon: 12,
    winRate: 25.5,
    favoriteCards: 8,
    totalPoints: 1247,
    currentStreak: 3,
    bestStreak: 7,
    averageRank: 2.8
  };

  const achievements = [
    {
      id: 'first-win',
      name: 'First Victory',
      description: 'Won your first game',
      icon: 'Trophy',
      unlocked: true,
      rarity: 'common'
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Win 5 games in a row',
      icon: 'Zap',
      unlocked: false,
      rarity: 'rare',
      progress: 3,
      target: 5
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Play with 20 different players',
      icon: 'Users',
      unlocked: true,
      rarity: 'uncommon'
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'text-muted-foreground';
      case 'uncommon':
        return 'text-success';
      case 'rare':
        return 'text-primary';
      case 'epic':
        return 'text-secondary';
      case 'legendary':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const StatCard = ({ icon, label, value, subtitle, trend }) => (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name={icon} size={18} className="text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs ${
            trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'} 
              size={12} 
            />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        <div className="text-sm text-muted-foreground">
          {label}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Your Stats
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon="Gamepad2"
            label="Games Played"
            value={userStats.gamesPlayed}
            trend={12}
          />
          
          <StatCard
            icon="Trophy"
            label="Games Won"
            value={userStats.gamesWon}
            subtitle={`${userStats.winRate}% win rate`}
            trend={5}
          />
          
          <StatCard
            icon="Zap"
            label="Current Streak"
            value={userStats.currentStreak}
            subtitle={`Best: ${userStats.bestStreak}`}
            trend={0}
          />
          
          <StatCard
            icon="Star"
            label="Total Points"
            value={userStats.totalPoints.toLocaleString()}
            subtitle={`Avg rank: ${userStats.averageRank}`}
            trend={8}
          />
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Performance Overview
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>Last 30 days</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Win Rate</span>
            <span className="text-sm font-medium text-foreground">{userStats.winRate}%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-success to-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${userStats.winRate}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Rank</span>
            <span className="text-sm font-medium text-foreground">#{userStats.averageRank}</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${(5 - userStats.averageRank) * 20}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Achievements
          </h3>
          <div className="text-sm text-muted-foreground">
            {achievements.filter(a => a.unlocked).length}/{achievements.length}
          </div>
        </div>
        
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-all
                ${achievement.unlocked 
                  ? 'bg-success/10 border border-success/20' :'bg-muted/30 border border-border'
                }
              `}
            >
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-lg
                ${achievement.unlocked 
                  ? 'bg-success/20' :'bg-muted/50'
                }
              `}>
                <Icon 
                  name={achievement.icon} 
                  size={18} 
                  className={achievement.unlocked ? 'text-success' : 'text-muted-foreground'} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`font-medium ${
                    achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {achievement.name}
                  </h4>
                  <span className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                
                {!achievement.unlocked && achievement.progress && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {achievement.unlocked && (
                <Icon name="Check" size={16} className="text-success" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStatsPanel;