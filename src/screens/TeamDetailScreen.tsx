import { useState } from 'react';
import { ArrowLeft, Star, Users, Activity, Briefcase, Accessibility, Plus } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { mockTeams, mockUsers } from '../data/mockData';

interface TeamDetailScreenProps {
  teamId: string;
  onBack?: () => void;
  currentUserId?: string;
}

export function TeamDetailScreen({ teamId, onBack, currentUserId }: TeamDetailScreenProps) {
  const team = mockTeams.find(t => t.id === teamId);
  const [showCoachPicker, setShowCoachPicker] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);

  if (!team) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Team not found</p>
      </div>
    );
  }

  // Get user info for captain and coach
  const captainUser = mockUsers.find(u => u.id === team.captainId);
  const coachUser = team.coachId ? mockUsers.find(u => u.id === team.coachId) : null;

  // Get member details sorted by points descending
  const memberDetails = team.members
    .map(member => ({
      ...member,
      user: mockUsers.find(u => u.id === member.userId),
    }))
    .sort((a, b) => b.points - a.points);

  // Get top performer
  const topPerformer = memberDetails[0];

  // Calculate stats
  const totalGamesPlayed = team.record.wins + team.record.losses + team.record.draws;
  const winRate = totalGamesPlayed > 0 ? ((team.record.wins / totalGamesPlayed) * 100).toFixed(1) : 0;

  // Get sport color
  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'Basketball':
        return 'bg-blue-100 text-blue-700';
      case 'Badminton':
        return 'bg-teal-100 text-teal-700';
      case 'Football':
        return 'bg-green-100 text-green-700';
      case 'Volleyball':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-b-[2rem] pt-8 pb-12 px-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold">{team.name}</h1>
            <p className="text-white/80 text-sm">{team.record.wins}W · {team.record.losses}L · {team.record.draws}D</p>
          </div>
        </div>
        <Badge className={`${getSportColor(team.sport)} text-sm`}>
          {team.sport}
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-lg shadow-gray-200/50">
              <div className="text-2xl font-bold text-blue-600">{team.totalPoints}</div>
              <p className="text-xs text-gray-600 mt-1">Total Points</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-lg shadow-gray-200/50">
              <div className="text-2xl font-bold text-green-600">{totalGamesPlayed}</div>
              <p className="text-xs text-gray-600 mt-1">Games Played</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-lg shadow-gray-200/50">
              <div className="text-2xl font-bold text-purple-600">{winRate}%</div>
              <p className="text-xs text-gray-600 mt-1">Win Rate</p>
            </div>
          </div>

          {/* Coach Card */}
          {coachUser && (
            <div className="bg-white rounded-xl p-4 shadow-lg shadow-gray-200/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {coachUser.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900 font-semibold">{coachUser.name}</h3>
                    <Badge className="bg-teal-100 text-teal-700 text-xs">Coach</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{coachUser.specialization || 'Coach'}</p>
                </div>
              </div>

              {currentUserId === team.captainId && (
                <button
                  onClick={() => setShowCoachPicker(true)}
                  className="mt-3 text-blue-600 text-xs font-semibold hover:underline"
                >
                  Change Coach
                </button>
              )}
            </div>
          )}

          {/* Assign Coach Button (Captain Only) */}
          {!coachUser && currentUserId === team.captainId && (
            <button
              onClick={() => setShowCoachPicker(true)}
              className="w-full bg-white border-2 border-dashed border-blue-300 rounded-xl p-4 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-blue-600 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Assign Coach
            </button>
          )}

          {/* Members Section */}
          <div className="bg-white rounded-xl p-4 shadow-lg shadow-gray-200/50">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900 font-semibold">Team Members</h3>
              <Badge variant="secondary" className="ml-auto">{team.members.length}</Badge>
            </div>

            <div className="space-y-3">
              {memberDetails.map((member, index) => {
                const isPWD = member.user?.isPWD;
                const isTopPerformer = topPerformer && member.userId === topPerformer.userId;

                return (
                  <div key={member.userId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {member.user?.initials}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium text-sm">{member.user?.name}</span>
                        {isTopPerformer && (
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        )}
                        {isPWD && (
                          <Accessibility className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${member.role === 'captain' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {member.role === 'captain' ? 'Captain' : 'Member'}
                        </Badge>
                        {isPWD && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            PWD Athlete
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-gray-900">{member.points}</div>
                      <div className="text-xs text-gray-500">{member.gamesPlayed} games</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Coach Picker Modal */}
      <Dialog open={showCoachPicker} onOpenChange={setShowCoachPicker}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign Coach</DialogTitle>
            <DialogDescription>
              Select a coach to assign to {team.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {mockUsers
              .filter(u => u.accountType === 'coach')
              .map(coach => (
                <button
                  key={coach.id}
                  onClick={() => {
                    setSelectedCoach(coach.id);
                    // In production, this would update the team and coach data
                    setShowCoachPicker(false);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedCoach === coach.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {coach.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold">{coach.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Specialization: {coach.specialization || 'General'}</p>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
