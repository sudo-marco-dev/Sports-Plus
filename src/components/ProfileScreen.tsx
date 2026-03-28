import { Settings, CheckCircle2, Trophy, Award, Upload, Star, Camera, History, Edit2, X, Info, AlertCircle, HeartPulse } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { NotificationSystem } from './NotificationSystem';

interface ProfileScreenProps {
  onSettings: () => void;
  onViewAchievements: () => void;
  onViewHistory?: () => void;
  onVerify?: () => void;
  userData?: {
    name: string;
    username: string;
    userId: string;
    isVerified: boolean;
    reliabilityScore: number;
    points: number;
    rating: number;
    gamesPlayed: number;
    teamName: string | null;
    skillLevel?: 'Casual' | 'Novice' | 'Elite';
  };
}

const badges = [
  { id: 1, name: 'First Game', icon: '🏆', earned: true },
  { id: 2, name: '10 Games', icon: '⭐', earned: true },
  { id: 3, name: 'Team Player', icon: '🤝', earned: true },
  { id: 4, name: '50 Games', icon: '🔥', earned: false },
];

const skillLevelOptions: ('Casual' | 'Novice' | 'Elite')[] = ['Casual', 'Novice', 'Elite'];

// Reliability score tiers and their game limits
const reliabilityTiers = [
  { 
    range: '95-100%', 
    score: 95, 
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    playLimit: 10,
    createLimit: 5,
    title: 'Excellent',
    description: 'Maximum game access',
  },
  { 
    range: '85-94%', 
    score: 85, 
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    playLimit: 8,
    createLimit: 4,
    title: 'Great',
    description: 'High game access',
  },
  { 
    range: '70-84%', 
    score: 70, 
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-700',
    playLimit: 5,
    createLimit: 3,
    title: 'Good',
    description: 'Moderate game access',
  },
  { 
    range: '50-69%', 
    score: 50, 
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    playLimit: 3,
    createLimit: 2,
    title: 'Fair',
    description: 'Limited game access',
  },
  { 
    range: '0-49%', 
    score: 0, 
    color: 'from-red-500 to-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    playLimit: 1,
    createLimit: 1,
    title: 'Low',
    description: 'Very limited access',
  },
];

const getReliabilityTier = (score: number) => {
  for (const tier of reliabilityTiers) {
    if (score >= tier.score) {
      return tier;
    }
  }
  return reliabilityTiers[reliabilityTiers.length - 1];
};

