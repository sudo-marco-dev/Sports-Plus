import { useState, useMemo } from 'react';
import { Calendar, MapPin, Users, Trophy, ScrollText } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

// Sport emoji mapping
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

interface SoloEvent {
  id: string;
  name: string;
  sport: string;
  org: string;
  date: string;
  venue: string;
  entryFee: string;
  prize: string;
  slots: { filled: number; total: number };
  format: string;
  isPWDDivision: boolean;
  skillLevel: string;
  status: 'open' | 'almost-full' | 'full';
}

interface TeamEvent {
  id: string;
  name: string;
  sport: string;
  org: string;
  date: string;
  venue: string;
  entryFee: string;
  prize: string;
  slots: { filled: number; total: number };
  format: string;
  isPWDDivision: boolean;
  teamSize: string;
  status: 'open' | 'almost-full' | 'full';
}

// Mock data
const soloEvents: SoloEvent[] = [
  {
    id: 'se1',
    name: 'Metro Manila Badminton Open',
    sport: 'Badminton',
    org: 'Puerto Princesa Sports Office',
    date: 'Apr 20, 2026',
    venue: 'Pasig Badminton Center',
    entryFee: 'Free',
    prize: 'Gold Medal + Certificate',
    slots: { filled: 24, total: 32 },
    format: 'Single Elimination',
    isPWDDivision: true,
    skillLevel: 'All levels',
    status: 'open',
  },
  {
    id: 'se2',
    name: 'QC Fun Run 5K',
    sport: 'Running',
    org: 'Quezon City Athletics',
    date: 'Apr 27, 2026',
    venue: 'Quezon Memorial Circle',
    entryFee: '₱150',
    prize: 'Finisher Medal',
    slots: { filled: 180, total: 200 },
    format: 'Time Trial',
    isPWDDivision: true,
    skillLevel: 'Casual',
    status: 'open',
  },
  {
    id: 'se3',
    name: 'BGC Cycling Race 2026',
    sport: 'Cycling',
    org: 'BGC Sports Club',
    date: 'May 3, 2026',
    venue: 'Bonifacio Global City',
    entryFee: '₱300',
    prize: '₱5,000 + Trophy',
    slots: { filled: 48, total: 50 },
    format: 'Circuit Race',
    isPWDDivision: false,
    skillLevel: 'Competitive',
    status: 'almost-full',
  },
  {
    id: 'se4',
    name: 'Manila Tennis Singles Cup',
    sport: 'Tennis',
    org: 'Manila Tennis Club',
    date: 'May 10, 2026',
    venue: 'Manila Tennis Club',
    entryFee: '₱200',
    prize: 'Trophy + Certificate',
    slots: { filled: 16, total: 16 },
    format: 'Round Robin',
    isPWDDivision: false,
    skillLevel: 'Intermediate',
    status: 'full',
  },
  {
    id: 'se5',
    name: 'Inclusive Swimming Championship',
    sport: 'Swimming',
    org: 'Philippine Swimming Inc.',
    date: 'May 17, 2026',
    venue: 'Rizal Memorial Pool',
    entryFee: 'Free',
    prize: 'Gold Medal',
    slots: { filled: 30, total: 40 },
    format: 'Heat & Finals',
    isPWDDivision: true,
    skillLevel: 'All levels',
    status: 'open',
  },
];

const teamEvents: TeamEvent[] = [
  {
    id: 'te1',
    name: 'Metro Manila Basketball Cup',
    sport: 'Basketball',
    org: 'Metro Manila Sports Dev.',
    date: 'Apr 20, 2026',
    venue: 'Rizal Memorial Coliseum',
    entryFee: 'Free',
    prize: 'Trophy + Certificate',
    slots: { filled: 6, total: 8 },
    format: 'Single Elimination',
    isPWDDivision: true,
    teamSize: '5v5',
    status: 'open',
  },
  {
    id: 'te2',
    name: 'NCR Football League',
    sport: 'Football',
    org: 'Philippine Football Fed.',
    date: 'Apr 26, 2026',
    venue: 'Rizal Memorial Stadium',
    entryFee: '₱500/team',
    prize: '₱20,000 + Trophy',
    slots: { filled: 10, total: 16 },
    format: 'Round Robin + Playoffs',
    isPWDDivision: false,
    teamSize: '11v11',
    status: 'open',
  },
  {
    id: 'te3',
    name: 'Volleyball Club Championships',
    sport: 'Volleyball',
    org: 'Philippine Volleyball Fed.',
    date: 'May 4, 2026',
    venue: 'PhilSports Arena',
    entryFee: 'Free',
    prize: 'Gold Medal',
    slots: { filled: 12, total: 12 },
    format: 'Round Robin',
    isPWDDivision: false,
    teamSize: '6v6',
    status: 'full',
  },
  {
    id: 'te4',
    name: '3x3 Basketball Street Cup',
    sport: 'Basketball',
    org: 'FIBA Philippines',
    date: 'May 11, 2026',
    venue: 'SM Mall of Asia Concert Grounds',
    entryFee: '₱200/team',
    prize: '₱10,000 + Medals',
    slots: { filled: 20, total: 32 },
    format: 'Swiss + Single Elim',
    isPWDDivision: false,
    teamSize: '3v3',
    status: 'open',
  },
];

const sportOptions = ['All', 'Basketball', 'Badminton', 'Football', 'Volleyball', 'Running', 'Cycling', 'Tennis', 'Swimming'];

interface EventsScreenProps {
  onBack?: () => void;
  onJoinGame?: (gameId: string) => void;
  onJoinTournament?: (tournamentId: string) => void;
}

