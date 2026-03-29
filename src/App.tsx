import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { HomeScreen } from './components/HomeScreen';
import { CreateGameScreen } from './components/CreateGameScreen';
import { GameHistoryScreen } from './components/GameHistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PointsBadgesScreen } from './components/PointsBadgesScreen';
import { ReportScreen } from './components/ReportScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { TermsAndConditionsScreen } from './components/TermsAndConditionsScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { AppFeedbackScreen } from './components/AppFeedbackScreen';
import { ChatScreen } from './components/ChatScreen';
import { GameManagementScreen } from './components/GameManagementScreen';
import { TeamMembersScreen } from './components/TeamMembersScreen';
import { TeamAchievementsScreen } from './components/TeamAchievementsScreen';
import { LeaderboardScreen } from './components/EnhancedLeaderboardScreen';
import { QueueScreen } from './components/QueueScreen';
import { CreatorGameViewScreen } from './components/CreatorGameViewScreen';
import { PostGameSummaryScreen } from './components/PostGameSummaryScreen';
import { ParticipantFeedbackScreen } from './components/ParticipantFeedbackScreen';
import { SchedulesScreen } from './components/SchedulesScreen';
import { TeamsScreen } from './screens/TeamsScreen';
import { TeamDetailScreen } from './screens/TeamDetailScreen';
import { TournamentScreen } from './screens/TournamentScreen';
import { TournamentDetailScreen } from './screens/TournamentDetailScreen';
import { EventsScreen } from './screens/EventsScreen';
import { SocialsScreen } from './screens/SocialsScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { NotificationPanel } from './components/NotificationPanel';
import { AuthProvider, useAuth } from './context/AuthContext';
import { mockGames, mockUsers } from './data/mockData';
import { Toaster, toast } from 'sonner';

type AppScreen = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'home'
  | 'chat'
  | 'create'
  | 'queue'
  | 'teams'
  | 'team-detail'
  | 'events'
  | 'tournaments'
  | 'tournament-detail'
  | 'schedules'
  | 'socials'
  | 'profile'
  | 'history'
  | 'points-badges'
  | 'report'
  | 'settings'
  | 'terms-and-conditions'
  | 'privacy-policy'
  | 'app-feedback'
  | 'game-management'
  | 'creator-game-view'
  | 'team-members'
  | 'team-achievements'
  | 'leaderboard'
  | 'post-game-summary'
  | 'participant-feedback';

