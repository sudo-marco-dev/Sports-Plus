import { useState, useMemo } from 'react';
import { Trophy, Crown, Medal, Award, CheckCircle2 } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  initials: string;
  sport: string;
  mvps: number;
  wins: number;
  points: number;
  barangay: string;
  isVerified: boolean;
  rank: number;
  isCurrentUser: boolean;
}

interface Team {
  id: string;
  name: string;
  sport: string;
  wins: number;
  mvps: number;
  totalPoints: number;
  captainName: string;
}

interface LeaderboardScreenProps {
  onBack?: () => void;
}

// Mock data
const allPlayers: Player[] = [
  { id: 'p1', name: 'Marco Reyes', initials: 'MR', sport: 'Basketball', mvps: 12, wins: 28, points: 1240, barangay: 'Brgy. San Pedro', isVerified: true, rank: 1, isCurrentUser: true },
  { id: 'p2', name: 'Carlos Reyes', initials: 'CR', sport: 'Basketball', mvps: 11, wins: 25, points: 1180, barangay: 'Brgy. Bancao-Bancao', isVerified: true, rank: 2, isCurrentUser: false },
  { id: 'p3', name: 'Anika Santos', initials: 'AS', sport: 'Badminton', mvps: 9, wins: 22, points: 980, barangay: 'Brgy. Mandaragat', isVerified: true, rank: 3, isCurrentUser: false },
  { id: 'p4', name: 'Diego Lim', initials: 'DL', sport: 'Football', mvps: 8, wins: 20, points: 870, barangay: 'Brgy. Bagong Sikat', isVerified: true, rank: 4, isCurrentUser: false },
  { id: 'p5', name: 'Maria Santos', initials: 'MS', sport: 'Badminton', mvps: 7, wins: 18, points: 820, barangay: 'Brgy. San Jose', isVerified: true, rank: 5, isCurrentUser: false },
  { id: 'p6', name: 'James Lim', initials: 'JL', sport: 'Basketball', mvps: 6, wins: 15, points: 710, barangay: 'Brgy. San Pedro', isVerified: true, rank: 6, isCurrentUser: false },
  { id: 'p7', name: 'Carla Dizon', initials: 'CD', sport: 'Volleyball', mvps: 5, wins: 14, points: 520, barangay: 'Brgy. Bancao-Bancao', isVerified: false, rank: 7, isCurrentUser: false },
];

const allTeams: Team[] = [
  { id: 't1', name: 'Ballers PH', sport: 'Basketball', wins: 28, mvps: 15, totalPoints: 1010, captainName: 'Marco Reyes' },
  { id: 't2', name: 'FC Pasig', sport: 'Football', wins: 22, mvps: 10, totalPoints: 1320, captainName: 'Diego Lim' },
  { id: 't3', name: 'Smash Sisters', sport: 'Badminton', wins: 20, mvps: 12, totalPoints: 650, captainName: 'Anika Santos' },
  { id: 't4', name: 'Spike Force', sport: 'Volleyball', wins: 14, mvps: 6, totalPoints: 430, captainName: 'Carla Dizon' },
];

const sportEmojis: Record<string, string> = {
  Basketball: '🏀',
  Football: '⚽',
  Badminton: '🏸',
  Volleyball: '🏐',
  Tennis: '🎾',
  Swimming: '🏊',
  Running: '🏃',
  Cycling: '🚴',
};

