import { Home, MessageCircle, PlusCircle, Users, UserCircle, Trophy, ListChecks, Calendar } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessages?: number;
  hasActiveGame?: boolean;
}

export function BottomNavigation({ activeTab, onTabChange, unreadMessages = 0, hasActiveGame = false }: BottomNavigationProps) {
  // Determine the label and icon for the create tab
  let createLabel = 'Create';
  let createIcon = PlusCircle;
  
  if (hasActiveGame) {
    createLabel = 'Queue';
    createIcon = ListChecks;
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'leaderboard', label: 'Ranks', icon: Trophy },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'create', label: createLabel, icon: createIcon },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCreate = tab.id === 'create';
          const isQueueWithActiveGame = isCreate && hasActiveGame;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isCreate
                  ? isQueueWithActiveGame
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50 scale-110 -mt-2 animate-pulse'
                    : 'bg-gradient-to-br from-blue-600 to-green-600 text-white shadow-lg shadow-blue-500/30 scale-110 -mt-2'
                  : isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`${isCreate ? 'w-6 h-6' : 'w-5 h-5'}`} strokeWidth={2} />
              {!isCreate && (
                <span className="text-xs">{tab.label}</span>
              )}
              {isQueueWithActiveGame && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}