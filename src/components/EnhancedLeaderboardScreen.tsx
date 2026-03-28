import { useState } from 'react';
import { Trophy, Star, Target, MapPin, Crown, Medal, TrendingUp, Award } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { MiniProfileCard } from './MiniProfileCard';

interface LeaderboardScreenProps {
  onBack?: () => void;
}

interface Player {
  id: string;
  name: string;
  username: string;
  userId: string;
  avatar: string;
  score: number;
  gamesPlayed: number;
  rating: number;
  barangay: string;
  isVerified: boolean;
  rank: number;
  change: number;
  reliabilityScore?: number;
  achievements?: string[];
}

interface BarangayRanking {
  barangay: string;
  totalPoints: number;
  players: number;
  rank: number;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'all-time'>('monthly');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'date'>('rating');

  // Mock data
  const topRatedPlayers: Player[] = [
    { id: '1', name: 'Carlos Reyes', username: 'carlos_rey', userId: 'SP2025-1001', avatar: '', score: 4.9, gamesPlayed: 32, rating: 4.9, barangay: 'Brgy. San Pedro', isVerified: true, rank: 1, change: 0, reliabilityScore: 98, achievements: ['MVP', 'Perfect Attendance', '50 Games'], pwdStatus: 'Wheelchair user' },
    { id: '2', name: 'Maria Santos', username: 'maria_s', userId: 'SP2025-1002', avatar: '', score: 4.8, gamesPlayed: 28, rating: 4.8, barangay: 'Brgy. Bancao-Bancao', isVerified: true, rank: 2, change: 1, reliabilityScore: 95, achievements: ['Team Player', '25 Games'] },
    { id: '3', name: 'Juan dela Cruz', username: 'juan_dc', userId: 'SP2025-1003', avatar: '', score: 4.7, gamesPlayed: 25, rating: 4.7, barangay: 'Brgy. Mandaragat', isVerified: true, rank: 3, change: -1, reliabilityScore: 92, achievements: ['First Game', '10 Games'], pwdStatus: 'Visually impaired' },
    { id: '4', name: 'Ana Lopez', username: 'ana_lopez', userId: 'SP2025-1004', avatar: '', score: 4.6, gamesPlayed: 22, rating: 4.6, barangay: 'Brgy. Bagong Sikat', isVerified: true, rank: 4, change: 2, reliabilityScore: 90, achievements: ['Quick Starter'] },
    { id: '5', name: 'Pedro Martinez', username: 'pedro_m', userId: 'SP2025-1005', avatar: '', score: 4.5, gamesPlayed: 20, rating: 4.5, barangay: 'Brgy. San Jose', isVerified: true, rank: 5, change: 0, reliabilityScore: 88, achievements: ['Rookie'], pwdStatus: 'Other', pwdOther: 'Speech impairment' },
  ];

  const mostVerifiedPlayers: Player[] = [
    { id: '1', name: 'Carlos Reyes', username: 'carlos_rey', userId: 'SP2025-1001', avatar: '', score: 32, gamesPlayed: 32, rating: 4.9, barangay: 'Brgy. San Pedro', isVerified: true, rank: 1, change: 0, reliabilityScore: 98, achievements: ['Game Master'] },
    { id: '2', name: 'Maria Santos', username: 'maria_s', userId: 'SP2025-1002', avatar: '', score: 28, gamesPlayed: 28, rating: 4.8, barangay: 'Brgy. Bancao-Bancao', isVerified: true, rank: 2, change: 0, reliabilityScore: 95, achievements: ['Consistent'] },
    { id: '3', name: 'Juan dela Cruz', username: 'juan_dc', userId: 'SP2025-1003', avatar: '', score: 25, gamesPlayed: 25, rating: 4.7, barangay: 'Brgy. Mandaragat', isVerified: true, rank: 3, change: 1, reliabilityScore: 92, achievements: ['Active'] },
    { id: '4', name: 'Ana Lopez', username: 'ana_lopez', userId: 'SP2025-1004', avatar: '', score: 22, gamesPlayed: 22, rating: 4.6, barangay: 'Brgy. Bagong Sikat', isVerified: true, rank: 4, change: -1, reliabilityScore: 90, achievements: ['Rising Star'] },
    { id: '5', name: 'Pedro Martinez', username: 'pedro_m', userId: 'SP2025-1005', avatar: '', score: 20, gamesPlayed: 20, rating: 4.5, barangay: 'Brgy. San Jose', isVerified: true, rank: 5, change: 0, reliabilityScore: 88, achievements: ['Newcomer'] },
  ];

  const mvpRankings: Player[] = topRatedPlayers.slice(0, 3);