export function AppContent() {
  const { currentUser, unreadCount, addNotification } = useAuth();
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    username: 'johndoe',
    userId: 'SP2025-4521',
    isVerified: false,
    reliabilityScore: 92,
    points: 1250,
    rating: 4.7,
    gamesPlayed: 24,
    teamName: 'Thunder Squad',
    gamesCreatedToday: 0,
    gamesCreatedThisWeek: 2,
  });
  const [myGames, setMyGames] = useState<Array<{
    id: string; 
    name: string; 
    date: string; 
    time: string; 
    location: string;
    verificationStatus: 'pending' | 'verified' | 'expired';
    confirmations: number;
  }>>([]);
  const [joinedGames, setJoinedGames] = useState<string[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [createdGameData, setCreatedGameData] = useState<any>(null);
  const [joinedGameData, setJoinedGameData] = useState<any>(null);
  const [postGameParticipants, setPostGameParticipants] = useState<any[]>([]);
  const [participantFeedbackData, setParticipantFeedbackData] = useState<any>(null);

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveTab('home');
    toast.success('Welcome back to SportsPlus!');
  };

  const handleSignUp = (signUpData: any) => {
    setUserData({
      name: signUpData.fullName,
      username: signUpData.username,
      userId: 'SP2025-' + Math.floor(Math.random() * 10000),
      isVerified: signUpData.isVerified,
      reliabilityScore: 100,
      points: 0,
      rating: 0,
      gamesPlayed: 0,
      teamName: null,
      gamesCreatedToday: 0,
      gamesCreatedThisWeek: 0,
    });
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveTab('home');
    toast.success('Account created successfully!');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
    toast.info('Signed out successfully');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'leaderboard':
        setCurrentScreen('leaderboard');
        break;
      case 'events':
        setCurrentScreen('events');
        break;
      case 'chat':
        setCurrentScreen('chat');
        setSelectedChatId(null);
        break;
      case 'create':
        // If user has a game (created OR joined), show queue view
        if (createdGameData || joinedGameData) {
          setCurrentScreen('queue');
        } else {
          setCurrentScreen('create');
        }
        break;
      case 'teams':
        setCurrentScreen('teams');
        break;
      case 'socials':
        setCurrentScreen('socials');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const handleJoinGame = (gameId: string) => {
    if (joinedGames.includes(gameId)) {
      setJoinedGames(prev => prev.filter(id => id !== gameId));
      toast.info('Left game');
    } else {
      // Only allow joining one game at a time
      if (joinedGames.length > 0) {
        toast.error('You can only join one game at a time. Leave your current game first.');
        return;
      }
      
      // Check if user already created a game
      if (createdGameData) {
        toast.error('You cannot join a game while hosting one. Cancel your game first.');
        return;
      }
      
      // Check if game is full
      const foundGame = mockGames.find((g) => g.id === gameId);
      if (foundGame && currentUser.isPWD && foundGame.hostId !== currentUser.id) {
        toast.error('Sorry, this game is already full.');
        return;
      }
      if (foundGame && currentUser.isPWD && foundGame.hostId !== currentUser.id) {
        addNotification({
          toUserId: foundGame.hostId,
          message: `${currentUser.name} (PWD player) joined "${foundGame.title}"`,
          type: 'pwd_joined',
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
      
      setJoinedGames([gameId]);
      
      // Mock game data for the joined game
      const newJoinedGameData = {
        id: gameId,
        title: 'Morning Basketball',
        sport: '🏀 Basketball',
        location: 'Brgy. San Pedro',
        date: 'Oct 5, 2025',
        time: '8:00 AM',
        maxPlayers: 10,
      };
      setJoinedGameData(newJoinedGameData);
      setSelectedGameId(gameId);
      
      // Trigger PWD notification to host if applicable
      
      toast.success('Joined game successfully!');
      // Navigate to QUEUE screen (same as clicking Queue button)
      setCurrentScreen('queue');
      setActiveTab('create');
    }
  };

  const handleRemoveJoinedGame = (gameId: string) => {
    setJoinedGames(prev => prev.filter(id => id !== gameId));
    setJoinedGameData(null);
    setSelectedGameId(null);
    toast.info('You have left the game');
  };

  const handleCreateGame = (gameData: any) => {
    const newGameId = 'game-' + Date.now();
    const newGame = {
      id: newGameId,
      name: gameData.title,
      date: gameData.date,
      time: gameData.time,
      location: gameData.location,
      verificationStatus: 'pending' as const,
      confirmations: 0,
    };
    setMyGames(prev => [...prev, newGame]);
    setUserData(prev => ({
      ...prev,
      gamesCreatedToday: prev.gamesCreatedToday + 1,
      gamesCreatedThisWeek: prev.gamesCreatedThisWeek + 1,
    }));
    
    // Store created game data and navigate to QUEUE screen
    setCreatedGameData({
      id: newGameId,
      title: gameData.title,
      sport: gameData.sport,
      skillLevels: gameData.skillLevels,
      location: gameData.location,
      date: gameData.date,
      time: gameData.time,
      maxPlayers: parseInt(gameData.maxPlayers) || 10,
    });
    setSelectedGameId(newGameId);
    setCurrentScreen('queue');
    setActiveTab('create');
    toast.success('Game created successfully! Get ready to play!');
  };

  const handleManageGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentScreen('game-management');
  };

  const handleOpenChat = (gameId: string, organizerName: string) => {
    setSelectedChatId(gameId);
    setCurrentScreen('chat');
    setActiveTab('chat');
  };

  const handleGameFinish = () => {
    // Generate mock participants for rating
    const participants = [
      { id: '1', name: 'John Doe', verified: true },
      { id: '2', name: 'Maria Santos', verified: true },
      { id: '3', name: 'Alex Chen', verified: false },
    ];
    setPostGameParticipants(participants);
    setCurrentScreen('post-game-summary');
  };

  const handleGameCancel = () => {
    if (selectedGameId) {
      setMyGames(prev => prev.filter(g => g.id !== selectedGameId));
    }
    setCreatedGameData(null);
    setCurrentScreen('home');
    setActiveTab('home');
    toast.info('Game cancelled');
  };

  const handlePostGameComplete = () => {
    if (selectedGameId) {
      setMyGames(prev => prev.filter(g => g.id !== selectedGameId));
    }
    setCreatedGameData(null);
    setCurrentScreen('history');
    setActiveTab('home');
    setUserData(prev => ({
      ...prev,
      points: prev.points + 100,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
    toast.success('Game completed! You earned 100 points.');
  };

  const handleParticipantFinishGame = (gameId: string, gameTitle: string, organizer: any) => {
    setParticipantFeedbackData({ gameTitle, organizer });
    setCurrentScreen('participant-feedback');
  };

  const handleParticipantFeedbackComplete = () => {
    // Remove from joined games
    setJoinedGames([]);
    setJoinedGameData(null);
    setSelectedGameId(null);
    setParticipantFeedbackData(null);
    setCurrentScreen('history');
    setActiveTab('home');
    setUserData(prev => ({
      ...prev,
      points: prev.points + 50,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
    toast.success('Feedback submitted! You earned 50 points.');
  };

  const handleVerifyAccount = () => {
    setUserData(prev => ({ ...prev, isVerified: true }));
    toast.success('Account verified successfully! You can now create games.');
  };

  const handleReportSubmit = () => {
    setCurrentScreen('home');
    setActiveTab('home');
    toast.success('Report submitted. Our team will review it.');
  };

  const handleRequestLocation = () => {
    // Simulate location request
    toast.success('Location access granted');
  };

  const handleGameComplete = () => {
    // Clear both created and joined game data when game finishes
    setCreatedGameData(null);
    setJoinedGameData(null);
    setJoinedGames([]);
    setSelectedGameId(null);
  };

  const showMainNavigation = isAuthenticated && [
    'home',
    'leaderboard',
    'chat',
    'create',
    'queue',
    'events',
    'teams',
    'socials',
    'profile',
    'history',
    'creator-game-view',
  ].includes(currentScreen);

  const unreadMessages = 7; // Mock unread count
  
  // Determine current game data and isHost status
  const currentGameData = createdGameData || joinedGameData;
  const isHostingGame = !!createdGameData;
  
  // Check if user has an active game (created OR joined)
  const hasActiveGame = !!(createdGameData || joinedGameData);

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      {/* Notification Bell Icon - positioned in header if authenticated */}
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
            className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Bell className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>
          <NotificationPanel isOpen={isNotificationPanelOpen} onClose={() => setIsNotificationPanelOpen(false)} />
        </div>
      )}

      {/* Main App Content */}
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={() => setCurrentScreen('onboarding')} />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onSignUp={() => setCurrentScreen('signup')}
          onForgotPassword={() => setCurrentScreen('forgot-password')}
        />
      )}

      {currentScreen === 'signup' && (
        <SignUpScreen
          onSignUp={handleSignUp}
          onBack={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen
          onComplete={() => {
            setCurrentScreen('login');
            toast.success('Password reset successful!');
          }}
          onBack={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen 
          onOpenChat={handleOpenChat} 
          myGames={myGames}
          onManageGame={handleManageGame}
          onJoinGame={handleJoinGame}
          joinedGames={joinedGames}
          onOpenQueue={() => setCurrentScreen('queue')}
          onOpenMessages={() => {
            setCurrentScreen('chat');
            setActiveTab('chat');
          }}
          onRequestLocation={handleRequestLocation}
          onRemoveJoinedGame={handleRemoveJoinedGame}
          onOpenSchedules={() => {
            setCurrentScreen('schedules');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'queue' && currentGameData && (
        <QueueScreen 
          gameData={currentGameData}
          isHost={isHostingGame}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onLeaveGame={(gameId) => {
            if (isHostingGame) {
              // If host, cancel the game
              handleGameCancel();
            } else {
              // If participant, leave the game
              handleRemoveJoinedGame(gameId);
              setCurrentScreen('home');
              setActiveTab('home');
            }
          }}
          onFinishGame={handleParticipantFinishGame}
          onGameComplete={handleGameComplete}
        />
      )}

      {currentScreen === 'chat' && (
        <ChatScreen 
          selectedChatId={selectedChatId}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'create' && !createdGameData && !joinedGameData && (
        <CreateGameScreen 
          onCreateGame={handleCreateGame}
          isVerified={userData.isVerified}
          gamesCreatedToday={userData.gamesCreatedToday}
          gamesCreatedThisWeek={userData.gamesCreatedThisWeek}
        />
      )}

      {currentScreen === 'leaderboard' && <LeaderboardScreen />}

      {currentScreen === 'events' && (
        <EventsScreen 
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onJoinGame={handleJoinGame}
          onJoinTournament={(tournamentId) => {
            setSelectedTournamentId(tournamentId);
            setCurrentScreen('tournament-detail');
          }}
        />
      )}

      {currentScreen === 'schedules' && (
        <SchedulesScreen 
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'teams' && (
        <TeamsScreen 
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onViewTeam={(teamId) => {
            setSelectedTeamId(teamId);
            setCurrentScreen('team-detail');
          }}
          joinedGameData={joinedGameData} 
          createdGameData={createdGameData}
        />
      )}

      {currentScreen === 'team-detail' && selectedTeamId && (
        <TeamDetailScreen 
          teamId={selectedTeamId}
          onBack={() => setCurrentScreen('teams')}
          currentUserId={currentUser?.id}
        />
      )}

      {currentScreen === 'tournaments' && (
        <TournamentScreen 
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onViewTournament={(tournamentId) => {
            setSelectedTournamentId(tournamentId);
            setCurrentScreen('tournament-detail');
          }}
        />
      )}

      {currentScreen === 'tournament-detail' && selectedTournamentId && (
        <TournamentDetailScreen 
          tournamentId={selectedTournamentId}
          onBack={() => setCurrentScreen('tournaments')}
          currentUserId={currentUser?.id}
        />
      )}

      {currentScreen === 'socials' && (
        <SocialsScreen 
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen 
          onSettings={() => setCurrentScreen('settings')}
          onViewAchievements={() => setCurrentScreen('points-badges')}
          onViewHistory={() => setCurrentScreen('history')}
          userData={userData}
          onVerify={handleVerifyAccount}
        />
      )}

      {currentScreen === 'history' && (
        <GameHistoryScreen 
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'points-badges' && (
        <PointsBadgesScreen 
          onBack={() => {
            setCurrentScreen('profile');
            setActiveTab('profile');
          }}
        />
      )}

      {currentScreen === 'team-members' && (
        <TeamMembersScreen
          onBack={() => {
            setCurrentScreen('teams');
            setActiveTab('teams');
          }}
          teamName={userData.teamName || 'Thunder Squad'}
          isAdmin={true}
        />
      )}

      {currentScreen === 'team-achievements' && (
        <TeamAchievementsScreen
          onBack={() => {
            setCurrentScreen('teams');
            setActiveTab('teams');
          }}
          teamName={userData.teamName || 'Thunder Squad'}
        />
      )}

      {currentScreen === 'report' && (
        <ReportScreen
          onBack={() => setCurrentScreen('home')}
          onSubmit={handleReportSubmit}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          onBack={() => {
            setCurrentScreen('profile');
            setActiveTab('profile');
          }}
          onSignOut={handleSignOut}
          onNavigateToTerms={() => setCurrentScreen('terms-and-conditions')}
          onNavigateToPrivacy={() => setCurrentScreen('privacy-policy')}
          onNavigateToFeedback={() => setCurrentScreen('app-feedback')}
        />
      )}

      {currentScreen === 'terms-and-conditions' && (
        <TermsAndConditionsScreen
          onBack={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'privacy-policy' && (
        <PrivacyPolicyScreen
          onBack={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'app-feedback' && (
        <AppFeedbackScreen
          onBack={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'game-management' && selectedGameId && (
        <GameManagementScreen
          gameId={selectedGameId}
          gameName="Morning Basketball"
          onFinish={handleGameFinish}
          onCancel={handleGameCancel}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'creator-game-view' && createdGameData && (
        <CreatorGameViewScreen
          gameId={createdGameData.id}
          gameData={createdGameData}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onCancelGame={handleGameCancel}
          onFinishGame={handleGameFinish}
        />
      )}

      {currentScreen === 'post-game-summary' && createdGameData && (
        <PostGameSummaryScreen
          gameTitle={createdGameData.title}
          participants={postGameParticipants}
          onComplete={handlePostGameComplete}
          onBack={() => {
            setCurrentScreen('creator-game-view');
          }}
        />
      )}

      {currentScreen === 'participant-feedback' && participantFeedbackData && (
        <ParticipantFeedbackScreen
          gameTitle={participantFeedbackData.gameTitle}
          organizer={participantFeedbackData.organizer}
          onComplete={handleParticipantFeedbackComplete}
          onBack={() => {
            setCurrentScreen('queue');
          }}
        />
      )}

      {showMainNavigation && (
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          unreadMessages={unreadMessages}
          hasActiveGame={hasActiveGame}
        />
      )}
      
      <Toaster position="top-center" />
      </div>
    );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}