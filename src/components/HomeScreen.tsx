import { useState } from 'react';
import { MapPin, Filter, Calendar, Users, CheckCircle2, MessageCircle, Star, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { NotificationSystem } from './NotificationSystem';
import { WaiverModal } from './WaiverModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { ProBadge } from './ui/ProBadge';

interface Game {
  id: string;
  title: string;
  sport: string;
  skillLevels: string[];
  location: string;
  date: string;
  time: string;
  slots: { current: number; max: number };
  organizer: { name: string; verified: boolean; rating: number; isPremium?: boolean };
  distance: string;
  description: string;
  isPromoted?: boolean;
}

const mockGames: Game[] = [
  {
    id: '1',
    title: 'Casual Morning Basketball',
    sport: 'Basketball',
    skillLevels: ['Casual'],
    location: 'Brgy. San Pedro',
    date: 'Dec 16, 2025',
    time: '8:00 AM',
    slots: { current: 8, max: 10 },
    organizer: { name: 'Alex Chen', verified: true, rating: 4.8, isPremium: true },
    distance: '0.5 km',
    description: 'Friendly pickup game for casual players. No experience needed!',
    isPromoted: true,
  },
  {
    id: '2',
    title: 'Casual Volleyball Games',
    sport: 'Volleyball',
    skillLevels: ['Casual'],
    location: 'Brgy. Tiniguiban',
    date: 'Dec 16, 2025',
    time: '5:00 PM',
    slots: { current: 5, max: 5 },
    organizer: { name: 'Sarah Miller', verified: true, rating: 4.9 },
    distance: '1.2 km',
    description: 'Evening casual volleyball. Fun and relaxed atmosphere!',
  },
  {
    id: '3',
    title: 'Open Football - All Levels',
    sport: 'Football',
    skillLevels: ['Casual', 'Novice', 'Elite'],
    location: 'Brgy. Mandaragat',
    date: 'Dec 17, 2025',
    time: '6:30 PM',
    slots: { current: 12, max: 22 },
    organizer: { name: 'Mike Johnson', verified: true, rating: 4.7, isPremium: true },
    distance: '2.8 km',
    description: 'Open match for everyone - casual, intermediate, and experienced players welcome!',
  },
  {
    id: '4',
    title: 'Novice & Elite Basketball Tournament',
    sport: 'Basketball',
    skillLevels: ['Novice', 'Elite'],
    location: 'Brgy. Bagong Sikat',
    date: 'Dec 18, 2025',
    time: '7:00 AM',
    slots: { current: 5, max: 16 },
    organizer: { name: 'Anna Garcia', verified: true, rating: 4.6 },
    distance: '1.8 km',
    description: 'Competitive tournament for intermediate and experienced players.',
  },
  {
    id: '5',
    title: 'Badminton - Mixed Levels',
    sport: 'Badminton',
    skillLevels: ['Casual', 'Novice'],
    location: 'Brgy. San Miguel',
    date: 'Dec 19, 2025',
    time: '4:00 PM',
    slots: { current: 3, max: 8 },
    organizer: { name: 'David Kim', verified: false, rating: 4.3 },
    distance: '0.8 km',
    description: 'Friendly badminton for casual and novice players.',
  },
  {
    id: '6',
    title: 'Elite Tennis Match',
    sport: 'Tennis',
    skillLevels: ['Elite'],
    location: 'Brgy. Mabuhay',
    date: 'Dec 20, 2025',
    time: '6:00 PM',
    slots: { current: 2, max: 4 },
    organizer: { name: 'Lisa Brown', verified: true, rating: 5.0, isPremium: true },
    distance: '2.5 km',
    description: 'Elite-only tennis match. Bring your A-game!',
  },
  {
    id: '7',
    title: 'Swimming - All Levels Welcome',
    sport: 'Swimming',
    skillLevels: ['Casual', 'Novice', 'Elite'],
    location: 'Brgy. Matahimik',
    date: 'Dec 21, 2025',
    time: '9:00 AM',
    slots: { current: 7, max: 15 },
    organizer: { name: 'Tom Anderson', verified: true, rating: 4.5 },
    distance: '3.2 km',
    description: 'Open swimming session for all skill levels.',
  },
];

const sportIcons: Record<string, string> = {
  Basketball: '🏀',
  Volleyball: '🏐',
  Football: '⚽',
  Badminton: '🏸',
  Tennis: '🎾',
  Swimming: '🏊',
};

interface HomeScreenProps {
  onOpenChat?: (gameId: string, organizerName: string) => void;
  myGames?: Array<{
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
    verificationStatus?: 'pending' | 'verified' | 'expired';
    confirmations?: number;
  }>;
  onManageGame?: (gameId: string) => void;
  onJoinGame?: (gameId: string) => void;
  joinedGames?: string[];
  onOpenQueue?: () => void;
  onOpenMessages?: () => void;
  onRequestLocation?: () => void;
  onRemoveJoinedGame?: (gameId: string) => void;
  onOpenSchedules?: () => void;
}

export function HomeScreen({ onOpenChat, myGames = [], onManageGame, onJoinGame, joinedGames = [], onOpenQueue, onOpenMessages, onRequestLocation, onRemoveJoinedGame, onOpenSchedules }: HomeScreenProps) {
  const { currentUser, updateUser } = useAuth();
  const [view, setView] = useState<'map' | 'list'>('list');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [pendingGameId, setPendingGameId] = useState<string | null>(null);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [selectedGameName, setSelectedGameName] = useState('');

  const toggleJoinGame = (gameId: string) => {
    // Check if trying to join (not already joined)
    if (!joinedGames.includes(gameId)) {
      setPendingGameId(gameId);
      setShowLocationDialog(true);
    } else {
      // If already joined, remove from joined games
      onRemoveJoinedGame?.(gameId);
    }
  };

  const handleLocationPermission = (granted: boolean) => {
    setShowLocationDialog(false);
    if (granted && pendingGameId) {
      // Check if user has accepted waiver
      if (currentUser && !currentUser.waiverAccepted) {
        const game = mockGames.find(g => g.id === pendingGameId);
        setSelectedGameName(game?.title || 'this game');
        setShowWaiverModal(true);
      } else {
        // Waiver already accepted, proceed with join
        onRequestLocation?.();
        onJoinGame?.(pendingGameId);
      }
    }
    setPendingGameId(null);
  };

  const handleWaiverAccept = () => {
    setShowWaiverModal(false);
    if (currentUser) {
      // Update user with waiver acceptance
      updateUser({
        waiverAccepted: true,
        waiverTimestamp: new Date().toISOString(),
      });
      toast.success('Waiver accepted! Joining game...');
      // Proceed with join
      if (pendingGameId) {
        onRequestLocation?.();
        onJoinGame?.(pendingGameId);
      }
    }
  };

  const handleWaiverCancel = () => {
    setShowWaiverModal(false);
    setPendingGameId(null);
  };

  const sortedGames = [...mockGames].sort((a, b) => {
    if (a.isPromoted && !b.isPromoted) return -1;
    if (!a.isPromoted && b.isPromoted) return 1;
    return 0;
  });

  let filteredGames = (selectedSport === 'all'
    ? sortedGames
    : sortedGames.filter(game => game.sport === selectedSport));

  // Apply search filter
  if (searchQuery.trim()) {
    filteredGames = filteredGames.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.organizer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const getSkillBadgeColor = (skillLevels: string[]) => {
    if (skillLevels.length === 3) return 'bg-green-100 text-green-700';
    if (skillLevels.includes('Elite') && skillLevels.includes('Novice')) return 'bg-purple-100 text-purple-700';
    if (skillLevels.includes('Casual')) return 'bg-blue-100 text-blue-700';
    if (skillLevels.includes('Elite')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-purple-100 text-purple-700';
  };

  const getSkillLabel = (skillLevels: string[]) => {
    if (skillLevels.length === 3) return 'All Levels';
    if (skillLevels.length === 1) return skillLevels[0];
    return `${skillLevels.join(' & ')}`;
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl">Discover Games</h1>
            <p className="text-white/80 text-sm">Find players near you</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenMessages}
              className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl hover:bg-white/30 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
            <NotificationSystem unreadCount={3} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-white" />
          <input
            type="text"
            placeholder="Search games, players, sports..."
            className="bg-transparent text-white placeholder-white/60 outline-none flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 -mt-3">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-2 flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2 rounded-xl transition-colors text-center ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
          >
            List View
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex-1 py-2 rounded-xl transition-colors text-center ${view === 'map' ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Weekly Schedules Section */}
      <div className="px-6 mt-4">
        <button
          onClick={onOpenSchedules}
          className="w-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-lg shadow-purple-200/50 p-4 hover:shadow-xl transition-all border border-purple-200 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 font-bold">Weekly Schedules</h3>
              <p className="text-xs text-gray-600 mt-1">Book recurring game slots</p>
            </div>
            <span className="text-2xl">📅</span>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 mt-4 space-y-3 pb-24">
        {view === 'map' && (
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
            <div className="relative h-[500px] bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
              {/* Map Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-10 grid-rows-10 h-full">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-gray-400"></div>
                  ))}
                </div>
              </div>

              {/* Decorative Roads */}
              <div className="absolute top-1/3 left-0 right-0 h-8 bg-gray-300/30 border-y-2 border-dashed border-gray-400/40"></div>
              <div className="absolute left-2/3 top-0 bottom-0 w-8 bg-gray-300/30 border-x-2 border-dashed border-gray-400/40"></div>

              {/* Game Location Pins */}
              {filteredGames.map((game, index) => {
                // Position pins at different locations
                const positions = [
                  { top: '25%', left: '30%' },
                  { top: '45%', left: '60%' },
                  { top: '65%', left: '40%' },
                  { top: '35%', left: '70%' },
                  { top: '55%', left: '20%' },
                ];
                const pos = positions[index % positions.length];

                return (
                  <div
                    key={game.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={pos}
                    onClick={() => setSelectedGame(game)}
                  >
                    {/* Pulsing Animation */}
                    <div className="absolute inset-0 -m-4">
                      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    </div>

                    {/* Pin Icon */}
                    <div className="relative z-10 bg-blue-600 rounded-full p-3 shadow-xl border-4 border-white group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-white fill-white" />
                    </div>

                    {/* Game Info Popup */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-xl p-3 min-w-[180px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{sportIcons[game.sport]}</span>
                        <p className="text-sm text-gray-900 truncate">{game.title}</p>
                      </div>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {game.location}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{game.distance} away</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">{game.slots.current}/{game.slots.max} players</span>
                        <Badge className="text-xs bg-blue-600 text-white">View</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Your Location Marker */}
              <div className="absolute bottom-[20%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse opacity-50"></div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-600 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap shadow-lg">
                    📍 You are here
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <p className="text-xs text-gray-900 mb-2">Legend</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">Available Games</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">Your Location</span>
                  </div>
                </div>
              </div>

              {/* Distance Scale */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-gray-600"></div>
                  <span className="text-xs text-gray-600">1 km</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <p className="text-sm text-gray-600 text-center">
                Tap on pins to view game details • {filteredGames.length} games nearby
              </p>
            </div>
          </div>
        )}

        {view === 'list' && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              <button
                onClick={() => setSelectedSport('all')}
                className={`flex-shrink-0 border-2 rounded-2xl px-4 py-2 flex items-center gap-2 transition-colors ${selectedSport === 'all'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="text-sm">All Sports</span>
              </button>
              {Object.entries(sportIcons).map(([sport, icon]) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`flex-shrink-0 border-2 rounded-2xl px-4 py-2 flex items-center gap-2 transition-colors ${selectedSport === sport
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm">{sport}</span>
                </button>
              ))}
            </div>

            {filteredGames.map((game) => {
              const isFull = game.slots.current >= game.slots.max;
              const cardContent = (
                <div className={`bg-white ${game.isPromoted ? 'rounded-[14px]' : 'rounded-2xl shadow-lg shadow-gray-200/50'} p-4 space-y-3`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{sportIcons[game.sport]}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-gray-900 font-semibold">{game.title}</h3>
                          {game.isPromoted && (
                            <span
                              style={{ background: 'linear-gradient(to right, #fbbf24, #ea580c)' }}
                              className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm"
                            >
                              <Sparkles className="w-3 h-3 text-white" />
                              Promoted
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs text-gray-600">{game.organizer.name}</span>
                          {game.organizer.verified && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          )}
                          {game.organizer.isPremium && <ProBadge />}
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs text-gray-600">{game.organizer.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      {isFull && <Badge className="bg-red-600 text-white hover:bg-red-700">Full</Badge>}
                      <Badge className={getSkillBadgeColor(game.skillLevels)}>
                        {getSkillLabel(game.skillLevels)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{game.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{game.date}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isFull ? 'text-gray-600' : 'text-green-600'}`}>
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{game.slots.current}/{game.slots.max} players</span>
                    </div>
                    <div className="text-gray-600">
                      📍 {game.distance}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (!isFull) {
                          toggleJoinGame(game.id);
                        }
                      }}
                      disabled={isFull && !joinedGames.includes(game.id)}
                      className={`flex-1 rounded-xl transition-all font-semibold ${joinedGames.includes(game.id)
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : isFull
                            ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                        }`}
                    >
                      {joinedGames.includes(game.id) ? 'Leave Game' : isFull ? 'Game Full' : 'Join Game'}
                    </Button>
                    {joinedGames.includes(game.id) && (
                      <Button
                        onClick={() => onOpenChat?.(game.id, game.organizer.name)}
                        variant="outline"
                        className="rounded-xl"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    )}
                    <Button
                      onClick={() => setSelectedGame(game)}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              );

              return game.isPromoted ? (
                <div
                  key={game.id}
                  style={{
                    background: 'linear-gradient(to right, #fbbf24, #f59e0b, #ea580c)',
                    padding: '2px',

                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                >
                  {cardContent}
                </div>
              ) : (
                <div key={game.id}>
                  {cardContent}
                </div>
              );
            })}
          </>
        )}
      </div>

      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedGame && sportIcons[selectedGame.sport]}</span>
              {selectedGame?.title}
            </DialogTitle>
            <DialogDescription>
              View game details and join the match
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <h4 className="text-gray-900 font-semibold mb-2">Game Description</h4>
              <p className="text-gray-600 text-sm">{selectedGame?.description}</p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-2">Organizer</h4>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm">{selectedGame?.organizer.name}</span>
                {selectedGame?.organizer.verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
                {selectedGame?.organizer.isPremium && <ProBadge />}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-gray-700 text-sm">{selectedGame?.organizer.rating}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-gray-900 text-sm font-semibold mb-1">Location</h4>
                <p className="text-gray-600 text-sm">{selectedGame?.location}</p>
              </div>
              <div>
                <h4 className="text-gray-900 text-sm font-semibold mb-1">Date & Time</h4>
                <p className="text-gray-600 text-sm">{selectedGame?.date} at {selectedGame?.time}</p>
              </div>
              <div>
                <h4 className="text-gray-900 text-sm font-semibold mb-1">Skill Levels</h4>
                <p className="text-gray-600 text-sm">{selectedGame && getSkillLabel(selectedGame.skillLevels)}</p>
              </div>
              <div>
                <h4 className="text-gray-900 text-sm font-semibold mb-1">Available Slots</h4>
                <p className="text-gray-600 text-sm">{selectedGame?.slots.current}/{selectedGame?.slots.max}</p>
              </div>
            </div>
            <Button
              onClick={() => {
                toggleJoinGame(selectedGame!.id);
                setSelectedGame(null);
              }}
              className={`w-full rounded-xl transition-all font-semibold ${joinedGames.includes(selectedGame?.id || '')
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                }`}
            >
              {joinedGames.includes(selectedGame?.id || '') ? 'Leave Game' : 'Join Game'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Permission Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl" aria-describedby="location-permission-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location Permission
            </DialogTitle>
            <DialogDescription id="location-permission-description">
              SportsPlus needs access to your location to help you find nearby games and connect with players in your area.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-sm text-blue-800">
                <strong>Why we need this:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Show you games near your location</li>
                <li>Help organizers verify attendance</li>
                <li>Improve matchmaking in your area</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleLocationPermission(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Not Now
              </Button>
              <Button
                onClick={() => handleLocationPermission(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl"
              >
                Allow Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Waiver Modal */}
      <WaiverModal
        isOpen={showWaiverModal}
        onAccept={handleWaiverAccept}
        onCancel={handleWaiverCancel}
        gameName={selectedGameName}
      />
    </div>
  );
}