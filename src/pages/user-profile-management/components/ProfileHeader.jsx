import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileHeader = ({ user, onUpdateProfile, isEditing, setIsEditing }) => {
  const [editData, setEditData] = useState({
    displayName: user.displayName || user.username,
    bio: user.bio || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    try {
      await onUpdateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      displayName: user.displayName || user.username,
      bio: user.bio || ''
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock URL for uploaded image
      const mockAvatarUrl = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`;
      
      await onUpdateProfile({ avatar: mockAvatarUrl });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={`${user.displayName || user.username}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="User" size={32} className="text-muted-foreground" />
            )}
          </div>
          
          {/* Upload overlay */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            {isUploading ? (
              <Icon name="Loader2" size={20} className="text-white animate-spin" />
            ) : (
              <Icon name="Camera" size={20} className="text-white" />
            )}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Display Name"
                type="text"
                value={editData.displayName}
                onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Enter display name"
                maxLength={30}
              />
              <Input
                label="Bio"
                type="text"
                value={editData.bio}
                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell others about yourself"
                maxLength={150}
              />
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {user.displayName || user.username}
              </h1>
              <p className="text-muted-foreground mb-2">
                @{user.username}
              </p>
              {user.bio && (
                <p className="text-foreground mb-3 text-sm">
                  {user.bio}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={16} />
                  <span>Joined {formatJoinDate(user.createdAt)}</span>
                </div>
                {user.isOnline && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span>Online</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                iconName="Check"
                iconPosition="left"
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit3"
              iconPosition="left"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;