export function ProfileScreen({ onSettings, onViewAchievements, onViewHistory, onVerify, userData }: ProfileScreenProps) {
  // Health info state
  const [showHealthDialog, setShowHealthDialog] = useState(false);
  const [healthInfo, setHealthInfo] = useState({
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalConditions: '',
    injuryHistory: '',
    currentMedication: '',
    pwdStatus: '',
    pwdOther: '',
    healthNotes: '',
  });
  const [healthErrors, setHealthErrors] = useState<{ emergencyContact?: string }>({});

  const handleHealthChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setHealthInfo({ ...healthInfo, [e.target.name]: e.target.value });
  };

  const handleSaveHealth = () => {
    let errors: { emergencyContactName?: string; emergencyContactPhone?: string } = {};
    if (!healthInfo.emergencyContactName.trim()) {
      errors.emergencyContactName = 'Emergency contact name is required.';
    }
    if (!healthInfo.emergencyContactPhone.trim()) {
      errors.emergencyContactPhone = 'Emergency contact phone is required.';
    } else if (!/^\+?\d{7,15}$/.test(healthInfo.emergencyContactPhone.trim())) {
      errors.emergencyContactPhone = 'Enter a valid phone number.';
    }
    setHealthErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowHealthDialog(false);
    toast.success('Health info updated!');
  };
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
  const [showEditSkillDialog, setShowEditSkillDialog] = useState(false);
  const [showReliabilityInfoDialog, setShowReliabilityInfoDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userSkillLevel, setUserSkillLevel] = useState<'Casual' | 'Novice' | 'Elite'>(userData?.skillLevel || 'Novice');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<'Casual' | 'Novice' | 'Elite'>(userSkillLevel);
  
  const defaultUserData = {
    name: 'John Doe',
    username: 'johndoe',
    userId: 'SP2025-4521',
    isVerified: true,
    reliabilityScore: 92,
    points: 1250,
    rating: 4.7,
    gamesPlayed: 24,
    teamName: 'Thunder Squad',
    skillLevel: 'Novice' as const,
  };

  const user = userData || defaultUserData;
  const currentTier = getReliabilityTier(user.reliabilityScore);

  const handleUploadProfilePicture = () => {
    toast.success('Profile picture uploaded!');
    setShowProfilePictureDialog(false);
  };

  const handleVerifyAccount = () => {
    onVerify?.();
    setShowVerificationDialog(false);
  };

  const handleSaveSkillLevel = () => {
    setUserSkillLevel(selectedSkillLevel);
    toast.success(`Skill level updated to ${selectedSkillLevel}!`);
    setShowEditSkillDialog(false);
  };

  const getSkillBadgeColor = (skill: string) => {
    switch (skill) {
      case 'Casual':
        return 'bg-blue-100 text-blue-700';
      case 'Novice':
        return 'bg-purple-100 text-purple-700';
      case 'Elite':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSkillDescription = (skill: string) => {
    switch (skill) {
      case 'Casual':
        return 'Beginner level - New to the sport';
      case 'Novice':
        return 'Intermediate level - Some experience';
      case 'Elite':
        return 'Advanced level - Expert player';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-[2rem] relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl">Profile</h1>
          <div className="flex gap-2">
            <NotificationSystem unreadCount={3} />
            <button onClick={onSettings} className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
              <AvatarImage src={profilePicture || ""} alt="User" />
              <AvatarFallback className="bg-blue-200 text-blue-700 text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setShowProfilePictureDialog(true)}
              className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 border-2 border-white hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-white text-xl">{user.name}</h2>
            {user.isVerified && (
              <CheckCircle2 className="w-5 h-5 text-white" />
            )}
          </div>
          {!user.isVerified && (
            <p className="text-white/60 text-sm mt-0.5">Unverified Player</p>
          )}
          <p className="text-white/70 text-sm mt-1">@{user.username}</p>
          <p className="text-white/60 text-xs mt-0.5">ID: {user.userId}</p>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg mt-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-xs">{user.rating}</span>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {/* PWD Badge Indicator - moved to header */}
        {healthInfo.pwdStatus && healthInfo.pwdStatus !== 'None' && (
          <div className="flex items-center gap-2 justify-center mt-2 mb-2">
            <Badge className="bg-red-100 text-red-700">PWD</Badge>
            <span className="text-xs text-gray-700">{healthInfo.pwdStatus === 'Other' ? healthInfo.pwdOther : healthInfo.pwdStatus}</span>
          </div>
        )}
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 mb-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-900 flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-red-500" />
                      Health & Safety
                    </h3>
                    <button
                      onClick={() => setShowHealthDialog(true)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergency Contact Name</span>
                      <span className="text-gray-900">{healthInfo.emergencyContactName || <span className="text-gray-400">Not set</span>}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergency Contact Phone</span>
                      <span className="text-gray-900">{healthInfo.emergencyContactPhone || <span className="text-gray-400">Not set</span>}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medical Conditions</span>
                      <span className="text-gray-900">{healthInfo.medicalConditions || <span className="text-gray-400">None</span>}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Injury History</span>
                      <span className="text-gray-900">{healthInfo.injuryHistory || <span className="text-gray-400">None</span>}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Medication</span>
                      <span className="text-gray-900">{healthInfo.currentMedication || <span className="text-gray-400">None</span>}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PWD Status</span>
                      <span className="text-gray-900">{healthInfo.pwdStatus || <span className="text-gray-400">None</span>}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Notes</span>
                      <span className="text-gray-900">{healthInfo.healthNotes || <span className="text-gray-400">None</span>}</span>
                    </div>
                  </div>
                </div>
              {/* Health Update Dialog */}
              <Dialog open={showHealthDialog} onOpenChange={setShowHealthDialog}>
                <DialogContent className="max-w-[90%] rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Health & Safety Information</DialogTitle>
                    <DialogDescription>
                      Please provide your health information. Emergency contact is required for event participation. All other fields are optional and private.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4 pt-4" onSubmit={e => { e.preventDefault(); handleSaveHealth(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={healthInfo.emergencyContactName}
                          onChange={handleHealthChange}
                          className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Full Name"
                          required
                        />
                        {healthErrors.emergencyContactName && (
                          <p className="text-xs text-red-500 mt-1">{healthErrors.emergencyContactName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={healthInfo.emergencyContactPhone}
                          onChange={handleHealthChange}
                          className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. +639123456789"
                          required
                        />
                        {healthErrors.emergencyContactPhone && (
                          <p className="text-xs text-red-500 mt-1">{healthErrors.emergencyContactPhone}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                      <input
                        type="text"
                        name="medicalConditions"
                        value={healthInfo.medicalConditions}
                        onChange={handleHealthChange}
                        className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Asthma, Diabetes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Injury History</label>
                      <input
                        type="text"
                        name="injuryHistory"
                        value={healthInfo.injuryHistory}
                        onChange={handleHealthChange}
                        className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Sprained ankle"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Medication</label>
                      <input
                        type="text"
                        name="currentMedication"
                        value={healthInfo.currentMedication}
                        onChange={handleHealthChange}
                        className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Ibuprofen"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PWD Status</label>
                      <select
                        name="pwdStatus"
                        value={healthInfo.pwdStatus}
                        onChange={handleHealthChange}
                        className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select classification</option>
                        <option value="None">None</option>
                        <option value="Psychosocial Disability">Psychosocial Disability</option>
                        <option value="Visual Disability">Visual Disability</option>
                        <option value="Physical Disability">Physical Disability</option>
                        <option value="Speech and Language Impairment">Speech and Language Impairment</option>
                        <option value="Other">Other</option>
                      </select>
                      {healthInfo.pwdStatus === 'Other' && (
                        <input
                          type="text"
                          name="pwdOther"
                          value={healthInfo.pwdOther}
                          onChange={handleHealthChange}
                          className="w-full mt-2 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Please specify your PWD status"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Health Notes</label>
                      <textarea
                        name="healthNotes"
                        value={healthInfo.healthNotes}
                        onChange={handleHealthChange}
                        className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any other info"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        onClick={() => setShowHealthDialog(false)}
                        variant="outline"
                        className="flex-1 rounded-2xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
        <button 
          onClick={() => setShowReliabilityInfoDialog(true)}
          className="w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 hover:shadow-2xl transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Reliability Score</p>
              <Info className="w-4 h-4 text-blue-500" />
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-2xl text-gray-900">{user.reliabilityScore}%</p>
            <Badge className={`${currentTier.bgColor} ${currentTier.textColor} mb-1`}>
              {currentTier.title}
            </Badge>
          </div>
          <Progress value={user.reliabilityScore} className="h-2 mb-2" />
          <p className="text-xs text-gray-500">
            {user.reliabilityScore >= 90 ? 'Excellent reliability! Keep it up.' : 
             user.reliabilityScore >= 70 ? 'Good reliability. Show up to more games to improve.' :
             'Low reliability. Attend games to improve your score.'}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Daily Play Limit</span>
              <span className="font-semibold text-gray-900">{currentTier.playLimit} games/day</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-600">Daily Create Limit</span>
              <span className="font-semibold text-gray-900">{currentTier.createLimit} games/day</span>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={onViewAchievements}
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-3 text-center hover:shadow-xl transition-shadow"
          >
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-lg text-gray-900">{user.points}</p>
            <p className="text-xs text-gray-600">Points</p>
          </button>
          <button 
            onClick={onViewHistory}
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-3 text-center hover:shadow-xl transition-shadow"
          >
            <div className="text-2xl mb-1">⚽</div>
            <p className="text-lg text-gray-900">{user.gamesPlayed}</p>
            <p className="text-xs text-gray-600">Games</p>
          </button>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-3 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-lg text-gray-900 truncate">{user.teamName || 'None'}</p>
            <p className="text-xs text-gray-600">Team</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Skill Level</h3>
            <div className="flex items-center gap-2">
              <Badge className={`${getSkillBadgeColor(userSkillLevel)}`}>
                {userSkillLevel}
              </Badge>
              <button
                onClick={() => {
                  setSelectedSkillLevel(userSkillLevel);
                  setShowEditSkillDialog(true);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">{getSkillDescription(userSkillLevel)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">More Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Favorite Sports</span>
              <span className="text-gray-900">Basketball, Tennis</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Team</span>
              <span className="text-gray-900">{user.teamName || 'No team yet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span className="text-gray-900">San Francisco, CA</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onViewAchievements}
          className="w-full bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Badges & Achievements
            </h3>
            <span className="text-xs text-blue-600">View All →</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-2 rounded-xl text-center border-2 ${
                  badge.earned
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 opacity-40'
                }`}
              >
                <div className="text-2xl mb-0.5">{badge.icon}</div>
                <p className="text-xs text-gray-700 leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </button>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
          <h3 className="text-gray-900 mb-3">Points System</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
              <span className="text-gray-700">Game Completed</span>
              <span className="text-green-600">+50 pts</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
              <span className="text-gray-700">Game Won</span>
              <span className="text-green-600">+75 pts</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
              <span className="text-gray-700">Host Successful Game</span>
              <span className="text-green-600">+100 pts</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded-xl">
              <span className="text-gray-700">Achievement Unlocked</span>
              <span className="text-blue-600">+25-500 pts</span>
            </div>
          </div>
        </div>

        {!user.isVerified && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Upload className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-blue-900 mb-1">Get Verified</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Upload your ID to unlock game creation and earn trust badge
                </p>
                <Button 
                  onClick={() => setShowVerificationDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Verify Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reliability Score Info Dialog */}
      <Dialog open={showReliabilityInfoDialog} onOpenChange={setShowReliabilityInfoDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Reliability Score
            </DialogTitle>
            <DialogDescription>
              Your reliability score affects how many games you can play and create daily
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {/* Current Score */}
            <div className={`p-4 rounded-2xl border-2 ${currentTier.borderColor} ${currentTier.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs ${currentTier.textColor} font-semibold">Your Current Score</p>
                  <p className="text-3xl font-bold ${currentTier.textColor}">{user.reliabilityScore}%</p>
                </div>
                <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${currentTier.color}`}>
                  <p className="text-white font-bold">{currentTier.title}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t ${currentTier.borderColor}">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm ${currentTier.textColor} font-semibold">Daily Play Limit:</span>
                  <span className="text-lg font-bold ${currentTier.textColor}">{currentTier.playLimit} games</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm ${currentTier.textColor} font-semibold">Daily Create Limit:</span>
                  <span className="text-lg font-bold ${currentTier.textColor}">{currentTier.createLimit} games</span>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-900 font-semibold mb-2">How It Works</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Show up to games on time to increase your score</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Missing games or leaving early decreases your score</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Higher scores unlock more games per day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Maintain 70%+ for best experience</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* All Tiers */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-3">Reliability Tiers</h4>
              <div className="space-y-3">
                {reliabilityTiers.map((tier, index) => {
                  const isCurrentTier = user.reliabilityScore >= tier.score && 
                    (index === 0 || user.reliabilityScore < reliabilityTiers[index - 1].score);
                  
                  return (
                    <div
                      key={tier.range}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        isCurrentTier 
                          ? `${tier.borderColor} ${tier.bgColor} shadow-md` 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-bold ${isCurrentTier ? tier.textColor : 'text-gray-700'}`}>
                              {tier.title}
                            </p>
                            {isCurrentTier && (
                              <Badge className="bg-blue-600 text-white text-xs">Current</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{tier.range}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${tier.color}`}>
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">🎮 Play Daily:</span>
                          <span className={`font-semibold ${isCurrentTier ? tier.textColor : 'text-gray-700'}`}>
                            {tier.playLimit} games
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">🎯 Create Daily:</span>
                          <span className={`font-semibold ${isCurrentTier ? tier.textColor : 'text-gray-700'}`}>
                            {tier.createLimit} games
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => setShowReliabilityInfoDialog(false)}
              className="w-full rounded-2xl py-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Level Dialog */}
      <Dialog open={showEditSkillDialog} onOpenChange={setShowEditSkillDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Skill Level</DialogTitle>
            <DialogDescription>
              Choose your current skill level in sports
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              {skillLevelOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkillLevel(skill)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${
                    selectedSkillLevel === skill
                      ? `${getSkillBadgeColor(skill)} border-current shadow-md`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold">{skill}</p>
                      <p className="text-sm text-gray-600">{getSkillDescription(skill)}</p>
                    </div>
                    {selectedSkillLevel === skill && (
                      <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowEditSkillDialog(false)}
                variant="outline"
                className="flex-1 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSkillLevel}
                className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>ID Verification</DialogTitle>
            <DialogDescription>
              Upload a valid government-issued ID to get verified and unlock game creation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-gray-600">Upload a valid government-issued ID with your name and photo to get verified. This helps keep our community safe.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Button 
                onClick={handleVerifyAccount}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Choose File
              </Button>
            </div>
            <p className="text-xs text-gray-500">Accepted: Driver's License, Passport, National ID with name and photo</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfilePictureDialog} onOpenChange={setShowProfilePictureDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
            <DialogDescription>
              Choose a profile picture to personalize your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-gray-600">Choose a profile picture to personalize your account.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Button 
                onClick={handleUploadProfilePicture}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Choose Photo
              </Button>
            </div>
            <p className="text-xs text-gray-500">Accepted: JPG, PNG (Max 5MB)</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}