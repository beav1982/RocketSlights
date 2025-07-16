import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GameHistory = ({ gameHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const mockGameHistory = [
    {
      id: 1,
      gameCode: 'ABC123',
      date: '2025-07-15T20:30:00Z',
      duration: '15 min',
      players: ['Alice', 'Bob', 'Charlie', 'Diana'],
      result: 'won',
      score: 8,
      rounds: 5,
      favoriteCard: 'Spilled coffee on important documents'
    },
    {
      id: 2,
      gameCode: 'XYZ789',
      date: '2025-07-14T19:15:00Z',
      duration: '22 min',
      players: ['Eve', 'Frank', 'Grace'],
      result: 'lost',
      score: 3,
      rounds: 6,
      favoriteCard: 'Slow internet during video call'
    },
    {
      id: 3,
      gameCode: 'DEF456',
      date: '2025-07-13T21:45:00Z',
      duration: '18 min',
      players: ['Henry', 'Ivy', 'Jack', 'Kate', 'Liam'],
      result: 'won',
      score: 12,
      rounds: 8,
      favoriteCard: 'Forgot to mute during meeting'
    },
    {
      id: 4,
      gameCode: 'GHI012',
      date: '2025-07-12T18:00:00Z',
      duration: '25 min',
      players: ['Mia', 'Noah', 'Olivia'],
      result: 'lost',
      score: 5,
      rounds: 7,
      favoriteCard: 'Phone battery dies at crucial moment'
    },
    {
      id: 5,
      gameCode: 'JKL345',
      date: '2025-07-11T16:30:00Z',
      duration: '12 min',
      players: ['Paul', 'Quinn', 'Ruby', 'Sam'],
      result: 'won',
      score: 6,
      rounds: 4,
      favoriteCard: 'Autocorrect changes important message'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Games' },
    { value: 'won', label: 'Wins Only' },
    { value: 'lost', label: 'Losses Only' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'score', label: 'Score' },
    { value: 'duration', label: 'Duration' }
  ];

  const filteredAndSortedHistory = mockGameHistory
    .filter(game => {
      const matchesSearch = game.gameCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.players.some(player => player.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'all' || game.result === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'score':
          return b.score - a.score;
        case 'duration':
          return parseInt(b.duration) - parseInt(a.duration);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResultColor = (result) => {
    return result === 'won' ? 'text-success' : 'text-error';
  };

  const getResultIcon = (result) => {
    return result === 'won' ? 'Trophy' : 'X';
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(mockGameHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'game-history.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-0">Game History</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportData}
          iconName="Download"
          iconPosition="left"
        >
          Export Data
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by game code or player name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Game History List */}
      <div className="space-y-4">
        {filteredAndSortedHistory.length > 0 ? (
          filteredAndSortedHistory.map((game) => (
            <div
              key={game.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    game.result === 'won' ? 'bg-success/10' : 'bg-error/10'
                  }`}>
                    <Icon 
                      name={getResultIcon(game.result)} 
                      size={16} 
                      className={getResultColor(game.result)} 
                    />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      Game #{game.gameCode}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(game.date)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-foreground">{game.score}</div>
                    <div className="text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-foreground">{game.rounds}</div>
                    <div className="text-muted-foreground">Rounds</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-foreground">{game.duration}</div>
                    <div className="text-muted-foreground">Duration</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Players ({game.players.length})</div>
                  <div className="text-foreground">
                    {game.players.join(', ')}
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground mb-1">Favorite Card</div>
                  <div className="text-foreground italic">
                    "{game.favoriteCard}"
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all' ?'No games match your search criteria' :'No games played yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredAndSortedHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {filteredAndSortedHistory.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">
                {filteredAndSortedHistory.filter(g => g.result === 'won').length}
              </div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(filteredAndSortedHistory.reduce((sum, g) => sum + g.score, 0) / filteredAndSortedHistory.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(filteredAndSortedHistory.reduce((sum, g) => sum + g.rounds, 0) / filteredAndSortedHistory.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rounds</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHistory;