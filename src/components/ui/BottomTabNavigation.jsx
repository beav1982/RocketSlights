import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      label: 'Home',
      path: '/game-lobby-dashboard',
      icon: 'Home',
      badge: null
    },
    {
      label: 'Play',
      path: '/game-room-setup',
      icon: 'Gamepad2',
      badge: null
    },
    {
      label: 'Profile',
      path: '/user-profile-management',
      icon: 'User',
      badge: null
    }
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    
    // Game flow paths map to Play tab
    if (['/game-room-setup', '/active-gameplay-interface', '/game-results-statistics'].includes(currentPath)) {
      return '/game-room-setup';
    }
    
    // Default mapping
    return tabs.find(tab => tab.path === currentPath)?.path || '/game-lobby-dashboard';
  };

  const handleTabClick = (path) => {
    navigate(path);
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-100 bg-card border-t border-border">
      <div className="safe-area-padding-bottom">
        <div className="flex items-center justify-around px-4 py-2 h-14">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.path;
            
            return (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                className={`
                  relative flex flex-col items-center justify-center min-w-0 flex-1 py-1 px-2
                  transition-all duration-200 ease-out rounded-lg
                  ${isActive 
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                  active:scale-95 active:bg-primary/20
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
                `}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon 
                    name={tab.icon} 
                    size={20} 
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-current'
                    }`}
                  />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 font-medium">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`
                  text-xs font-medium mt-1 transition-colors duration-200
                  ${isActive ? 'text-primary' : 'text-current'}
                `}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomTabNavigation;