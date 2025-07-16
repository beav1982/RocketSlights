import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsCards = ({ stats }) => {
  const statisticsData = [
    {
      id: 'games',
      title: 'Games Played',
      value: stats.gamesPlayed || 0,
      icon: 'Gamepad2',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12 this week'
    },
    {
      id: 'wins',
      title: 'Win Rate',
      value: `${stats.winPercentage || 0}%`,
      icon: 'Trophy',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+5% this month'
    },
    {
      id: 'streak',
      title: 'Best Streak',
      value: stats.longestWinStreak || 0,
      icon: 'Zap',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: 'Current: 3'
    },
    {
      id: 'favorite',
      title: 'Favorite Category',
      value: stats.favoriteCategory || 'None',
      icon: 'Heart',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: '67% pick rate'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statisticsData.map((stat) => (
        <div
          key={stat.id}
          className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {stat.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;