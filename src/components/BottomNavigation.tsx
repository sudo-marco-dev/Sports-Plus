import { Home, Trophy, Calendar, Plus, Users, Radio, UserCircle, ListTodo } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessages?: number;
  hasActiveGame?: boolean;
}

export function BottomNavigation({ 
  activeTab, 
  onTabChange, 
  unreadMessages,
  hasActiveGame 
}: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'leaderboard', label: 'Ranks', icon: Trophy },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'socials', label: 'Socials', icon: Radio },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  // Split tabs: 3 left, 3 right
  const leftTabs = tabs.slice(0, 3);
  const rightTabs = tabs.slice(3, 6);

  const tabItemClass = (tabId: string) => `
    flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors
    ${activeTab === tabId ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}
  `;

  return (
    <div 
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative h-16 flex items-center justify-between px-4">
        {/* Left Tabs */}
        <div className="flex gap-1">
          {leftTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={tabItemClass(tab.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center CREATE Button */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => onTabChange('create')}
            className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow -mt-6"
          >
            {hasActiveGame ? (
              <ListTodo className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
            {hasActiveGame && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </button>
        </div>

        {/* Right Tabs */}
        <div className="flex gap-1">
          {rightTabs.map(tab => {
            const Icon = tab.icon;
            const isProfile = tab.id === 'profile';
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={tabItemClass(tab.id)}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isProfile && unreadMessages && unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-medium mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}