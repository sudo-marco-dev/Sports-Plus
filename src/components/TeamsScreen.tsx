import { useState, useRef } from 'react';
import { Users, Plus, Trophy, UserPlus, Settings, LogOut, Edit, Star, Target, Award, TrendingUp, Zap, Lock, Crown, MessageCircle, Image as ImageIcon, ChevronRight, Gift, Send, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { NotificationSystem } from './NotificationSystem';
import { ScrollArea } from './ui/scroll-area';
import { MiniProfileCard } from './MiniProfileCard';
import { mockUsers } from '../data/mockData';

const mockTeamMembers = [
  { id: '1', name: 'John Doe', role: 'Admin', verified: true, gamesPlayed: 45, rating: 4.8 },
  { id: '2', name: 'Alex Chen', role: 'Member', verified: true, gamesPlayed: 32, rating: 4.7 },
  { id: '3', name: 'Sarah Miller', role: 'Member', verified: true, gamesPlayed: 28, rating: 4.9 },
  { id: '4', name: 'Mike Johnson', role: 'Member', verified: true, gamesPlayed: 12, rating: 4.2 },
  { id: '5', name: 'Emma Davis', role: 'Member', verified: true, gamesPlayed: 38, rating: 4.6 },
];

const mockTeamAchievements = [
  { 
    id: 1, 
    name: 'Team Founded', 
    icon: '🎉', 
    earned: true, 
    description: 'Create your team',
    points: 100,
    progress: 100
  },
  { 
    id: 2, 
    name: '10 Games Won', 
    icon: '🏆', 
    earned: true, 
    description: 'Win 10 team games',
    points: 250,
    progress: 100
  },
  { 
    id: 3, 
    name: '50 Members', 
    icon: '👥', 
    earned: false, 
    description: 'Reach 50 team members',
    points: 500,
    progress: 24
  },
  { 
    id: 4, 
    name: 'Legendary Team', 
    icon: '⭐', 
    earned: false, 
    description: 'Win 100 team games',
    points: 1000,
    progress: 10
  },
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
  {
    id: '1',
    title: 'Win 3 Team Games',
    description: 'Complete 3 matches with your team this week',
    type: 'weekly',
    expReward: 150,
    progress: 1,
    maxProgress: 3,
    icon: '🏅'
  },
  {
    id: '2',
    title: 'Team Rating Goal',
    description: 'Reach 4.5 average team rating',
    type: 'weekly',
    expReward: 100,
    progress: 4.3,
    maxProgress: 4.5,
    icon: '⭐'
  },
  {
    id: '3',
    title: 'Active Team',
    description: 'Play 5 games as a team this week',
    type: 'daily',
    expReward: 50,
    progress: 3,
    maxProgress: 5,
    icon: '🎮'
  },
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

export function TeamsScreen() {
  const [userPoints, setUserPoints] = useState(1250);
  const [reliabilityScore, setReliabilityScore] = useState(92);
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
  } | null>({
    id: '1',
    name: 'Thunder Squad',
    logo: '⚡',
    members: 12,
    maxMembers: 15,
    sport: 'Basketball',
    points: 2450,
    role: 'Admin',
    level: 3,
    exp: 1250,
    maxExp: 2000,
    barangay: 'Brgy. San Pedro',
    avgRating: 4.6,
  });
  const [showSuggested, setShowSuggested] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPerksModal, setShowPerksModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [communityFeed, setCommunityFeed] = useState(initialCommunityFeed);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [teamMessages, setTeamMessages] = useState<any[]>([
    { id:'m1', senderId:'u1', senderName:'Marco Reyes', senderInitials:'MR', text:'Hey team! Anyone free this Saturday?', timestamp:'10:23 AM', type:'text' },
    { id:'m2', senderId:'u6', senderName:'Rico Tan', senderInitials:'RT', text:'I am! What sport?', timestamp:'10:25 AM', type:'text' },
    { id:'m3', senderId:'u1', senderName:'Marco Reyes', senderInitials:'MR', text:'Basketball at Taguig Sports Complex 3PM', timestamp:'10:26 AM', type:'text' },
    { id:'m4', senderId:'system', senderName:'Sports Plus', senderInitials:'SP', text:'Marco Reyes invited the team to join "Taguig 3v3 Hoops" — Saturday 3PM at Taguig Sports Complex', timestamp:'10:27 AM', type:'game_invite', gameId:'g1', gameName:'Taguig 3v3 Hoops', gameVenue:'Taguig Sports Complex', gameTime:'Saturday 3:00 PM', sport:'Basketball' },
  ]);
  const [newTeamMessage, setNewTeamMessage] = useState('');
  const [showTeamChatMenu, setShowTeamChatMenu] = useState(false);
  const chatMenuRef = useRef<HTMLDivElement>(null);
  const createTeamCost = 500;

  const handleLikePost = (postId: string) => {
    setCommunityFeed(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleLeaveTeam = () => {
    toast.success('You have left the team');
    setCurrentTeam(null);
    setShowSuggested(true);
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
    setShowSuggested(false);
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

  const earnedAchievements = mockTeamAchievements.filter(a => a.earned).length;
  const expPercentage = currentTeam ? (currentTeam.exp / currentTeam.maxExp) * 100 : 0;

  // If user has a team, show full-page team view
  if (currentTeam) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col pb-24">
        <ScrollArea className="flex-1">
          {/* Team Header with Level Progression */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-[2rem] shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl mb-3 shadow-xl border-2 border-white/30">
                {currentTeam.logo}
              </div>
              <h1 className="text-white text-2xl mb-1">{currentTeam.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {currentTeam.sport}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {currentTeam.barangay}
                </Badge>
              </div>
              
              {/* Team Level Badge */}
              <div className={`mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${teamPerks[currentTeam.level - 1].color} shadow-lg`}>
                <div className="flex items-center gap-1.5">
                  <Trophy className="size-4 text-white" />
                  <span className="text-white">Level {currentTeam.level} - {teamPerks[currentTeam.level - 1].name}</span>
                </div>
              </div>
            </div>

            {/* EXP Progress Bar */}
            <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Team EXP</span>
                <button 
                  onClick={() => setShowPerksModal(true)}
                  className="text-white text-sm flex items-center gap-1 hover:underline"
                >
                  <Gift className="size-3" />
                  View Perks
                </button>
              </div>
              <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${expPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-white/80 text-xs">{currentTeam.exp} / {currentTeam.maxExp} EXP</span>
                <span className="text-white/80 text-xs">{Math.round(expPercentage)}%</span>
              </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                <p className="text-white">{currentTeam.members}/{currentTeam.maxMembers}</p>
                <p className="text-white/70 text-xs mt-0.5">Members</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                <p className="text-white">{currentTeam.points}</p>
                <p className="text-white/70 text-xs mt-0.5">Points</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                <p className="text-white">{currentTeam.avgRating.toFixed(1)}</p>
                <p className="text-white/70 text-xs mt-0.5">Rating</p>
              </div>
            </div>

            {/* Coach Section */}
            {currentTeam && (() => {
              const teamCoach = mockUsers.find(u => u.id === 'u3');
              if (!teamCoach) return null;
              return (
                <div className="mt-4 bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-semibold text-sm">JL</div>
                  <div>
                    <p className="text-white text-sm font-semibold">James Lim</p>
                    <p className="text-white/70 text-xs">Basketball Coach</p>
                  </div>
                  <span className="ml-auto bg-teal-400/30 text-teal-100 text-xs px-2 py-1 rounded-full">Coach</span>
                </div>
              );
            })()}
          </div>

          {/* Team Challenges Section */}
          <div className="px-6 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 font-semibold">Active Challenges</h3>
              <Badge variant="outline" className="text-xs">
                {teamChallenges.filter(c => c.progress >= c.maxProgress).length}/{teamChallenges.length} Complete
              </Badge>
            </div>
            <div className="space-y-3">
              {teamChallenges.map((challenge) => {
                const progressPercent = (challenge.progress / challenge.maxProgress) * 100;
                const isComplete = challenge.progress >= challenge.maxProgress;
                
                return (
                  <div 
                    key={challenge.id}
                    className={`bg-white rounded-2xl p-4 shadow-lg border-2 transition-all ${
                      isComplete ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{challenge.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="text-gray-900 font-semibold">{challenge.title}</h4>
                            <p className="text-xs text-gray-600 mt-0.5">{challenge.description}</p>
                          </div>
                          <Badge className={`flex-shrink-0 ml-2 ${
                            challenge.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                            challenge.type === 'weekly' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
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
                          <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
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
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-white rounded-2xl shadow-lg h-12 p-1 gap-1">
                <TabsTrigger value="overview" className="rounded-xl text-xs">
                  <Trophy className="size-3 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="members" className="rounded-xl text-xs">
                  <Users className="size-3 mr-1" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="chat" className="rounded-xl text-xs">
                  <MessageCircle className="size-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="achievements" className="rounded-xl text-xs">
                  <Award className="size-3 mr-1" />
                  Badges
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4 pb-24">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={handleInviteMember}
                    className="bg-white rounded-2xl shadow-lg text-blue-600 hover:bg-gray-50 h-auto py-4 flex-col gap-2 border-2 border-gray-100"
                  >
                    <UserPlus className="size-5" />
                    <span className="text-xs">Invite</span>
                  </Button>
                  {currentTeam.role === 'Admin' && (
                    <Button 
                      onClick={() => setShowEditDialog(true)}
                      className="bg-white rounded-2xl shadow-lg text-blue-600 hover:bg-gray-50 h-auto py-4 flex-col gap-2 border-2 border-gray-100"
                    >
                      <Edit className="size-5" />
                      <span className="text-xs">Edit Team</span>
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
                              <button 
                                className="hover:underline text-blue-600 font-semibold"
                                onClick={() => setSelectedMember({ 
                                  name: post.author, 
                                  username: post.author.toLowerCase().replace(' ', '_'),
                                  verified: true,
                                  gamesPlayed: 15,
                                  rating: 4.5
                                })}
                              >
                                {post.author}
                              </button>
                              {' '} • {post.timestamp}
                            </p>
                            <p className="text-sm text-gray-900 mt-1">{post.content}</p>
                            <button 
                              onClick={() => handleLikePost(post.id)}
                              className={`text-xs mt-1.5 flex items-center gap-1 transition-colors ${
                                post.liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                              }`}
                            >
                              <Star className={`size-3 ${post.liked ? 'fill-red-600' : ''}`} />
                              {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leave Team Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full rounded-2xl shadow-lg text-red-600 border-2 border-red-200 hover:bg-red-50 h-12 px-4 py-2 inline-flex items-center justify-center transition-colors">
                      <LogOut className="size-5 mr-2" />
                      Leave Team
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
                      <AlertDialogAction
                        onClick={handleLeaveTeam}
                        className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                      >
                        Leave Team
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TabsContent>

              <TabsContent value="members" className="mt-4 space-y-3 pb-24">
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-900 font-semibold">Team Members ({mockTeamMembers.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {mockTeamMembers.map((member) => (
                      <button 
                        key={member.id} 
                        onClick={() => setSelectedMember(member)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <Avatar className="size-11">
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900 font-semibold truncate">{member.name}</p>
                            <CheckCircle2 className="size-4 text-blue-600 flex-shrink-0" />
                            {member.role === 'Admin' && (
                              <Crown className="size-4 text-yellow-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-600">{member.gamesPlayed} games</span>
                            <div className="flex items-center gap-0.5">
                              <Star className="size-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs text-gray-600">{member.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {member.role}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="mt-4 pb-24">
                <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[600px] overflow-hidden">
                  {/* Chat Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4 pr-4">
                      {teamMessages.map((msg) => {
                        const isOwnMessage = msg.senderId === 'u1';
                        
                        if (msg.type === 'game_invite') {
                          return (
                            <div key={msg.id} className="flex justify-center">
                              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-4 max-w-xs border-2 border-purple-200 shadow-md">
                                <p className="text-xs text-gray-600 mb-2 font-medium">Game Invite</p>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                                    {msg.sport}
                                  </Badge>
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{msg.gameName}</h4>
                                <p className="text-xs text-gray-600 mb-1"><span className="font-semibold">📍</span> {msg.gameVenue}</p>
                                <p className="text-xs text-gray-600 mb-3"><span className="font-semibold">🕐</span> {msg.gameTime}</p>
                                <Button 
                                  onClick={() => toast.success('Joined game!')}
                                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs py-2 rounded-lg font-semibold"
                                >
                                  Join Game
                                </Button>
                                <p className="text-xs text-gray-500 mt-2 text-center">{msg.timestamp}</p>
                              </div>
                            </div>
                          );
                        }

                        if (msg.type === 'photo') {
                          return (
                            <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              <div className={`flex gap-2 ${isOwnMessage ? '' : 'flex-row'} max-w-xs`}>
                                {!isOwnMessage && (
                                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700 flex-shrink-0">
                                    {msg.senderInitials}
                                  </div>
                                )}
                                <div>
                                  {!isOwnMessage && <p className="text-xs font-semibold text-gray-900 mb-1">{msg.senderName}</p>}
                                  <div className={`w-40 h-40 rounded-xl bg-gray-200 flex items-center justify-center border-2 ${isOwnMessage ? 'border-blue-300' : 'border-gray-300'}`}>
                                    <Camera className="text-gray-400" size={32} />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''} max-w-xs`}>
                              {!isOwnMessage && (
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700 flex-shrink-0">
                                  {msg.senderInitials}
                                </div>
                              )}
                              <div className={isOwnMessage ? 'text-right' : ''}>
                                {!isOwnMessage && <p className="text-xs font-semibold text-gray-900 mb-1">{msg.senderName}</p>}
                                <div className={`rounded-2xl px-4 py-2 ${isOwnMessage ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                                  <p className="text-sm">{msg.text}</p>
                                </div>
                                <p className={`text-xs ${isOwnMessage ? 'text-gray-500 text-right' : 'text-gray-500'} mt-1`}>
                                  {msg.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Chat Input */}
                  <div className="border-t border-gray-200 p-3 bg-white">
                    <div className="flex gap-2 items-end relative">
                      <Input
                        value={newTeamMessage}
                        onChange={(e) => setNewTeamMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newTeamMessage.trim()) {
                            const msg = {
                              id: `m${Date.now()}`,
                              senderId: 'u1',
                              senderName: 'Marco Reyes',
                              senderInitials: 'MR',
                              text: newTeamMessage,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              type: 'text'
                            };
                            setTeamMessages([...teamMessages, msg]);
                            setNewTeamMessage('');
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 rounded-2xl py-2 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setShowTeamChatMenu(!showTeamChatMenu)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => {
                          if (newTeamMessage.trim()) {
                            const msg = {
                              id: `m${Date.now()}`,
                              senderId: 'u1',
                              senderName: 'Marco Reyes',
                              senderInitials: 'MR',
                              text: newTeamMessage,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              type: 'text'
                            };
                            setTeamMessages([...teamMessages, msg]);
                            setNewTeamMessage('');
                          }
                        }}
                        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Send size={20} />
                      </button>
                      
                      {/* Menu */}
                      {showTeamChatMenu && (
                        <div ref={chatMenuRef} className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48">
                          <button
                            onClick={() => {
                              toast.info('Join or create a game first to invite your team.');
                              setShowTeamChatMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-200 flex items-center gap-2"
                          >
                            <Trophy size={16} />
                            Invite to my game
                          </button>
                          <button
                            onClick={() => {
                              const photoMsg = {
                                id: `m${Date.now()}`,
                                senderId: 'u1',
                                senderName: 'Marco Reyes',
                                senderInitials: 'MR',
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                type: 'photo'
                              };
                              setTeamMessages([...teamMessages, photoMsg]);
                              setShowTeamChatMenu(false);
                              toast.success('Photo added to chat');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                          >
                            <Camera size={16} />
                            Share a photo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="mt-4 space-y-3 pb-24">
                {mockTeamAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-white rounded-2xl shadow-lg p-4 border-2 ${
                      achievement.earned
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`text-3xl ${!achievement.earned && 'opacity-40'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="text-gray-900 font-semibold">{achievement.name}</h4>
                            <p className="text-sm text-gray-600 mt-0.5">{achievement.description}</p>
                          </div>
                          <Badge className={`flex-shrink-0 ml-2 ${
                            achievement.earned
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
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
        </ScrollArea>

        {/* Team Perks Modal */}
        <Dialog open={showPerksModal} onOpenChange={setShowPerksModal}>
          <DialogContent className="max-w-[90%] rounded-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Team Level Perks</DialogTitle>
              <DialogDescription>
                Unlock new features as your team levels up
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              {teamPerks.map((perk, index) => {
                const isUnlocked = currentTeam && currentTeam.level >= perk.level;
                const isCurrent = currentTeam && currentTeam.level === perk.level;
                
                return (
                  <div
                    key={perk.level}
                    className={`rounded-2xl p-4 border-2 ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50'
                        : isUnlocked
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${perk.color} shadow`}>
                        <span className="text-white font-semibold">Lv {perk.level}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900 font-semibold">{perk.name}</h4>
                          {isUnlocked && (
                            <CheckCircle2 className="size-4 text-green-600" />
                          )}
                          {!isUnlocked && (
                            <Lock className="size-4 text-gray-400" />
                          )}
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
              <DialogDescription>
                Update your team's name, emoji, sport, and manage members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input 
                  id="team-name" 
                  defaultValue={currentTeam.name} 
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="team-logo">Team Emoji</Label>
                <Input 
                  id="team-logo" 
                  defaultValue={currentTeam.logo} 
                  className="mt-1 rounded-xl"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="team-sport">Sport</Label>
                <Input 
                  id="team-sport" 
                  defaultValue={currentTeam.sport} 
                  className="mt-1 rounded-xl"
                />
              </div>

              {/* Member Management Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <Label>Manage Members</Label>
                  <Badge variant="outline" className="text-xs">
                    {mockTeamMembers.length} Members
                  </Badge>
                </div>
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {mockTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-900 font-semibold truncate">{member.name}</p>
                          <CheckCircle2 className="size-3 text-blue-600 flex-shrink-0" />
                          {member.role === 'Admin' && (
                            <Crown className="size-3 text-yellow-600 flex-shrink-0" />
                          )}
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-3 text-xs rounded-lg"
                            >
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
                              <AlertDialogAction
                                onClick={() => {
                                  toast.success(`${member.name} has been removed from the team`);
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleEditTeam}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
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
              // Navigate to profile
            }}
          />
        )}
      </div>
    );
  }

  // If no team, show team discovery/creation view
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white text-2xl font-bold">Teams</h1>
            <p className="text-white/80 text-sm mt-1">Build your community</p>
          </div>
          <NotificationSystem unreadCount={3} />
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl inline-block">
          <p className="text-xs text-white/80">Your Points</p>
          <p className="text-white font-semibold">🏆 {userPoints}</p>
        </div>
      </div>

      <div className="px-6 -mt-6 space-y-4 pb-24">
        <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl shadow-xl shadow-blue-500/30 p-5 text-white">
          <h3 className="font-semibold mb-2">Create Your Own Team</h3>
          <p className="text-sm text-white/90 mb-4">
            Start your own team for {createTeamCost} points
          </p>
          <Button 
            onClick={handleCreateTeam}
            disabled={userPoints < createTeamCost}
            className="w-full bg-white text-blue-600 hover:bg-white/90 rounded-xl disabled:opacity-50 font-semibold"
          >
            <Plus className="size-5 mr-2" />
            Create Team ({createTeamCost} pts)
          </Button>
        </div>

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
              <Button 
                onClick={() => handleJoinTeam(team)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold"
              >
                Join Team
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}