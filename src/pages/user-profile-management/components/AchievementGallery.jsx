import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AchievementGallery = ({ achievements }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const achievementCategories = [
    { id: 'all', label: 'All', icon: 'Grid3x3' },
    { id: 'gameplay', label: 'Gameplay', icon: 'Gamepad2' },
    { id: 'social', label: 'Social', icon: 'Users' },
    { id: 'special', label: 'Special', icon: 'Star' }
  ];

  const mockAchievements = [
    {
      id: 1,
      title: 'First Victory',
      description: 'Win your first game',
      category: 'gameplay',
      icon: 'Trophy',
      earned: true,
      earnedDate: '2025-01-15',
      rarity: 'common',
      progress: 100
    },
    {
      id: 2,
      title: 'Social Butterfly',
      description: 'Play with 10 different players',
      category: 'social',
      icon: 'Users',
      earned: true,
      earnedDate: '2025-02-01',
      rarity: 'uncommon',
      progress: 100
    },
    {
      id: 3,
      title: 'Winning Streak',
      description: 'Win 5 games in a row',
      category: 'gameplay',
      icon: 'Zap',
      earned: false,
      rarity: 'rare',
      progress: 60,
      requirement: 5,
      current: 3
    },
    {
      id: 4,
      title: 'Card Master',
      description: 'Play 100 games',
      category: 'gameplay',
      icon: 'Target',
      earned: false,
      rarity: 'epic',
      progress: 45,
      requirement: 100,
      current: 45
    },
    {
      id: 5,
      title: 'Beta Tester',
      description: 'Played during beta period',
      category: 'special',
      icon: 'Crown',
      earned: true,
      earnedDate: '2024-12-01',
      rarity: 'legendary',
      progress: 100
    }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? mockAchievements 
    : mockAchievements.filter(achievement => achievement.category === selectedCategory);

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-muted-foreground border-muted',
      uncommon: 'text-success border-success',
      rare: 'text-primary border-primary',
      epic: 'text-secondary border-secondary',
      legendary: 'text-warning border-warning'
    };
    return colors[rarity] || colors.common;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Achievements</h2>
        <div className="text-sm text-muted-foreground">
          {mockAchievements.filter(a => a.earned).length} / {mockAchievements.length} earned
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {achievementCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200
              ${selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            <Icon name={category.icon} size={16} />
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              relative border-2 rounded-xl p-4 transition-all duration-200
              ${achievement.earned 
                ? `${getRarityColor(achievement.rarity)} bg-card hover:shadow-lg` 
                : 'border-muted bg-muted/20 opacity-60'
              }
            `}
          >
            {/* Achievement Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${achievement.earned 
                  ? `${getRarityColor(achievement.rarity).replace('text-', 'bg-').replace('border-', '')}/10` 
                  : 'bg-muted'
                }
              `}>
                <Icon 
                  name={achievement.icon} 
                  size={24} 
                  className={achievement.earned ? getRarityColor(achievement.rarity).split(' ')[0] : 'text-muted-foreground'} 
                />
              </div>
              
              {achievement.earned && (
                <div className="text-xs text-muted-foreground">
                  {formatDate(achievement.earnedDate)}
                </div>
              )}
            </div>

            {/* Achievement Info */}
            <div className="mb-3">
              <h3 className={`font-semibold mb-1 ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                {achievement.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
            </div>

            {/* Progress Bar (for unearned achievements) */}
            {!achievement.earned && achievement.progress !== undefined && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{achievement.current} / {achievement.requirement}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Rarity Badge */}
            <div className="flex items-center justify-between">
              <span className={`
                text-xs font-medium px-2 py-1 rounded-full capitalize
                ${achievement.earned 
                  ? `${getRarityColor(achievement.rarity).replace('text-', 'bg-').replace('border-', '')}/10 ${getRarityColor(achievement.rarity).split(' ')[0]}` 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {achievement.rarity}
              </span>
              
              {achievement.earned && (
                <Icon name="Check" size={16} className="text-success" />
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Award" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No achievements in this category yet</p>
        </div>
      )}
    </div>
  );
};

export default AchievementGallery;