import { useState } from 'react';
import { Building2, Calendar, Plus, Users, ArrowLeft, Activity, MapPin, Trophy, BarChart3, TrendingUp, Target, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { EventCreationForm } from './EventCreationForm';
import { ApplicantTriage } from './ApplicantTriage';
import { useSubscriptionLimits } from '../../hooks/useSubscriptionLimits';
import { PromoteDialog } from '../ui/PromoteDialog';

interface OrgDashboardProps {
  onBack: () => void;
  orgName?: string;
  isEmbedded?: boolean;
  onCreateEvent?: () => void;
  onUpgrade?: () => void;
}

interface LiveEvent {
  id: string;
  title: string;
  sport: string;
  date: string;
  venue: string;
  applicants: number;
  maxPlayers: number;
  status: 'active' | 'upcoming' | 'completed';
  isPromoted?: boolean;
}

const sportEmojis: Record<string, string> = {
  Basketball: '🏀', Football: '⚽', Badminton: '🏸',
  Volleyball: '🏐', Tennis: '🎾', Swimming: '🏊',
};

export const mockLiveEvents: LiveEvent[] = [
  {
    id: 'le1', title: 'Palawan Basketball Cup 2026', sport: 'Basketball',
    date: 'Apr 20, 2026', venue: 'Puerto Princesa City Coliseum',
    applicants: 18, maxPlayers: 24, status: 'active', isPromoted: true,
  },
  {
    id: 'le2', title: 'Inclusive Badminton Open', sport: 'Badminton',
    date: 'Apr 27, 2026', venue: 'San Pedro Covered Court',
    applicants: 12, maxPlayers: 16, status: 'upcoming',
  },
  {
    id: 'le3', title: 'Bancao-Bancao Futsal Tournament', sport: 'Football',
    date: 'Apr 9, 2026', venue: 'Bancao-Bancao Sports Center',
    applicants: 10, maxPlayers: 10, status: 'completed',
  },
];

export function OrgDashboard({ onBack, orgName = 'Rico Tan Sports', isEmbedded = false, onCreateEvent, onUpgrade }: OrgDashboardProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [promoteTargetName, setPromoteTargetName] = useState('');
  const { limit, count } = useSubscriptionLimits();

  const handlePromoteClick = (e: React.MouseEvent, eventTitle: string) => {
    e.stopPropagation();
    setPromoteTargetName(eventTitle);
    setPromoteDialogOpen(true);
  };

  const getStatusColor = (status: LiveEvent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-600';
    }
  };

  const handleEventCreate = (data: Record<string, unknown>) => {
    toast.success('Event published successfully!', {
      description: 'Players can now apply to your event.',
    });
  };

  // Analytics Calculations
  const totalApplicants = mockLiveEvents.reduce((sum, e) => sum + e.applicants, 0);
  const totalCapacity = mockLiveEvents.reduce((sum, e) => sum + e.maxPlayers, 0);
  const fillRate = totalCapacity > 0 ? Math.round((totalApplicants / totalCapacity) * 100) : 0;

  const fillingData = [
    { name: 'Filled', value: totalApplicants },
    { name: 'Remaining', value: totalCapacity - totalApplicants },
  ];
  const COLORS = ['#2563eb', '#e5e7eb']; // Blue and Gray

  return (
    <div className={`${isEmbedded ? 'flex-1' : 'h-full'} w-full bg-gray-50 flex flex-col relative`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-16 pb-20 px-8 rounded-b-[3rem] shadow-2xl shadow-blue-900/30 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack}
            className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-lg text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-white/80" />
              <h1 className="text-white text-xl font-bold">{orgName}</h1>
            </div>
            <p className="text-white/70 text-sm ml-7">Organization Dashboard</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <Activity className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-white font-bold text-lg">{mockLiveEvents.filter(e => e.status === 'active').length}</p>
            <p className="text-white/60 text-xs">Active</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <Users className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-white font-bold text-lg">{totalApplicants}</p>
            <p className="text-white/60 text-xs">Applicants</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <Trophy className="w-4 h-4 text-white/80 mx-auto mb-1" />
            <p className="text-white font-bold text-lg">{mockLiveEvents.length}</p>
            <p className="text-white/60 text-xs">Total Events</p>
          </div>
        </div>

        {/* Analytics Performance Card - Mini */}
        <div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-4 border border-blue-100">
          <div className="relative size-20 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fillingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={35}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {fillingData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-blue-700">{fillRate}%</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-green-500" />
              Event Capacity
            </h3>
            <p className="text-[11px] text-gray-500 mb-2">Clulster fill rate across events</p>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-bold text-gray-900">{totalApplicants}</p>
                <p className="text-[10px] text-gray-400">Actual</p>
              </div>
              <div className="w-px h-6 bg-gray-100" />
              <div>
                <p className="text-xs font-bold text-gray-900">{totalCapacity}</p>
                <p className="text-[10px] text-gray-400">Target</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Events Section */}
      <div className="px-4 relative flex-1 flex flex-col pb-24">
        {/* Sticky Sub-Header */}
        <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 rounded-2xl p-4 flex items-center justify-between my-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Live Events</h2>
          </div>
          {onCreateEvent && (
            <div className="flex flex-col items-center gap-1">
              <Button onClick={onCreateEvent} size="sm" className="bg-gradient-to-br from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl h-8 text-xs px-3 shadow-md">
                <Plus className="w-4 h-4 mr-1" /> Create
              </Button>
              {limit && (
                <p className="text-[9px] font-medium text-amber-600 whitespace-nowrap">
                  Free Limit Reached ({count}/{limit})
                </p>
              )}
            </div>
          )}
        </div>

        {/* Scrollable Container for Event Cards */}
        <div className="flex-1 overflow-y-auto z-10 w-full">
          {selectedEvent ? (
            <div className="space-y-5 px-1">
              <button onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-2 text-sm text-purple-600 font-semibold hover:text-purple-700">
                <ArrowLeft className="w-4 h-4" /> Back to Events
              </button>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-3">
                <h3 className="font-bold text-gray-900 mb-1">
                  {mockLiveEvents.find(e => e.id === selectedEvent)?.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3">Manage applications for this event</p>
              </div>
              <ApplicantTriage />
            </div>
          ) : (
            <div className="space-y-5 px-1 pb-4">
              {mockLiveEvents.map((event) => (
                <button key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {sportEmojis[event.sport] || '🎯'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{event.title}</h3>
                        <Badge className={`${getStatusColor(event.status)} text-xs flex-shrink-0 border-none`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      {/* Applicant progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all"
                            style={{ width: `${(event.applicants / event.maxPlayers) * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 font-medium flex-shrink-0">
                          {event.applicants}/{event.maxPlayers}
                        </span>
                      </div>
                      {/* Promote button for non-completed, non-promoted events */}
                      {event.status !== 'completed' && !event.isPromoted && (
                        <button
                          onClick={(e) => handlePromoteClick(e, event.title)}
                          className="text-xs font-semibold text-[#f59e0b] border border-[#f59e0b] rounded-full px-3 py-1 hover:bg-amber-50 transition-colors flex items-center gap-1 mt-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          Promote
                        </button>
                      )}
                      {event.isPromoted && (
                        <span 
                          style={{ background: 'linear-gradient(to right, #fbbf24, #ea580c)' }}
                          className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm mt-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                          Promoted
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {mockLiveEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold">No events yet</p>
                  <p className="text-gray-400 text-sm mt-1">Create your first event to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Promote Dialog */}
      <PromoteDialog
        isOpen={promoteDialogOpen}
        onClose={() => setPromoteDialogOpen(false)}
        tournamentName={promoteTargetName}
      />
    </div>
  );
}
