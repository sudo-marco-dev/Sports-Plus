import { useState } from 'react';
import { MapPin, Calendar, Users, CheckCircle2, MessageCircle, Star, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Event {
  id: string;
  title: string;
  type: 'Game' | 'Tournament';
  sport: string;
  skillLevels?: string[];
  location: string;
  date: string;
  time: string;
  slots?: { current: number; max: number };
  registeredTeams?: number;
  maxTeams?: number;
  organizer: { name: string; verified: boolean; rating: number };
  distance: string;
  description: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  prizePool?: string;
}

// Mock Games Data
const mockGames = [
  {
    id: '1',
    title: 'Casual Morning Basketball',
    type: 'Game' as const,
    sport: 'Basketball',
    skillLevels: ['Casual'],
    location: 'Brgy. San Pedro',
    date: 'Dec 16, 2025',
    time: '8:00 AM',
    slots: { current: 8, max: 10 },
    organizer: { name: 'Alex Chen', verified: true, rating: 4.8 },
    distance: '0.5 km',
    description: 'Friendly pickup game for casual players. No experience needed!',
    status: 'upcoming' as const,
  },
  {
    id: '2',
    title: 'Casual Volleyball Games',
    type: 'Game' as const,
    sport: 'Volleyball',
    skillLevels: ['Casual'],
    location: 'Brgy. Tiniguiban',
    date: 'Dec 16, 2025',
    time: '5:00 PM',
    slots: { current: 6, max: 12 },
    organizer: { name: 'Sarah Miller', verified: true, rating: 4.9 },
    distance: '1.2 km',
    description: 'Evening casual volleyball. Fun and relaxed atmosphere!',
    status: 'upcoming' as const,
  },
  {
    id: '3',
    title: 'Open Football - All Levels',
    type: 'Game' as const,
    sport: 'Football',
    skillLevels: ['Casual', 'Novice', 'Elite'],
    location: 'Brgy. Mandaragat',
    date: 'Dec 17, 2025',
    time: '6:30 PM',
    slots: { current: 12, max: 22 },
    organizer: { name: 'Mike Johnson', verified: true, rating: 4.7 },
    distance: '2.8 km',
    description: 'Open match for everyone - casual, intermediate, and experienced players welcome!',
    status: 'upcoming' as const,
  },
  {
    id: '4',
    title: 'Badminton - Mixed Levels',
    type: 'Game' as const,
    sport: 'Badminton',
    skillLevels: ['Casual', 'Novice'],
    location: 'Brgy. San Miguel',
    date: 'Dec 19, 2025',
    time: '4:00 PM',
    slots: { current: 3, max: 8 },
    organizer: { name: 'David Kim', verified: false, rating: 4.3 },
    distance: '0.8 km',
    description: 'Friendly badminton for casual and novice players.',
    status: 'upcoming' as const,
  },
  {
    id: '5',
    title: 'Swimming - All Levels Welcome',
    type: 'Game' as const,
    sport: 'Swimming',
    skillLevels: ['Casual', 'Novice', 'Elite'],
    location: 'Brgy. Matahimik',
    date: 'Dec 21, 2025',
    time: '9:00 AM',
    slots: { current: 7, max: 15 },
    organizer: { name: 'Tom Anderson', verified: true, rating: 4.5 },
    distance: '3.2 km',
    description: 'Open swimming session for all skill levels.',
    status: 'upcoming' as const,
  },
];

// Mock Tournaments Data
const mockTournaments: Event[] = [
  {
    id: 't1',
    title: 'Winter Basketball Championship',
    type: 'Tournament' as const,
    sport: 'Basketball',
    location: 'Brgy. San Pedro Sports Complex',
    date: 'Dec 20-22, 2025',
    time: '8:00 AM',
    registeredTeams: 5,
    maxTeams: 8,
    organizer: { name: 'Sports Plus Org', verified: true, rating: 4.9 },
    distance: '0.5 km',
    description: 'Regional basketball tournament with teams from across the barangays. Co-ed teams welcome.',
    status: 'upcoming' as const,
    prizePool: '₱25,000',
  },
  {
    id: 't2',
    title: 'Volleyball Grand Slam',
    type: 'Tournament' as const,
    sport: 'Volleyball',
    location: 'Brgy. Bancao-Bancao',
    date: 'Jan 5-7, 2026',
    time: '10:00 AM',
    registeredTeams: 12,
    maxTeams: 16,
    organizer: { name: 'Volleyball Federation', verified: true, rating: 4.8 },
    distance: '2.1 km',
    description: 'Women and men divisions. Best teams from the region competing for championship titles.',
    status: 'upcoming' as const,
    prizePool: '₱50,000',
  },
  {
    id: 't3',
    title: 'Community Football Festival',
    type: 'Tournament' as const,
    sport: 'Football',
    location: 'Brgy. Mandaragat',
    date: 'Dec 24-26, 2025',
    time: '9:00 AM',
    registeredTeams: 8,
    maxTeams: 12,
    organizer: { name: 'Local Sports Council', verified: true, rating: 4.6 },
    distance: '2.8 km',
    description: 'Grassroots football tournament for community teams. Fun, competitive, and supportive atmosphere.',
    status: 'upcoming' as const,
    prizePool: '₱15,000',
  },
  {
    id: 't4',
    title: 'Badminton Masters Invitational',
    type: 'Tournament' as const,
    sport: 'Badminton',
    location: 'Brgy. Bagong Sikat',
    date: 'Dec 30, 2025',
    time: '11:00 AM',
    registeredTeams: 3,
    maxTeams: 4,
    organizer: { name: 'Badminton Elite', verified: true, rating: 5.0 },
    distance: '1.8 km',
    description: 'Invitation-only badminton tournament featuring top-ranked players and emerging talents.',
    status: 'upcoming' as const,
    prizePool: '₱10,000',
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

interface EventsScreenProps {
  onBack?: () => void;
  onJoinGame?: (gameId: string) => void;
  joinedGames?: string[];
}

export function EventsScreen({ onBack, onJoinGame, joinedGames = [] }: EventsScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'games' | 'tournaments'>('all');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'distance'>('date');

  // Combine games and tournaments
  const allEvents: Event[] = [...mockGames, ...mockTournaments];

  // Filter events
  let filteredEvents = allEvents;

  if (selectedFilter === 'games') {
    filteredEvents = filteredEvents.filter(e => e.type === 'Game');
  } else if (selectedFilter === 'tournaments') {
    filteredEvents = filteredEvents.filter(e => e.type === 'Tournament');
  }

  if (selectedSport !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.sport === selectedSport);
  }

  // Sort events
  if (sortBy === 'distance') {
    filteredEvents.sort((a, b) => {
      const aDistance = parseFloat(a.distance);
      const bDistance = parseFloat(b.distance);
      return aDistance - bDistance;
    });
  }

  const getSkillLabel = (skillLevels?: string[]) => {
    if (!skillLevels) return '';
    if (skillLevels.length === 3) return 'All Levels';
    if (skillLevels.length === 1) return skillLevels[0];
    return `${skillLevels.join(' & ')}`;
  };

  const getEventStatus = (event: Event) => {
    if (event.type === 'Tournament') {
      return `${event.registeredTeams}/${event.maxTeams} teams`;
    } else {
      return `${event.slots?.current}/${event.slots?.max} players`;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl">Discover Events</h1>
            <p className="text-white/80 text-sm">Games & Tournaments near you</p>
          </div>
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl hover:bg-white/30 transition-colors"
          >
            <span className="text-white text-lg">←</span>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-white" />
          <input
            type="text"
            placeholder="Search events, sports, location..."
            className="bg-transparent text-white placeholder-white/60 outline-none flex-1"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 -mt-3 mb-4">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-1 flex gap-1">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`flex-1 py-2 rounded-xl transition-colors text-center text-sm font-medium ${
              selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('games')}
            className={`flex-1 py-2 rounded-xl transition-colors text-center text-sm font-medium ${
              selectedFilter === 'games' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Games
          </button>
          <button
            onClick={() => setSelectedFilter('tournaments')}
            className={`flex-1 py-2 rounded-xl transition-colors text-center text-sm font-medium ${
              selectedFilter === 'tournaments' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tournaments
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 space-y-3">
        {/* Sport Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          <button
            onClick={() => setSelectedSport('all')}
            className={`flex-shrink-0 border-2 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 transition-colors text-sm ${
              selectedSport === 'all'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            All Sports
          </button>
          {Object.entries(sportIcons).map(([sport, icon]) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`flex-shrink-0 border-2 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 transition-colors text-sm ${
                selectedSport === sport
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{icon}</span>
            </button>
          ))}
        </div>

        {/* Sort Option */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="distance">Sort by Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-3 cursor-pointer hover:shadow-xl transition-shadow"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-3xl flex-shrink-0">{sportIcons[event.sport] || '🎯'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{event.title}</h3>
                      <Badge
                        className={`flex-shrink-0 text-xs ${
                          event.type === 'Game'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    {event.type === 'Game' && event.skillLevels && (
                      <p className="text-xs text-gray-600 mt-1">{getSkillLabel(event.skillLevels)}</p>
                    )}
                    {event.prizePool && (
                      <p className="text-xs text-yellow-600 font-semibold mt-1">🏆 Prize Pool: {event.prizePool}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0 ml-2">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span className="text-xs font-semibold">{event.organizer.rating}</span>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{event.distance} away</span>
                  <span className="text-blue-600 font-semibold">{getEventStatus(event)}</span>
                </div>
              </div>

              {/* Organizer & CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{event.organizer.name[0]}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900 font-medium">{event.organizer.name}</p>
                    {event.organizer.verified && (
                      <p className="text-xs text-green-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={event.type === 'Game' && joinedGames.includes(event.id) ? 'outline' : 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (event.type === 'Game') {
                      onJoinGame?.(event.id);
                    }
                  }}
                  disabled={event.type === 'Tournament'}
                >
                  {event.type === 'Game' 
                    ? joinedGames.includes(event.id) ? 'Joined' : 'Join'
                    : 'Register'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your filters</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="w-[90vw] max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{sportIcons[selectedEvent.sport] || '🎯'}</span>
                <div className="flex-1">
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                  <Badge className="mt-2">{selectedEvent.type}</Badge>
                </div>
              </div>
            </DialogHeader>
            <DialogDescription className="space-y-4">
              <p className="text-gray-900">{selectedEvent.description}</p>

              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">📅 Date & Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedEvent.date} at {selectedEvent.time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">📍 Location</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">📊 Status</p>
                  <p className="text-sm font-semibold text-gray-900">{getEventStatus(selectedEvent)}</p>
                </div>
                {selectedEvent.prizePool && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">🏆 Prize Pool</p>
                    <p className="text-sm font-semibold text-yellow-600">{selectedEvent.prizePool}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 mb-1">⭐ Organizer</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {selectedEvent.organizer.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedEvent.organizer.name}</p>
                      <p className="text-xs text-gray-600">
                        Rating: {selectedEvent.organizer.rating} ⭐
                        {selectedEvent.organizer.verified && ' • Verified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={selectedEvent.type === 'Tournament'}
                onClick={() => {
                  if (selectedEvent.type === 'Game') {
                    onJoinGame?.(selectedEvent.id);
                  }
                }}
              >
                {selectedEvent.type === 'Game'
                  ? joinedGames.includes(selectedEvent.id) ? 'Joined' : 'Join Event'
                  : 'Register for Tournament'}
              </Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
