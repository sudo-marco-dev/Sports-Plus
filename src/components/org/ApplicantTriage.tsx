import { useState } from 'react';
import { CheckCircle2, XCircle, User, Trophy, Award, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose,
} from '../ui/drawer';
import { toast } from 'sonner';

interface Applicant {
  id: string;
  name: string;
  initials: string;
  sport: string;
  totalPoints: number;
  gamesPlayed: number;
  skillLevel: string;
  isVerified: boolean;
  isPWD: boolean;
  status: 'pending' | 'approved' | 'rejected';
  badges: string[];
  appliedAt: string;
}

const mockApplicants: Applicant[] = [
  {
    id: 'a1', name: 'Marco Reyes', initials: 'MR', sport: 'Basketball',
    totalPoints: 1240, gamesPlayed: 24, skillLevel: 'Competitive',
    isVerified: true, isPWD: false, status: 'pending',
    badges: ['MVP', 'Streak Master', 'Team Player'], appliedAt: '2 hours ago',
  },
  {
    id: 'a2', name: 'Anika Santos', initials: 'AS', sport: 'Badminton',
    totalPoints: 980, gamesPlayed: 18, skillLevel: 'Intermediate',
    isVerified: true, isPWD: true, status: 'pending',
    badges: ['Rising Star', 'Reliable'], appliedAt: '4 hours ago',
  },
  {
    id: 'a3', name: 'Juan dela Cruz', initials: 'JC', sport: 'Basketball',
    totalPoints: 850, gamesPlayed: 15, skillLevel: 'Intermediate',
    isVerified: true, isPWD: false, status: 'approved',
    badges: ['Team Player'], appliedAt: '1 day ago',
  },
  {
    id: 'a4', name: 'Carla Dizon', initials: 'CD', sport: 'Volleyball',
    totalPoints: 520, gamesPlayed: 11, skillLevel: 'Beginner',
    isVerified: false, isPWD: false, status: 'rejected',
    badges: [], appliedAt: '1 day ago',
  },
  {
    id: 'a5', name: 'Carlos Reyes', initials: 'CR', sport: 'Basketball',
    totalPoints: 920, gamesPlayed: 20, skillLevel: 'Intermediate',
    isVerified: true, isPWD: true, status: 'pending',
    badges: ['MVP', 'Reliable'], appliedAt: '5 hours ago',
  },
];

export function ApplicantTriage() {
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleApprove = (id: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a));
    const name = applicants.find(a => a.id === id)?.name;
    toast.success(`${name} has been approved!`, { description: 'They will be notified shortly.' });
  };

  const handleReject = (id: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a));
    const name = applicants.find(a => a.id === id)?.name;
    toast.error(`${name} has been rejected.`, { description: 'Application declined.' });
  };

  const openProfile = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDrawerOpen(true);
  };

  const filtered = filter === 'all' ? applicants : applicants.filter(a => a.status === filter);

  const statusBadge = (status: Applicant['status']) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-700 text-xs">Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 text-xs">Rejected</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs opacity-80">
                ({applicants.filter(a => f === 'all' || a.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applicant List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No applicants in this category</p>
          </div>
        ) : (
          filtered.map((applicant) => (
            <div key={applicant.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                {/* Avatar - clickable for drawer */}
                <button onClick={() => openProfile(applicant)} className="flex-shrink-0">
                  <Avatar className="w-12 h-12 border-2 border-purple-200">
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white font-bold text-sm">
                      {applicant.initials}
                    </AvatarFallback>
                  </Avatar>
                </button>

                <div className="flex-1 min-w-0">
                  {/* Name row */}
                  <div className="flex items-center gap-2 mb-1">
                    <button onClick={() => openProfile(applicant)}
                      className="font-semibold text-gray-900 text-sm hover:text-purple-600 transition-colors truncate">
                      {applicant.name}
                    </button>
                    {applicant.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                    {applicant.isPWD && <Badge className="bg-red-100 text-red-700 text-xs px-1.5 py-0">PWD</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{applicant.sport}</span>
                    <span>•</span>
                    <span>{applicant.totalPoints} pts</span>
                    <span>•</span>
                    <span>{applicant.appliedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(applicant.status)}
                    {applicant.badges.length > 0 && (
                      <Badge variant="outline" className="text-xs">{applicant.badges[0]}</Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {applicant.status === 'pending' && (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => handleApprove(applicant.id)}
                      className="w-9 h-9 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </button>
                    <button onClick={() => handleReject(applicant.id)}
                      className="w-9 h-9 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mini Profile Drawer (vaul) */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          {selectedApplicant && (
            <>
              <DrawerHeader className="pb-2">
                <DrawerTitle className="text-lg">Player Profile</DrawerTitle>
                <DrawerDescription>Viewing {selectedApplicant.name}'s stats</DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="px-4 pb-6">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-5 text-center mb-4">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-xl mx-auto">
                    <AvatarFallback className="bg-purple-200 text-purple-700 text-2xl font-bold">
                      {selectedApplicant.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <h3 className="text-white font-bold text-lg">{selectedApplicant.name}</h3>
                    {selectedApplicant.isVerified && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </div>
                  <p className="text-white/70 text-sm mt-1">{selectedApplicant.sport} • {selectedApplicant.skillLevel}</p>
                  {selectedApplicant.isPWD && (
                    <Badge className="bg-white/20 text-white mt-2">PWD Player</Badge>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <Trophy className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-purple-900">{selectedApplicant.totalPoints}</p>
                    <p className="text-xs text-purple-600">Points</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <Star className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-900">{selectedApplicant.gamesPlayed}</p>
                    <p className="text-xs text-blue-600">Games</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <Award className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-900">{selectedApplicant.badges.length}</p>
                    <p className="text-xs text-green-600">Badges</p>
                  </div>
                </div>

                {/* Badges */}
                {selectedApplicant.badges.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Badges & Achievements
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.badges.map((badge, idx) => (
                        <Badge key={idx} className="bg-purple-100 text-purple-700">{badge}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedApplicant.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <Button onClick={() => { handleApprove(selectedApplicant.id); setDrawerOpen(false); }}
                      className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl h-11">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button onClick={() => { handleReject(selectedApplicant.id); setDrawerOpen(false); }}
                      variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-11">
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
