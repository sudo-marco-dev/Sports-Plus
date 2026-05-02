import { useState, useMemo } from 'react';
import { Trophy, CheckCircle2, BarChart3, ArrowLeft, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';

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
  role: 'player' | 'organization';
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

interface ScoutModeScreenProps {
  onBack: () => void;
}

// Mock data
const allPlayers: Player[] = [
  { id: 'p1', name: 'Marco Reyes', initials: 'MR', sport: 'Basketball', mvps: 12, wins: 28, points: 1240, barangay: 'Brgy. San Pedro', isVerified: true, rank: 1, isCurrentUser: true, role: 'player' },
  { id: 'p2', name: 'Carlos Reyes', initials: 'CR', sport: 'Basketball', mvps: 11, wins: 25, points: 1180, barangay: 'Brgy. Bancao-Bancao', isVerified: true, rank: 2, isCurrentUser: false, role: 'player' },
  { id: 'p3', name: 'Anika Santos', initials: 'AS', sport: 'Badminton', mvps: 9, wins: 22, points: 980, barangay: 'Brgy. Mandaragat', isVerified: true, rank: 3, isCurrentUser: false, role: 'player' },
  { id: 'p4', name: 'Diego Lim', initials: 'DL', sport: 'Football', mvps: 8, wins: 20, points: 870, barangay: 'Brgy. Bagong Sikat', isVerified: true, rank: 4, isCurrentUser: false, role: 'player' },
  { id: 'p5', name: 'Maria Santos', initials: 'MS', sport: 'Badminton', mvps: 7, wins: 18, points: 820, barangay: 'Brgy. San Jose', isVerified: true, rank: 5, isCurrentUser: false, role: 'player' },
  { id: 'p6', name: 'James Lim', initials: 'JL', sport: 'Basketball', mvps: 6, wins: 15, points: 710, barangay: 'Brgy. San Pedro', isVerified: true, rank: 6, isCurrentUser: false, role: 'player' },
  { id: 'p7', name: 'Carla Dizon', initials: 'CD', sport: 'Volleyball', mvps: 5, wins: 14, points: 520, barangay: 'Brgy. Bancao-Bancao', isVerified: false, rank: 7, isCurrentUser: false, role: 'player' },
];

const allTeams: Team[] = [
  { id: 't1', name: 'Ballers PH', sport: 'Basketball', wins: 28, mvps: 15, totalPoints: 1010, captainName: 'Marco Reyes' },
  { id: 't2', name: 'FC Sicsican', sport: 'Football', wins: 22, mvps: 10, totalPoints: 1320, captainName: 'Diego Lim' },
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

export function ScoutModeScreen({ onBack }: ScoutModeScreenProps) {
  const [activeEntity, setActiveEntity] = useState<'players' | 'teams'>('players');
  const [activePeriod, setActivePeriod] = useState<'alltime' | 'monthly'>('alltime');
  const [activeSport, setActiveSport] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<'mvps' | 'wins'>('mvps');

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let filtered = allPlayers.filter((p: Player) => p.role !== 'organization');
    if (activeSport !== 'All') {
      filtered = filtered.filter((p: Player) => p.sport === activeSport);
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
      filtered = filtered.filter((t: Team) => t.sport === activeSport);
    }
    return filtered.sort((a, b) => b.wins - a.wins);
  }, [activeSport]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: 'bg-yellow-400', text: 'text-yellow-900', icon: '👑' };
    if (rank === 2) return { color: 'bg-gray-300', text: 'text-gray-900', icon: '🥈' };
    if (rank === 3) return { color: 'bg-orange-400', text: 'text-orange-900', icon: '🥉' };
    return { color: 'bg-gray-200', text: 'text-gray-700', icon: '#' };
  };

  const players = activeEntity === 'teams' ? [] : filteredPlayers;
  const teams = activeEntity === 'teams' ? filteredTeams : [];
  const displayData = activeEntity === 'teams' ? teams : players;

  const chartData = useMemo(() => {
    if (activeEntity === 'players') {
      return filteredPlayers.slice(0, 5).map((p: Player) => ({
        name: p.name.split(' ')[0],
        value: activeCategory === 'mvps' ? p.mvps : p.wins,
        fullName: p.name,
      }));
    } else {
      return filteredTeams.slice(0, 5).map((t: Team) => ({
        name: t.name,
        value: t.wins,
        fullName: t.name,
      }));
    }
  }, [activeEntity, filteredPlayers, filteredTeams, activeCategory]);

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-green-50 flex flex-col pb-20 overflow-hidden">
      {/* Header - Blue/Green Gradient matching the updated UI */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-b-[2rem] pt-8 pb-12 px-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 text-white/80 hover:text-white transition-colors flex items-center justify-center bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-white text-xl font-bold tracking-tight">Scout Mode</h1>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <Input
            placeholder="Search players, sports, or locations..."
            className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl focus:bg-white/20 transition-all border shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Advanced Filters - Entity & Sport */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-500 ml-1">Rank For</Label>
            <Select value={activeEntity} onValueChange={(v: 'players' | 'teams') => setActiveEntity(v)}>
              <SelectTrigger className="bg-white border-gray-200 rounded-xl h-10 shadow-sm text-sm">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="players" className="rounded-lg">Players</SelectItem>
                <SelectItem value="teams" className="rounded-lg">Teams</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-500 ml-1">Sport</Label>
            <Select value={activeSport} onValueChange={(v: string) => setActiveSport(v)}>
              <SelectTrigger className="bg-white border-gray-200 rounded-xl h-10 shadow-sm text-sm">
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                {sportFilters.map(sport => (
                  <SelectItem key={sport} value={sport} className="rounded-lg">
                    {sport === 'All' ? '🏆 All Sports' : `${sportEmojis[sport] || ''} ${sport}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recharts Visualization */}
        <div>
          <Card className="rounded-2xl border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <BarChart3 className="size-4 text-blue-600" />
                Top 5 Performance
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-none">
                {activeEntity === 'players' ? (activeCategory === 'mvps' ? 'MVPs' : 'Wins') : 'Wins'}
              </Badge>
            </CardHeader>
            <CardContent className="p-0 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#6b7280' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6', radius: 8 }}
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border border-gray-100 shadow-xl rounded-lg text-xs pointer-events-none">
                            <p className="font-bold text-gray-900">{payload[0].payload.fullName}</p>
                            <p className="text-blue-600 font-semibold">{payload[0].value} {activeEntity === 'players' ? (activeCategory === 'mvps' ? 'MVPs' : 'Wins') : 'Wins'}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : index === 1 ? '#3b82f6' : index === 2 ? '#60a5fa' : '#93c5fd'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Period Selector - 2 Large Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setActivePeriod('alltime')}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${activePeriod === 'alltime'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 shadow-sm hover:bg-gray-50'
              }`}
          >
            All Time
          </button>
          <button
            onClick={() => setActivePeriod('monthly')}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${activePeriod === 'monthly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 shadow-sm hover:bg-gray-50'
              }`}
          >
            This Month
          </button>
        </div>

        {/* Category Toggle - Only for Players */}
        {activeEntity === 'players' && (
          <div className="flex gap-2">
            <button
              onClick={() => setActiveCategory('mvps')}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-semibold transition-all ${activeCategory === 'mvps'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50'
                }`}
            >
              🏆 MVPs
            </button>
            <button
              onClick={() => setActiveCategory('wins')}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-semibold transition-all ${activeCategory === 'wins'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50'
                }`}
            >
              🎯 Wins
            </button>
          </div>
        )}

        {/* Sign up Banner */}
        <div className="my-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-md text-center">
          <p className="font-bold text-sm tracking-wide">
            Sign up to join the leaderboard
          </p>
        </div>

        {/* Ranking List */}
        <div className="space-y-3 pb-8">
          {/* Player Rankings */}
          {activeEntity === 'players' && (
            <>
              {/* Top 3 - Podium Cards */}
              {filteredPlayers.slice(0, 3).map((player: Player) => {
                const badge = getRankBadge(player.rank);
                const stat = activeCategory === 'mvps' ? player.mvps : player.wins;
                const statLabel = activeCategory === 'mvps' ? 'MVPs' : 'Wins';

                return (
                  <div
                    key={player.id}
                    className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 transition-all pointer-events-none"
                  >
                    {/* Rank and Avatar */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`${badge.color} ${badge.text} w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-sm font-bold text-2xl flex-shrink-0`}>
                        {badge.icon === '#' ? `#${player.rank}` : badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{player.name}</h3>
                          {player.isVerified && <CheckCircle2 className="size-4 text-blue-600" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                            {sportEmojis[player.sport] || ''} {player.sport}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5 font-medium">{player.barangay}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-2.5 text-center border border-purple-100/50">
                        <p className="text-2xl font-bold text-purple-700">{stat}</p>
                        <p className="text-[10px] text-purple-800 font-bold uppercase tracking-wider">{statLabel}</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-2.5 text-center border border-yellow-100/50">
                        <p className="text-2xl font-bold text-yellow-700">{player.mvps}</p>
                        <p className="text-[10px] text-yellow-800 font-bold uppercase tracking-wider">MVPs</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-2.5 text-center border border-emerald-100/50">
                        <p className="text-2xl font-bold text-emerald-700">{player.points}</p>
                        <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Pts</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Ranks 4+ - Compact Rows */}
              {filteredPlayers.slice(3).map((player: Player) => {
                const stat = activeCategory === 'mvps' ? player.mvps : player.wins;

                return (
                  <div
                    key={player.id}
                    className="bg-white rounded-xl p-3 flex items-center gap-3 border border-gray-100 shadow-sm pointer-events-none"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 flex-shrink-0 border border-gray-200">
                      #{player.rank}
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                      {player.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-900 truncate">{player.name}</p>
                        {player.isVerified && <CheckCircle2 className="size-3.5 text-blue-600 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-gray-500">{player.barangay}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                        {sportEmojis[player.sport] || ''} {player.sport}
                      </span>
                      <span className="font-bold text-gray-900 text-right min-w-[24px] text-lg">{stat}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Team Rankings */}
          {activeEntity === 'teams' && (
            <>
              {filteredTeams.map((team: Team, idx: number) => {
                const badge = getRankBadge(idx + 1);
                return (
                  <div
                    key={team.id}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 pointer-events-none"
                  >
                    <div className={`${badge.color} ${badge.text} w-12 h-12 rounded-lg flex items-center justify-center shadow-sm font-bold text-lg flex-shrink-0`}>
                      {badge.icon === '#' ? `#${idx + 1}` : badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">{team.name}</h3>
                      <p className="text-[11px] text-gray-500 font-medium">Captain: {team.captainName}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                          {sportEmojis[team.sport] || ''} {team.sport}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-xl">{team.wins}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Wins</p>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {displayData.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No rankings found for selected filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