  const barangayRankings: BarangayRanking[] = [
    { barangay: 'Brgy. San Pedro', totalPoints: 15420, players: 48, rank: 1 },
    { barangay: 'Brgy. Bancao-Bancao', totalPoints: 14250, players: 42, rank: 2 },
    { barangay: 'Brgy. Mandaragat', totalPoints: 13890, players: 39, rank: 3 },
    { barangay: 'Brgy. Bagong Sikat', totalPoints: 12340, players: 35, rank: 4 },
    { barangay: 'Brgy. San Jose', totalPoints: 11580, players: 31, rank: 5 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="size-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="size-5 text-gray-400" />;
    if (rank === 3) return <Award className="size-5 text-orange-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600';
    return 'bg-gray-200';
  };

  const PlayerCard = ({ player, scoreLabel }: { player: Player; scoreLabel: string }) => (
    <button
      onClick={() => setSelectedPlayer(player)}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-all hover:scale-[1.02]"
    >
      <div className="relative">
        <div className={`absolute -top-2 -left-2 size-8 rounded-full ${getRankBadge(player.rank)} flex items-center justify-center shadow-lg z-10`}>
          {player.rank <= 3 ? (
            getRankIcon(player.rank)
          ) : (
            <span className="text-white text-sm">#{player.rank}</span>
          )}
        </div>
        <Avatar className="size-16 border-2 border-white shadow">
          <div className="size-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
            <span className="text-white">{player.name.charAt(0)}</span>
          </div>
        </Avatar>
      </div>

      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="text-gray-900">{player.name}</span>
          {player.isVerified && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 h-5 px-1.5">
              <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Badge>
          )}
          {player.change !== 0 && (
            <span className={`flex items-center gap-0.5 ${player.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`size-3 ${player.change < 0 ? 'rotate-180' : ''}`} />
              <span className="text-xs">{Math.abs(player.change)}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{player.barangay}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{player.gamesPlayed} games</span>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-1 text-yellow-600">
          <Star className="size-4 fill-current" />
          <span>{player.score.toFixed(1)}</span>
        </div>
        <span className="text-xs text-gray-500">{scoreLabel}</span>
      </div>
    </button>
  );

  const BarangayCard = ({ barangay }: { barangay: BarangayRanking }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`size-12 rounded-full ${getRankBadge(barangay.rank)} flex items-center justify-center shadow`}>
        {barangay.rank <= 3 ? (
          getRankIcon(barangay.rank)
        ) : (
          <span className="text-white">#{barangay.rank}</span>
        )}
      </div>

      <div className="flex-1">
        <span className="text-gray-900">{barangay.barangay}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{barangay.players} players</span>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-1 text-blue-600">
          <Trophy className="size-4" />
          <span>{barangay.totalPoints.toLocaleString()}</span>
        </div>
        <span className="text-xs text-gray-500">Total Points</span>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 px-6 pt-12 pb-6 shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="size-8 text-yellow-300 mr-2" />
          <h1 className="text-white text-center">Leaderboards</h1>
        </div>
        
        {/* Period Toggle */}
        <div className="flex gap-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`flex-1 py-2 px-4 rounded-full transition-all text-center ${
              selectedPeriod === 'monthly'
                ? 'bg-white text-blue-600 shadow'
                : 'text-white'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedPeriod('all-time')}
            className={`flex-1 py-2 px-4 rounded-full transition-all text-center ${
              selectedPeriod === 'all-time'
                ? 'bg-white text-blue-600 shadow'
                : 'text-white'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="top-rated" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 gap-1 bg-transparent p-4 pb-0">
          <TabsTrigger value="top-rated" className="data-[state=active]:bg-white data-[state=active]:shadow flex-col gap-1 h-auto py-2 px-1">
            <Star className="size-4" />
            <span className="text-xs">Top Rated</span>
          </TabsTrigger>
          <TabsTrigger value="most-games" className="data-[state=active]:bg-white data-[state=active]:shadow flex-col gap-1 h-auto py-2 px-1">
            <Target className="size-4" />
            <span className="text-xs">Most Games</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4 pb-32">
            <TabsContent value="top-rated" className="mt-0 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-sm text-blue-800 text-center">
                  <Trophy className="size-4 inline mr-1" />
                  Players ranked by average star rating (minimum 5 verified games)
                </p>
              </div>
              {topRatedPlayers.map(player => (
                <PlayerCard key={player.id} player={player} scoreLabel="Avg Rating" />
              ))}
            </TabsContent>

            <TabsContent value="most-games" className="mt-0 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-sm text-green-800 text-center">
                  <Target className="size-4 inline mr-1" />
                  Players with the most verified matches
                </p>
              </div>
              {mostVerifiedPlayers.map(player => (
                <PlayerCard key={player.id} player={player} scoreLabel="Games Played" />
              ))}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      {/* Mini Profile Card */}
      {selectedPlayer && (
        <MiniProfileCard
          user={{
            name: selectedPlayer.name,
            username: selectedPlayer.username,
            userId: selectedPlayer.userId,
            rating: selectedPlayer.rating,
            isVerified: selectedPlayer.isVerified,
            gamesPlayed: selectedPlayer.gamesPlayed,
            reliabilityScore: selectedPlayer.reliabilityScore,
            achievements: selectedPlayer.achievements,
            pwdStatus: selectedPlayer.pwdStatus || '',
            pwdOther: selectedPlayer.pwdOther || '',
          }}
          onClose={() => setSelectedPlayer(null)}
          onViewFullProfile={() => {
            setSelectedPlayer(null);
            // Navigate to full profile
          }}
        />
      )}
    </div>
  );
}