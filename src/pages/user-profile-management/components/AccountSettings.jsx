import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccountSettings = ({ user, onUpdateSettings }) => {
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState({
    email: user.email || '',
    notifications: {
      gameInvitations: true,
      friendRequests: true,
      achievements: false,
      emailUpdates: true
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowFriendRequests: true,
      dataSharing: false
    },
    connectedAccounts: {
      google: user.googleConnected || false
    }
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const settingSections = [
    { id: 'account', label: 'Account', icon: 'User' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'connected', label: 'Connected Accounts', icon: 'Link' }
  ];

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const handleGoogleConnect = async () => {
    try {
      // Simulate Google OAuth connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSettings(prev => ({
        ...prev,
        connectedAccounts: {
          ...prev.connectedAccounts,
          google: !prev.connectedAccounts.google
        }
      }));
    } catch (error) {
      console.error('Failed to connect Google account:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await onUpdateSettings(settings);
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={settings.email}
            onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
            description="Used for login and important notifications"
          />
          
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-foreground">Password</h4>
                <p className="text-sm text-muted-foreground">Change your account password</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                iconName={isChangingPassword ? "X" : "Key"}
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </Button>
            </div>
            
            {isChangingPassword && (
              <div className="space-y-4 bg-muted/20 rounded-lg p-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <Button
                  variant="default"
                  onClick={handlePasswordChange}
                  iconName="Check"
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  Update Password
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <Checkbox
            label="Game Invitations"
            description="Receive notifications when friends invite you to games"
            checked={settings.notifications.gameInvitations}
            onChange={(e) => handleNotificationChange('gameInvitations', e.target.checked)}
          />
          
          <Checkbox
            label="Friend Requests"
            description="Get notified when someone sends you a friend request"
            checked={settings.notifications.friendRequests}
            onChange={(e) => handleNotificationChange('friendRequests', e.target.checked)}
          />
          
          <Checkbox
            label="Achievement Alerts"
            description="Celebrate your gaming milestones with notifications"
            checked={settings.notifications.achievements}
            onChange={(e) => handleNotificationChange('achievements', e.target.checked)}
          />
          
          <Checkbox
            label="Email Updates"
            description="Receive occasional updates about new features and events"
            checked={settings.notifications.emailUpdates}
            onChange={(e) => handleNotificationChange('emailUpdates', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Profile Visibility
            </label>
            <div className="space-y-2">
              {[
                { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
                { value: 'friends', label: 'Friends Only', description: 'Only friends can see your profile' },
                { value: 'private', label: 'Private', description: 'Profile is hidden from others' }
              ].map((option) => (
                <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.value}
                    checked={settings.privacy.profileVisibility === option.value}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="mt-1 w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <Checkbox
            label="Show Online Status"
            description="Let others see when you're online and playing"
            checked={settings.privacy.showOnlineStatus}
            onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
          />
          
          <Checkbox
            label="Allow Friend Requests"
            description="Enable others to send you friend requests"
            checked={settings.privacy.allowFriendRequests}
            onChange={(e) => handlePrivacyChange('allowFriendRequests', e.target.checked)}
          />
          
          <Checkbox
            label="Data Sharing"
            description="Share anonymized gameplay data to help improve the game"
            checked={settings.privacy.dataSharing}
            onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderConnectedSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Connected Accounts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Icon name="Mail" size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground">Google</div>
                <div className="text-sm text-muted-foreground">
                  {settings.connectedAccounts.google ? 'Connected' : 'Not connected'}
                </div>
              </div>
            </div>
            <Button
              variant={settings.connectedAccounts.google ? "destructive" : "default"}
              size="sm"
              onClick={handleGoogleConnect}
              iconName={settings.connectedAccounts.google ? "Unlink" : "Link"}
            >
              {settings.connectedAccounts.google ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Account Settings</h2>
        <Button
          variant="default"
          size="sm"
          onClick={handleSaveSettings}
          iconName="Save"
        >
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200
                  ${activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon name={section.icon} size={18} />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeSection === 'account' && renderAccountSection()}
          {activeSection === 'notifications' && renderNotificationsSection()}
          {activeSection === 'privacy' && renderPrivacySection()}
          {activeSection === 'connected' && renderConnectedSection()}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;