const sportFilters = ['All', 'Basketball', 'Badminton', 'Football', 'Volleyball', 'Running', 'Cycling'];

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [activePeriod, setActivePeriod] = useState<'alltime' | 'monthly' | 'teams'>('alltime');
  const [activeSport, setActiveSport] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<'mvps' | 'wins'>('mvps');

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let filtered = allPlayers;
    if (activeSport !== 'All') {
      filtered = filtered.filter(p => p.sport === activeSport);
    }
    
    // Sort by selected category
    return filtered.sort((a, b) => {
      if (activeCategory === 'mvps') {
        return b.mvps - a.mvps;
      } else {
        return b.wins - a.wins;
      }
    });
  }, [activeSport, activeCategory]);

  // Filter and sort teams
  const filteredTeams = useMemo(() => {
    let filtered = allTeams;
    if (activeSport !== 'All') {
      filtered = filtered.filter(t => t.sport === activeSport);
    }
    return filtered.sort((a, b) => b.wins - a.wins);
  }, [activeSport]);

  const currentUser = allPlayers.find(p => p.isCurrentUser);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: 'bg-yellow-400', text: 'text-yellow-900', icon: '👑' };
    if (rank === 2) return { color: 'bg-gray-300', text: 'text-gray-900', icon: '🥈' };
    if (rank === 3) return { color: 'bg-orange-400', text: 'text-orange-900', icon: '🥉' };
    return { color: 'bg-gray-200', text: 'text-gray-700', icon: '#' };
  };

  const players = activePeriod === 'teams' ? [] : filteredPlayers;
  const teams = activePeriod === 'teams' ? filteredTeams : [];
  const displayData = activePeriod === 'teams' ? teams : players;

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-green-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 pt-10 pb-6 shadow-lg">
        <div className="flex items-center justify-center mb-4 gap-2">
          <Trophy className="size-7 text-yellow-300" />
          <h1 className="text-white text-2xl font-bold">Rankings</h1>
        </div>
      </div>

      {/* Sport Filter Chips - Horizontal Scroll */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap">
          {sportFilters.map(sport => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeSport === sport
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {sport === 'All' ? '🏆 All' : `${sportEmojis[sport] || ''} ${sport}`}
            </button>
          ))}
        </div>
      </div>

      {/* Period Selector - 3 Large Pills */}
      <div className="px-4 py-3 flex gap-2">
        <button
          onClick={() => setActivePeriod('alltime')}
          className={`flex-1 py-3 rounded-full font-semibold transition-all ${
            activePeriod === 'alltime'
              ? 'bg-white text-blue-600 shadow-md'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setActivePeriod('monthly')}
          className={`flex-1 py-3 rounded-full font-semibold transition-all ${
            activePeriod === 'monthly'
              ? 'bg-white text-blue-600 shadow-md'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setActivePeriod('teams')}
          className={`flex-1 py-3 rounded-full font-semibold transition-all ${
            activePeriod === 'teams'
              ? 'bg-white text-blue-600 shadow-md'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Teams
        </button>
      </div>

      {/* Category Toggle - Only for All Time and Monthly */}
      {activePeriod !== 'teams' && (
        <div className="px-4 py-2 flex gap-2">
          <button
            onClick={() => setActiveCategory('mvps')}
            className={`flex-1 py-2 px-3 rounded-full text-sm font-semibold transition-all ${
              activeCategory === 'mvps'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏆 MVPs
          </button>
          <button
            onClick={() => setActiveCategory('wins')}
            className={`flex-1 py-2 px-3 rounded-full text-sm font-semibold transition-all ${
              activeCategory === 'wins'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎯 Wins
          </button>
        </div>
      )}

      {/* Your Rank Banner */}
      {currentUser && activePeriod !== 'teams' && (
        <div className="mx-4 my-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-md">
          <p className="text-center font-semibold text-sm">
            Your Rank: <span className="text-lg font-bold">#{currentUser.rank}</span> · {currentUser.mvps} MVPs · {currentUser.wins} Wins · {currentUser.points} pts
          </p>
        </div>
      )}

      {/* Ranking List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Player Rankings */}
        {activePeriod !== 'teams' && (
          <>
            {/* Top 3 - Podium Cards */}
            {filteredPlayers.slice(0, 3).map((player, idx) => {
              const badge = getRankBadge(player.rank);
              const stat = activeCategory === 'mvps' ? player.mvps : player.wins;
              const statLabel = activeCategory === 'mvps' ? 'MVPs' : 'Wins';
              const isCurrentUser = player.isCurrentUser;

              return (
                <div
                  key={player.id}
                  className={`bg-white rounded-2xl p-4 shadow-md border-2 transition-all ${
                    isCurrentUser ? 'border-blue-400 bg-blue-50' : 'border-gray-100'
                  }`}
                >
                  {/* Rank and Avatar */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`${badge.color} ${badge.text} w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-md font-bold text-2xl flex-shrink-0`}>
                      {badge.icon === '#' ? `#${player.rank}` : badge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{player.name}</h3>
                        {player.isVerified && <CheckCircle2 className="size-4 text-blue-600" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                          {sportEmojis[player.sport] || ''} {player.sport}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{player.barangay}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 text-center">
                      <p className="text-2xl font-bold text-purple-600">{stat}</p>
                      <p className="text-xs text-purple-700 font-semibold">{statLabel}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-2 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{player.mvps}</p>
                      <p className="text-xs text-yellow-700 font-semibold">MVPs</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 text-center">
                      <p className="text-2xl font-bold text-green-600">{player.points}</p>
                      <p className="text-xs text-green-700 font-semibold">Pts</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Ranks 4+ - Compact Rows */}
            {filteredPlayers.slice(3).map((player) => {
              const stat = activeCategory === 'mvps' ? player.mvps : player.wins;
              const isCurrentUser = player.isCurrentUser;

              return (
                <div
                  key={player.id}
                  className={`bg-white rounded-xl p-3 flex items-center gap-3 border transition-all ${
                    isCurrentUser ? 'border-2 border-blue-400 bg-blue-50' : 'border border-gray-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-gray-700 flex-shrink-0">
                    #{player.rank}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {player.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">{player.name}</p>
                      {player.isVerified && <CheckCircle2 className="size-3 text-blue-600 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-600">{player.barangay}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-semibold">
                      {sportEmojis[player.sport] || ''} {player.sport}
                    </span>
                    <span className="font-bold text-gray-900 text-right min-w-8">{stat}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Team Rankings */}
        {activePeriod === 'teams' && (
          <>
            {filteredTeams.map((team, idx) => {
              const badge = getRankBadge(idx + 1);
              return (
                <div
                  key={team.id}
                  className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4"
                >
                  <div className={`${badge.color} ${badge.text} w-12 h-12 rounded-lg flex items-center justify-center shadow font-bold text-lg flex-shrink-0`}>
                    {badge.icon === '#' ? `#${idx + 1}` : badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{team.name}</h3>
                    <p className="text-xs text-gray-600">Captain: {team.captainName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                        {sportEmojis[team.sport] || ''} {team.sport}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">{team.wins}</p>
                    <p className="text-xs text-gray-600">Wins</p>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {displayData.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="size-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No rankings found for selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}