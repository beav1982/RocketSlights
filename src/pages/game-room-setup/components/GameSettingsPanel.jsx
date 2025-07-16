import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const GameSettingsPanel = ({ 
  gameSettings, 
  onSettingsChange, 
  isRoomCreator = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...gameSettings,
      [key]: value
    });
  };

  const scoringOptions = [
    { value: 3, label: '3 Points (Quick)' },
    { value: 5, label: '5 Points (Standard)' },
    { value: 7, label: '7 Points (Extended)' },
    { value: 10, label: '10 Points (Marathon)' }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left mb-4"
        disabled={!isRoomCreator}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Game Settings</h3>
            <p className="text-sm text-muted-foreground">
              {isRoomCreator ? 'Configure your game' : 'View game configuration'}
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>

      {isExpanded && (
        <div className="space-y-6">
          {/* Game Name */}
          <Input
            label="Game Name"
            type="text"
            placeholder="Enter a fun game name"
            value={gameSettings.gameName}
            onChange={(e) => handleSettingChange('gameName', e.target.value)}
            disabled={!isRoomCreator}
            description="This will be displayed to all players"
            className="mb-4"
          />

          {/* Scoring Limit */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Scoring Limit
            </label>
            <div className="space-y-2">
              {scoringOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all
                    ${gameSettings.scoreLimit === option.value
                      ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-border/60 hover:bg-muted/30'
                    }
                    ${!isRoomCreator ? 'cursor-not-allowed opacity-60' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name="scoreLimit"
                    value={option.value}
                    checked={gameSettings.scoreLimit === option.value}
                    onChange={(e) => handleSettingChange('scoreLimit', parseInt(e.target.value))}
                    disabled={!isRoomCreator}
                    className="w-4 h-4 text-primary bg-input border-border focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              First player to reach this score wins the game
            </p>
          </div>

          {/* Game Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Game Options</h4>
            
            <Checkbox
              label="Allow Spectators"
              description="Let others watch the game without playing"
              checked={gameSettings.allowSpectators}
              onChange={(e) => handleSettingChange('allowSpectators', e.target.checked)}
              disabled={!isRoomCreator}
            />

            <Checkbox
              label="Custom House Rules"
              description="Enable special rules and variations"
              checked={gameSettings.customRules}
              onChange={(e) => handleSettingChange('customRules', e.target.checked)}
              disabled={!isRoomCreator}
            />

            <Checkbox
              label="Anonymous Submissions"
              description="Hide player names during card selection"
              checked={gameSettings.anonymousSubmissions}
              onChange={(e) => handleSettingChange('anonymousSubmissions', e.target.checked)}
              disabled={!isRoomCreator}
            />

            <Checkbox
              label="Quick Rounds"
              description="Reduce thinking time for faster gameplay"
              checked={gameSettings.quickRounds}
              onChange={(e) => handleSettingChange('quickRounds', e.target.checked)}
              disabled={!isRoomCreator}
            />
          </div>

          {/* Room Creator Notice */}
          {!isRoomCreator && (
            <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
              <Icon name="Info" size={16} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Only the room creator can modify game settings
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameSettingsPanel;