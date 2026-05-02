import { useState } from 'react';
import { Trophy, Plus, Users, ArrowRight, UserPlus, Edit, Star, MessageCircle, Award, Gift, LogOut, Crown, Zap, CheckCircle2, Lock, Image as ImageIcon } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { MiniProfileCard } from '../components/MiniProfileCard';
import { mockTeams, mockUsers } from '../data/mockData';
import { toast } from 'sonner';

interface TeamsScreenProps {
  onBack?: () => void;
  onViewTeam?: (teamId: string) => void;
  joinedGameData?: any;
  createdGameData?: any;
}

const mockTeamMembers = [
  { id: '1', name: 'John Doe', role: 'Admin', verified: true, gamesPlayed: 45, rating: 4.8 },
  { id: '2', name: 'Alex Chen', role: 'Member', verified: true, gamesPlayed: 32, rating: 4.7 },
  { id: '3', name: 'Sarah Miller', role: 'Member', verified: true, gamesPlayed: 28, rating: 4.9 },
  { id: '4', name: 'Mike Johnson', role: 'Member', verified: true, gamesPlayed: 12, rating: 4.2 },
  { id: '5', name: 'Emma Davis', role: 'Member', verified: true, gamesPlayed: 38, rating: 4.6 },
];

const mockTeamAchievements = [
  { id: 1, name: 'Team Founded', icon: '🎉', earned: true, description: 'Create your team', points: 100, progress: 100 },
  { id: 2, name: '10 Games Won', icon: '🏆', earned: true, description: 'Win 10 team games', points: 250, progress: 100 },
  { id: 3, name: '50 Members', icon: '👥', earned: false, description: 'Reach 50 team members', points: 500, progress: 24 },
  { id: 4, name: 'Legendary Team', icon: '⭐', earned: false, description: 'Win 100 team games', points: 1000, progress: 10 },
];

const suggestedTeams = [
  { id: '4', name: 'City Runners', logo: '🏃', members: 15, sport: 'Running', level: 3, barangay: 'Brgy. San Pedro' },
  { id: '5', name: 'Aqua Stars', logo: '🏊', members: 10, sport: 'Swimming', level: 2, barangay: 'Brgy. Bancao-Bancao' },
  { id: '6', name: 'Net Masters', logo: '🎾', members: 8, sport: 'Tennis', level: 4, barangay: 'Brgy. Mandaragat' },
];

interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal';
  expReward: number;
  progress: number;
  maxProgress: number;
  icon: string;
}

const teamChallenges: TeamChallenge[] = [
  { id: '1', title: 'Win 3 Team Games', description: 'Complete 3 matches with your team this week', type: 'weekly', expReward: 150, progress: 1, maxProgress: 3, icon: '🏅' },
  { id: '2', title: 'Team Rating Goal', description: 'Reach 4.5 average team rating', type: 'weekly', expReward: 100, progress: 4.3, maxProgress: 4.5, icon: '⭐' },
  { id: '3', title: 'Active Team', description: 'Play 5 games as a team this week', type: 'daily', expReward: 50, progress: 3, maxProgress: 5, icon: '🎮' },
];

const teamPerks = [
  { level: 1, name: 'Rookie', perks: ['Basic team features', 'Create team profile', 'Invite up to 15 members'], color: 'from-gray-400 to-gray-600' },
  { level: 2, name: 'Semi-Pro', perks: ['Custom banner', 'Team description', 'Up to 25 members'], color: 'from-green-400 to-green-600' },
  { level: 3, name: 'Pro Team', perks: ['Exclusive challenges', 'Team medals', 'Up to 50 members'], color: 'from-blue-400 to-blue-600' },
  { level: 4, name: 'Elite Squad', perks: ['Double EXP from games', 'Priority matchmaking', 'Up to 100 members'], color: 'from-purple-400 to-purple-600' },
  { level: 5, name: 'Barangay Legend', perks: ['Featured on leaderboard', 'Invite-only matches', 'Unlimited members', 'Custom team badge'], color: 'from-yellow-400 to-orange-600' },
];

const initialCommunityFeed = [
  { id: '1', author: 'John Doe', content: 'Great game yesterday! 🏀', timestamp: '2h ago', likes: 12, image: null, liked: false, comments: [] },
  { id: '2', author: 'Sarah Miller', content: 'We won our first tournament match! 🏆', timestamp: '5h ago', likes: 24, image: null, liked: false, comments: [] },
  { id: '3', author: 'Alex Chen', content: 'Looking forward to next practice session', timestamp: '1d ago', likes: 8, image: null, liked: false, comments: [] },
];

export function TeamsScreen({ onBack, onViewTeam }: TeamsScreenProps) {
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedTeamTab, setSelectedTeamTab] = useState('overview');
  const [userPoints, setUserPoints] = useState(1250);
  const [reliabilityScore, setReliabilityScore] = useState(92);
  const [communityFeed, setCommunityFeed] = useState(initialCommunityFeed);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showPerksModal, setShowPerksModal] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<{
    id: string;
    name: string;
    logo: string;
    members: number;
    maxMembers: number;
    sport: string;
    points: number;
    role: string;
    level: number;
    exp: number;
    maxExp: number;
    barangay: string;
    avgRating: number;
  } | null>(null);
  const createTeamCost = 500;

  // Handler functions
  const handleLikePost = (postId: string) => {
    setCommunityFeed(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };

  const handleLeaveTeam = () => {
    toast.success('You have left the team');
    setCurrentTeam(null);
    setActiveTab('browse');
  };

  const handleJoinTeam = (team: typeof suggestedTeams[0]) => {
    setCurrentTeam({
      id: team.id,
      name: team.name,
      logo: team.logo,
      members: team.members,
      maxMembers: team.members + 5,
      sport: team.sport,
      points: 1000,
      role: 'Member',
      level: team.level,
      exp: 500,
      maxExp: 1000 * team.level,
      barangay: team.barangay,
      avgRating: 4.5,
    });
    setActiveTab('myteam');
    toast.success(`Joined ${team.name}!`);
  };

  const handleCreateTeam = () => {
    if (reliabilityScore < 100) {
      toast.error('You need a Reliability Score of 100 to create a team!');
      return;
    }
    if (userPoints < createTeamCost) {
      toast.error('Not enough points to create a team!');
      return;
    }
    setUserPoints(prev => prev - createTeamCost);
    toast.success('Team created successfully!');
  };

  const handleInviteMember = () => {
    toast.success('Invite link copied to clipboard!');
  };

  const handleEditTeam = () => {
    setShowEditDialog(false);
    toast.success('Team info updated!');
  };

  // Get sorted teams for leaderboard
  const topTeams = [...mockTeams].sort((a, b) => b.totalPoints - a.totalPoints);

  // Filter teams by sport
  const filteredTeams = selectedSport === 'All'
    ? [...mockTeams].sort((a, b) => b.totalPoints - a.totalPoints)
    : [...mockTeams].filter(t => t.sport === selectedSport).sort((a, b) => b.totalPoints - a.totalPoints);

  // Get unique sports
  const sports = ['All', ...new Set(mockTeams.map(t => t.sport))];

  // Get captain name from userId
  const getCaptainName = (captainId: string) => {
    return mockUsers.find(u => u.id === captainId)?.name || 'Unknown';
  };

  // Get sport badge color
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

  const earnedAchievements = mockTeamAchievements.filter(a => a.earned).length;
  const expPercentage = currentTeam ? (currentTeam.exp / currentTeam.maxExp) * 100 : 0;

  // If user has a team, show My Team tab option
  if (currentTeam) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-24">
        {/* Header with Tabs */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-b-[2rem] pt-8 pb-12 px-6">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                ←
              </button>
            )}
            <h1 className="text-white text-xl font-bold flex-1 text-center">Teams</h1>
            <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('browse')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'browse' ? 'bg-white text-blue-600' : 'text-white/80 hover:bg-white/20'}`}>Browse</button>
            <button onClick={() => setActiveTab('myteam')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'myteam' ? 'bg-white text-blue-600' : 'text-white/80 hover:bg-white/20'}`}>My Team</button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === 'browse' && (
            <div className="p-4 space-y-6 pb-24">
              {/* Top Teams Leaderboard */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-gray-900 font-bold">Top Teams</h2>
                </div>
                <div className="space-y-2">
                  {topTeams.map((team, index) => {
                    const captainName = getCaptainName(team.captainId);
                    return (
                      <div key={team.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{
                            backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E5E7EB',
                            color: index < 3 ? 'white' : '#6B7280'
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium text-sm">{team.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getSportColor(team.sport)}`}>{team.sport}</Badge>
                            <span className="text-xs text-gray-600">{team.record.wins}W · {team.record.losses}L · {team.record.draws}D</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-blue-600">{team.totalPoints}</div>
                          <span className="text-xs text-gray-500">Points</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sport Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {sports.map(sport => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedSport === sport
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>

              {/* Team Cards */}
              <div className="space-y-3">
                {filteredTeams.map(team => {
                  const captainName = getCaptainName(team.captainId);
                  return (
                    <div key={team.id} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 hover:shadow-xl transition-shadow" onClick={() => onViewTeam?.(team.id)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-gray-900 font-bold text-lg">{team.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Captain: {captainName}</p>
                        </div>
                        <Badge className={`${getSportColor(team.sport)} text-xs`}>{team.sport}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{team.members.length}</p>
                          <p className="text-xs text-gray-600">Members</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{team.record.wins}-{team.record.losses}-{team.record.draws}</p>
                          <p className="text-xs text-gray-600">Record</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{team.totalPoints}</p>
                          <p className="text-xs text-gray-600">Points</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); onViewTeam?.(team.id); }} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        View Team
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'myteam' && currentTeam && (
            <div className="pb-24">
              {/* Team Header */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 mx-4 -mt-10 relative z-10 overflow-hidden">
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl mb-3 shadow-sm border border-slate-100">
                    {currentTeam.logo}
                  </div>
                  <h1 className="text-slate-900 text-2xl font-bold mb-1">{currentTeam.name}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-slate-50 text-slate-500 border-slate-200">{currentTeam.sport}</Badge>
                    <Badge className="bg-slate-50 text-slate-500 border-slate-200">{currentTeam.barangay}</Badge>
                  </div>

                  {/* Team Level Badge */}
                  <div className="mt-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="size-4 text-blue-700" />
                      <span className="text-blue-700 font-medium">Level {currentTeam.level} - {teamPerks[currentTeam.level - 1].name}</span>
                    </div>
                  </div>
                </div>

                {/* EXP Progress Bar */}
                <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 text-sm font-medium">Team EXP</span>
                    <button onClick={() => setShowPerksModal(true)} className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 hover:underline">
                      <Gift className="size-3" /> View Perks
                    </button>
                  </div>
                  <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${expPercentage}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-slate-600 text-xs">{currentTeam.exp} / {currentTeam.maxExp} EXP</span>
                    <span className="text-slate-600 text-xs">{Math.round(expPercentage)}%</span>
                  </div>
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <p className="text-slate-900 font-bold">{currentTeam.members}/{currentTeam.maxMembers}</p>
                    <p className="text-slate-500 text-xs mt-0.5">Members</p>
                  </div>
                  <div className="text-center bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <p className="text-slate-900 font-bold">{currentTeam.points}</p>
                    <p className="text-slate-500 text-xs mt-0.5">Points</p>
                  </div>
                  <div className="text-center bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <p className="text-slate-900 font-bold">{currentTeam.avgRating.toFixed(1)}</p>
                    <p className="text-slate-500 text-xs mt-0.5">Rating</p>
                  </div>
                </div>
              </div>

              {/* Team Challenges */}
              <div className="px-6 mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-900 font-semibold">Active Challenges</h3>
                  <Badge variant="outline" className="text-xs">{teamChallenges.filter(c => c.progress >= c.maxProgress).length}/{teamChallenges.length} Complete</Badge>
                </div>
                <div className="space-y-3">
                  {teamChallenges.map((challenge) => {
                    const progressPercent = (challenge.progress / challenge.maxProgress) * 100;
                    const isComplete = challenge.progress >= challenge.maxProgress;
                    return (
                      <div key={challenge.id} className={`bg-white rounded-2xl p-4 shadow-lg border-2 transition-all ${isComplete ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:shadow-xl'}`}>
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{challenge.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h4 className="text-gray-900 font-semibold">{challenge.title}</h4>
                                <p className="text-xs text-gray-600 mt-0.5">{challenge.description}</p>
                              </div>
                              <Badge className={`flex-shrink-0 ml-2 ${challenge.type === 'daily' ? 'bg-blue-100 text-blue-700' : challenge.type === 'weekly' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                {challenge.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Zap className="size-3 text-yellow-600" />
                              <span className="text-xs text-gray-600">+{challenge.expReward} EXP</span>
                            </div>
                          </div>
                        </div>
                        {!isComplete && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{challenge.progress} / {challenge.maxProgress}</span>
                            </div>
                            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                            </div>
                          </div>
                        )}
                        {isComplete && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-green-600 font-semibold">
                            <CheckCircle2 className="size-4" />
                            <span>Challenge Complete!</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 mt-6">
                <Tabs value={selectedTeamTab} onValueChange={setSelectedTeamTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4 bg-white rounded-2xl shadow-lg h-12 p-1 gap-1">
                    <TabsTrigger value="overview" className="rounded-xl text-xs">
                      <Trophy className="size-3 mr-1" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="members" className="rounded-xl text-xs">
                      <Users className="size-3 mr-1" /> Members
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="rounded-xl text-xs">
                      <MessageCircle className="size-3 mr-1" /> Chat
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="rounded-xl text-xs">
                      <Award className="size-3 mr-1" /> Badges
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-4 space-y-4 pb-24">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={handleInviteMember} className="bg-white rounded-2xl shadow-lg text-blue-600 hover:bg-gray-50 h-auto py-4 flex-col gap-2 border-2 border-gray-100">
                        <UserPlus className="size-5" /> <span className="text-xs">Invite</span>
                      </Button>
                      {currentTeam.role === 'Admin' && (
                        <Button onClick={() => setShowEditDialog(true)} className="bg-white rounded-2xl shadow-lg text-blue-600 hover:bg-gray-50 h-auto py-4 flex-col gap-2 border-2 border-gray-100">
                          <Edit className="size-5" /> <span className="text-xs">Edit Team</span>
                        </Button>
                      )}
                    </div>

                    {/* Community Feed */}
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-900 font-semibold">Community Feed</h3>
                        <button className="text-sm text-blue-600 hover:underline">View All</button>
                      </div>
                      <div className="space-y-3">
                        {communityFeed.slice(0, 3).map((post) => (
                          <div key={post.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-start gap-2">
                              <button className="flex-shrink-0">
                                <Avatar className="size-8">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xs">
                                    {post.author.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-600">
                                  <button className="hover:underline text-blue-600 font-semibold" onClick={() => setSelectedMember({ name: post.author, username: post.author.toLowerCase().replace(' ', '_'), verified: true, gamesPlayed: 15, rating: 4.5 })}>
                                    {post.author}
                                  </button>
                                  {' '} • {post.timestamp}
                                </p>
                                <p className="text-sm text-gray-900 mt-1">{post.content}</p>
                                <button onClick={() => handleLikePost(post.id)} className={`text-xs mt-1.5 flex items-center gap-1 transition-colors ${post.liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}>
                                  <Star className={`size-3 ${post.liked ? 'fill-red-600' : ''}`} />
                                  {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Leave Team */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="w-full rounded-2xl shadow-lg text-red-600 border-2 border-red-200 hover:bg-red-50 h-12 px-4 py-2 inline-flex items-center justify-center transition-colors">
                          <LogOut className="size-5 mr-2" /> Leave Team
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90%] rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Leave Team?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to leave {currentTeam.name}? You can join another team after leaving.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
                          <AlertDialogCancel className="flex-1 m-0 rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLeaveTeam} className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl">Leave Team</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TabsContent>

                  {/* Members Tab */}
                  <TabsContent value="members" className="mt-4 space-y-3 pb-24">
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-900 font-semibold">Team Members ({mockTeamMembers.length})</h3>
                      </div>
                      <div className="space-y-2">
                        {mockTeamMembers.map((member) => (
                          <button key={member.id} onClick={() => setSelectedMember(member)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                            <Avatar className="size-11">
                              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-gray-900 font-semibold truncate">{member.name}</p>
                                <CheckCircle2 className="size-4 text-blue-600 flex-shrink-0" />
                                {member.role === 'Admin' && <Crown className="size-4 text-yellow-600 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-xs text-gray-600">{member.gamesPlayed} games</span>
                                <div className="flex items-center gap-0.5">
                                  <Star className="size-3 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs text-gray-600">{member.rating}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs flex-shrink-0">{member.role}</Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Chat Tab */}
                  <TabsContent value="chat" className="mt-4 pb-24">
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                      <MessageCircle className="size-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-gray-900 font-semibold mb-2">Team Chat</h3>
                      <p className="text-sm text-gray-600 mb-4">Connect with your teammates, plan matches, and share updates.</p>
                      <Button className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl">
                        <MessageCircle className="size-4 mr-2" /> Open Chat
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Achievements Tab */}
                  <TabsContent value="achievements" className="mt-4 space-y-3 pb-24">
                    {mockTeamAchievements.map((achievement) => (
                      <div key={achievement.id} className={`bg-white rounded-2xl shadow-lg p-4 border-2 ${achievement.earned ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`text-3xl ${!achievement.earned && 'opacity-40'}`}>{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h4 className="text-gray-900 font-semibold">{achievement.name}</h4>
                                <p className="text-sm text-gray-600 mt-0.5">{achievement.description}</p>
                              </div>
                              <Badge className={`flex-shrink-0 ml-2 ${achievement.earned ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {achievement.points} pts
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {!achievement.earned && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        )}
                        {achievement.earned && (
                          <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                            <Star className="size-4 fill-blue-600" />
                            <span>Earned!</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Perks Modal */}
              <Dialog open={showPerksModal} onOpenChange={setShowPerksModal}>
                <DialogContent className="max-w-[90%] rounded-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Team Level Perks</DialogTitle>
                    <DialogDescription>Unlock new features as your team levels up</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 pt-4">
                    {teamPerks.map((perk) => {
                      const isUnlocked = currentTeam && currentTeam.level >= perk.level;
                      const isCurrent = currentTeam && currentTeam.level === perk.level;
                      return (
                        <div key={perk.level} className={`rounded-2xl p-4 border-2 ${isCurrent ? 'border-blue-500 bg-blue-50' : isUnlocked ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${perk.color} shadow`}>
                              <span className="text-white font-semibold">Lv {perk.level}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-gray-900 font-semibold">{perk.name}</h4>
                                {isUnlocked && <CheckCircle2 className="size-4 text-green-600" />}
                                {!isUnlocked && <Lock className="size-4 text-gray-400" />}
                              </div>
                              <ul className="space-y-1">
                                {perk.perks.map((benefit, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Team Dialog */}
              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-[90%] rounded-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Team Info</DialogTitle>
                    <DialogDescription>Update your team's name, emoji, sport, and manage members.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="team-name">Team Name</Label>
                      <Input id="team-name" defaultValue={currentTeam.name} className="mt-1 rounded-xl" />
                    </div>
                    <div>
                      <Label htmlFor="team-logo">Team Emoji</Label>
                      <Input id="team-logo" defaultValue={currentTeam.logo} className="mt-1 rounded-xl" maxLength={2} />
                    </div>
                    <div>
                      <Label htmlFor="team-sport">Sport</Label>
                      <Input id="team-sport" defaultValue={currentTeam.sport} className="mt-1 rounded-xl" />
                    </div>

                    {/* Member Management */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <Label>Manage Members</Label>
                        <Badge variant="outline" className="text-xs">{mockTeamMembers.length} Members</Badge>
                      </div>
                      <div className="space-y-2 max-h-[240px] overflow-y-auto">
                        {mockTeamMembers.map((member) => (
                          <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                            <Avatar className="size-10">
                              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-900 font-semibold truncate">{member.name}</p>
                                <CheckCircle2 className="size-3 text-blue-600 flex-shrink-0" />
                                {member.role === 'Admin' && <Crown className="size-3 text-yellow-600 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-600">{member.gamesPlayed} games</span>
                                <div className="flex items-center gap-0.5">
                                  <Star className="size-2.5 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs text-gray-600">{member.rating}</span>
                                </div>
                              </div>
                            </div>
                            {member.role !== 'Admin' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-3 text-xs rounded-lg">
                                    Kick
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[90%] rounded-2xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Kick {member.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove this member from the team? They can rejoin if invited again.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
                                    <AlertDialogCancel className="flex-1 m-0 rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => toast.success(`${member.name} has been removed from the team`)} className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl">Remove</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleEditTeam} className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Mini Profile Card */}
              {selectedMember && (
                <MiniProfileCard
                  user={{
                    name: selectedMember.name,
                    username: selectedMember.username || selectedMember.name.toLowerCase().replace(' ', '_'),
                    userId: selectedMember.userId || 'SP2025-' + Math.floor(Math.random() * 10000),
                    rating: selectedMember.rating || 4.5,
                    isVerified: selectedMember.verified || false,
                    gamesPlayed: selectedMember.gamesPlayed || 0,
                    reliabilityScore: selectedMember.reliabilityScore || 95,
                    achievements: selectedMember.achievements || ['Team Member'],
                  }}
                  onClose={() => setSelectedMember(null)}
                  onViewFullProfile={() => {
                    setSelectedMember(null);
                  }}
                />
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  // If no team, show team discovery/creation view
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-b-[2rem] pt-8 pb-12 px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white text-2xl font-bold">Teams</h1>
            <p className="text-white/80 text-sm mt-1">Build your community</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl inline-block">
          <p className="text-xs text-white/80">Your Points</p>
          <p className="text-white font-semibold">🏆 {userPoints}</p>
        </div>
      </div>

      <div className="px-6 -mt-6 space-y-4 pb-24">
        {/* Create Team Section */}
        <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl shadow-xl shadow-blue-500/30 p-5 text-white">
          <h3 className="font-semibold mb-2">Create Your Own Team</h3>
          <p className="text-sm text-white/90 mb-4">Start your own team for {createTeamCost} points</p>
          <Button onClick={handleCreateTeam} disabled={userPoints < createTeamCost} className="w-full bg-white text-blue-600 hover:bg-white/90 rounded-xl disabled:opacity-50 font-semibold">
            <Plus className="size-5 mr-2" /> Create Team ({createTeamCost} pts)
          </Button>
        </div>

        {/* Suggested Teams */}
        <div className="space-y-3">
          <h3 className="text-gray-900 font-semibold px-1">Suggested Teams</h3>
          {suggestedTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-xl">
                  {team.logo}
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 font-semibold">{team.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className="bg-blue-100 text-blue-700 text-xs">{team.sport}</Badge>
                    <Badge className={`bg-gradient-to-r ${teamPerks[team.level - 1].color} text-white text-xs`}>
                      Lv {team.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{team.barangay} • {team.members} members</p>
                </div>
              </div>
              <Button onClick={() => handleJoinTeam(team)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold">
                Join Team
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