export function EventsScreen({ onBack }: EventsScreenProps) {
  const [activeTab, setActiveTab] = useState<'solo' | 'team'>('solo');
  const [sportFilter, setSportFilter] = useState('All');
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [selectedTeamEvent, setSelectedTeamEvent] = useState<TeamEvent | null>(null);

  // Filter events based on sport
  const filteredSoloEvents = useMemo(() => {
    if (sportFilter === 'All') return soloEvents;
    return soloEvents.filter(e => e.sport === sportFilter);
  }, [sportFilter]);

  const filteredTeamEvents = useMemo(() => {
    if (sportFilter === 'All') return teamEvents;
    return teamEvents.filter(e => e.sport === sportFilter);
  }, [sportFilter]);

  const getStatusBadge = (status: 'open' | 'almost-full' | 'full') => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-600 text-white text-xs">Open</Badge>;
      case 'almost-full':
        return <Badge className="bg-orange-500 text-white text-xs">Almost Full</Badge>;
      case 'full':
        return <Badge className="bg-red-600 text-white text-xs">Full</Badge>;
    }
  };

  const handleRegisterSolo = (event: SoloEvent) => {
    if (event.status === 'full') return;
    toast.success(`Registered for ${event.name}! Check My Schedule for details.`);
  };

  const handleRegisterTeam = (event: TeamEvent) => {
    if (event.status === 'full') return;
    setSelectedTeamEvent(event);
    setShowTeamPicker(true);
  };

  const handleConfirmTeamRegistration = () => {
    if (selectedTeamEvent) {
      toast.success(`Thunder Squad registered for ${selectedTeamEvent.name}!`);
      setShowTeamPicker(false);
      setSelectedTeamEvent(null);
    }
  };

  const wrapperEvents = activeTab === 'solo' ? filteredSoloEvents : filteredTeamEvents;

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 pt-6 pb-6 px-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Events</h1>
            <p className="text-white/80 text-sm">Tournaments & competitions near you</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-lg text-white"
            >
              ←
            </button>
          )}
        </div>
      </div>

      {/* Sport Filter Chips - Horizontal Scroll */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-2">
          {sportOptions.map(sport => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                sportFilter === sport
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Solo/Team Tab Toggle */}
      <div className="px-4 py-2 flex gap-3">
        <button
          onClick={() => setActiveTab('solo')}
          className={`flex-1 py-3 rounded-full font-bold transition-all ${
            activeTab === 'solo'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Solo
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-3 rounded-full font-bold transition-all ${
            activeTab === 'team'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Team
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {activeTab === 'solo' && (
          <>
            {filteredSoloEvents.length > 0 ? (
              filteredSoloEvents.map(event => (
                <div key={event.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                  {/* Top: Sport + Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-3xl">{sportEmojis[event.sport] || '🎯'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-600 text-xs font-semibold truncate">{event.sport}</p>
                      </div>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>

                  {/* Title */}
                  <h3 className="text-gray-900 font-bold text-base mb-3">{event.name}</h3>

                  {/* Org + Venue */}
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-2">
                    <MapPin size={14} />
                    <span>{event.org} • {event.venue}</span>
                  </div>

                  {/* Date + Entry Fee */}
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-3">
                    <Calendar size={14} />
                    <span>{event.date} • {event.entryFee}</span>
                  </div>

                  {/* Slots Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Slots Available</span>
                      <span>{event.slots.filled}/{event.slots.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                        style={{ width: `${(event.slots.filled / event.slots.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.isPWDDivision && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs border-purple-300">
                        PWD Division Available
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {event.skillLevel}
                    </Badge>
                  </div>

                  {/* Register Button */}
                  <Button
                    onClick={() => handleRegisterSolo(event)}
                    disabled={event.status === 'full'}
                    className={`w-full rounded-xl py-2 font-semibold ${
                      event.status === 'full'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    }`}
                  >
                    {event.status === 'full' ? 'Full' : 'Register Solo'}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No solo events found</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'team' && (
          <>
            {filteredTeamEvents.length > 0 ? (
              filteredTeamEvents.map(event => (
                <div key={event.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                  {/* Top: Sport + Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-3xl">{sportEmojis[event.sport] || '🎯'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-600 text-xs font-semibold truncate">{event.sport}</p>
                      </div>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>

                  {/* Title */}
                  <h3 className="text-gray-900 font-bold text-base mb-3">{event.name}</h3>

                  {/* Org + Venue */}
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-2">
                    <MapPin size={14} />
                    <span>{event.org} • {event.venue}</span>
                  </div>

                  {/* Date + Entry Fee */}
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-3">
                    <Calendar size={14} />
                    <span>{event.date} • {event.entryFee}</span>
                  </div>

                  {/* Slots Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Teams Registered</span>
                      <span>{event.slots.filled}/{event.slots.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                        style={{ width: `${(event.slots.filled / event.slots.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.isPWDDivision && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs border-purple-300">
                        PWD Division Available
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {event.teamSize}
                    </Badge>
                  </div>

                  {/* Register Button */}
                  <Button
                    onClick={() => handleRegisterTeam(event)}
                    disabled={event.status === 'full'}
                    className={`w-full rounded-xl py-2 font-semibold ${
                      event.status === 'full'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    }`}
                  >
                    {event.status === 'full' ? 'Full' : 'Register as Team'}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No team events found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Team Picker Modal */}
      {showTeamPicker && selectedTeamEvent && (
        <Dialog open={showTeamPicker} onOpenChange={setShowTeamPicker}>
          <DialogContent className="w-[95%] max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Register Team</DialogTitle>
              <DialogDescription>
                Select your team to register for {selectedTeamEvent.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Thunder Squad Option */}
              <div className="border-2 border-blue-600 rounded-xl p-4 bg-blue-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    ⚡
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Thunder Squad</p>
                    <p className="text-xs text-gray-600">12 members • Basketball</p>
                  </div>
                  <div className="text-blue-600">
                    <Trophy size={20} />
                  </div>
                </div>
              </div>
              
              {/* Confirm Button */}
              <Button
                onClick={handleConfirmTeamRegistration}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl py-3 hover:from-green-600 hover:to-emerald-700"
              >
                Confirm Registration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
