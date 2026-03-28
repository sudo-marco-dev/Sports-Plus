import { useState, useMemo } from 'react';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { mockGames, mockTournaments, Game, Tournament } from '../data/mockData';

type UnifiedEvent = (Game & { type: 'game' }) | (Tournament & { type: 'tournament' });
type FilterType = 'all' | 'games' | 'tournaments';

// Sport emoji mapping
const sportIcons: Record<string, string> = {
  Basketball: '🏀',
  Football: '⚽',
  Badminton: '🏸',
  Volleyball: '🏐',
  Tennis: '🎾',
  Swimming: '🏊',
};

interface EventsScreenProps {
  onJoinGame?: (gameId: string) => void;
  onJoinTournament?: (tournamentId: string) => void;
  onBack?: () => void;
}

export function EventsScreen({ onJoinGame, onJoinTournament, onBack }: EventsScreenProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  // Combine games and tournaments into unified events
  const unifiedEvents: UnifiedEvent[] = useMemo(() => {
    const games: UnifiedEvent[] = mockGames.map((g) => ({ ...g, type: 'game' as const }));
    const tournaments: UnifiedEvent[] = mockTournaments.map((t) => ({ ...t, type: 'tournament' as const }));
    return [...games, ...tournaments];
  }, []);

  // Filter events based on selected filter
  const filteredEvents = useMemo(() => {
    let events = unifiedEvents;

    if (filter === 'games') {
      events = events.filter((e) => e.type === 'game');
    } else if (filter === 'tournaments') {
      events = events.filter((e) => e.type === 'tournament');
    }

    // Sort by date ascending (soonest first)
    return events.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }, [unifiedEvents, filter]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, UnifiedEvent[]> = {};
    const today = new Date().toISOString().split('T')[0];

    filteredEvents.forEach((event) => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    return { groups, today };
  }, [filteredEvents]);

  const getVenueName = (event: UnifiedEvent): string => {
    if (event.type === 'game') {
      return (event as Game).venue.name;
    }
    return (event as Tournament).venue;
  };

  const getSportIcon = (sport: string): string => sportIcons[sport] || '🎯';

  const getEventDescription = (event: UnifiedEvent): string => {
    if (event.type === 'game') {
      const game = event as Game;
      return `${game.players.length}/${game.maxPlayers} players`;
    } else {
      const tournament = event as Tournament;
      return `${tournament.participants.length}/${tournament.maxParticipants} teams`;
    }
  };

  const getStatusBadges = (event: UnifiedEvent): JSX.Element[] => {
    const badges: JSX.Element[] = [];

    if (event.type === 'game') {
      const game = event as Game;
      
      // Status badge
      if (game.status === 'full') {
        badges.push(
          <Badge key="status-full" variant="destructive" className="text-xs">
            Full
          </Badge>
        );
      } else if (game.status === 'open') {
        badges.push(
          <Badge key="status-open" className="text-xs bg-green-600">
            Open
          </Badge>
        );
      }

      // PWD badge
      if (game.isPWDWelcome) {
        badges.push(
          <Badge key="pwd" variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
            PWD Welcome
          </Badge>
        );
      }
    } else {
      const tournament = event as Tournament;
      
      // Tournament type badge
      badges.push(
        <Badge key="tournament" variant="secondary" className="text-xs bg-blue-100 text-blue-700">
          Tournament
        </Badge>
      );

      // PWD division badge
      if (tournament.hasPWDDivision) {
        badges.push(
          <Badge key="pwd" variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
            PWD Welcome
          </Badge>
        );
      }
    }

    return badges;
  };

  const isEventFull = (event: UnifiedEvent): boolean => {
    if (event.type === 'game') {
      const game = event as Game;
      return game.status === 'full' || game.players.length >= game.maxPlayers;
    } else {
      const tournament = event as Tournament;
      return tournament.participants.length >= tournament.maxParticipants;
    }
  };

  const handleJoinEvent = (event: UnifiedEvent) => {
    if (event.type === 'game') {
      onJoinGame?.(event.id);
    } else {
      onJoinTournament?.(event.id);
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 pt-6 pb-6 px-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Events</h1>
            <p className="text-white/80 text-sm">Games & Tournaments</p>
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

      {/* Filter Tabs */}
      <div className="px-4 py-4 flex gap-2">
        {(['all', 'games', 'tournaments'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {Object.entries(groupedEvents.groups).map(([date, events]) => {
          const isToday = date === groupedEvents.today;
          const eventCount = events.length;
          const dateObj = new Date(date);
          const dateStr = isToday
            ? 'Today'
            : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

          return (
            <div key={date}>
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-gray-900">
                  {dateStr} — {eventCount} event{eventCount !== 1 ? 's' : ''}
                </h2>
              </div>

              {/* Event Cards */}
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4"
                  >
                    {/* Title & Sport Icon */}
                    <div className="flex gap-3 mb-3">
                      <div className="text-3xl flex-shrink-0">{getSportIcon(event.sport)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{event.title || event.name}</h3>
                        <p className="text-xs text-gray-600 truncate">{getVenueName(event)}</p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-xs text-gray-700 mb-3">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex gap-2 flex-wrap mb-3">
                      {/* Player/Team Count Badge */}
                      <Badge variant="outline" className="text-xs">
                        {event.type === 'game' ? '👥' : '🏆'} {getEventDescription(event)}
                      </Badge>

                      {/* Status & PWD Badges */}
                      {getStatusBadges(event)}
                    </div>

                    {/* Join Button */}
                    <Button
                      onClick={() => handleJoinEvent(event)}
                      disabled={isEventFull(event)}
                      className="w-full"
                      size="sm"
                    >
                      {isEventFull(event) ? 'Full' : event.type === 'game' ? 'Join Game' : 'Register Tournament'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
