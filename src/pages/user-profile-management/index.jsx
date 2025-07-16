import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import ProfileHeader from './components/ProfileHeader';
import StatisticsCards from './components/StatisticsCards';
import AchievementGallery from './components/AchievementGallery';
import AccountSettings from './components/AccountSettings';
import GameHistory from './components/GameHistory';

const UserProfileManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const guestUser = sessionStorage.getItem('guestUser');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({
            ...parsedUser,
            displayName: parsedUser.displayName || parsedUser.username,
            bio: parsedUser.bio || '',
            avatar: parsedUser.avatar || null,
            isOnline: true,
            googleConnected: parsedUser.googleConnected || false
          });
        } catch (error) {
          console.error('Invalid user data:', error);
          navigate('/user-authentication');
          return;
        }
      } else if (guestUser) {
        try {
          const parsedGuest = JSON.parse(guestUser);
          setUser({
            ...parsedGuest,
            displayName: parsedGuest.displayName || parsedGuest.username,
            bio: 'Guest player - create an account to save your progress!',
            avatar: null,
            isOnline: true,
            googleConnected: false
          });
        } catch (error) {
          console.error('Invalid guest data:', error);
          navigate('/user-authentication');
          return;
        }
      } else {
        navigate('/user-authentication');
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Mock user statistics
  const userStats = {
    gamesPlayed: 47,
    winPercentage: 68,
    longestWinStreak: 8,
    favoriteCategory: 'Work Fails'
  };

  // Mock achievements data
  const achievements = [
    { id: 1, title: 'First Victory', earned: true },
    { id: 2, title: 'Social Butterfly', earned: true },
    { id: 3, title: 'Winning Streak', earned: false }
  ];

  // Mock game history
  const gameHistory = [
    { id: 1, gameCode: 'ABC123', result: 'won', score: 8 },
    { id: 2, gameCode: 'XYZ789', result: 'lost', score: 3 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const handleUpdateProfile = async (updateData) => {
    try {
      const updatedUser = { ...user, ...updateData };
      setUser(updatedUser);

      // Update stored user data
      if (localStorage.getItem('authToken')) {
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      } else if (sessionStorage.getItem('guestUser')) {
        sessionStorage.setItem('guestUser', JSON.stringify(updatedUser));
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update profile:', error);
      return Promise.reject(error);
    }
  };

  const handleUpdateSettings = async (settings) => {
    try {
      // Simulate settings update
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings updated:', settings);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update settings:', error);
      return Promise.reject(error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('guestUser');
    navigate('/user-authentication');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <ContextualHeader
        title="Profile"
        subtitle="Manage your gaming profile"
        actions={[
          {
            label: 'Sign Out',
            variant: 'outline',
            iconName: 'LogOut',
            onClick: handleSignOut
          }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onUpdateProfile={handleUpdateProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200
                ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <StatisticsCards stats={userStats} />
              <AchievementGallery achievements={achievements} />
            </>
          )}

          {activeTab === 'achievements' && (
            <AchievementGallery achievements={achievements} />
          )}

          {activeTab === 'history' && (
            <GameHistory gameHistory={gameHistory} />
          )}

          {activeTab === 'settings' && (
            <AccountSettings
              user={user}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </div>

        {/* Guest Account Notice */}
        {user.isGuest && (
          <div className="mt-6 bg-warning/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-warning text-sm">!</span>
              </div>
              <div>
                <h3 className="font-medium text-warning mb-1">Guest Account</h3>
                <p className="text-sm text-warning/80 mb-3">
                  You're playing as a guest. Create an account to save your progress, achievements, and game history.
                </p>
                <button
                  onClick={() => navigate('/user-authentication')}
                  className="text-sm font-medium text-warning hover:text-warning/80 underline"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default UserProfileManagement;