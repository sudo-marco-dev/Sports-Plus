import { useState } from 'react';
import { MapPin, Calendar, Users, Trophy, Clock, Upload, X, AlertCircle, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { NotificationSystem } from './NotificationSystem';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface CreateGameScreenProps {
  onCreateGame: (gameData: any) => void;
  gamesCreatedToday?: number;
  gamesCreatedThisWeek?: number;
}

const sports = ['Basketball', 'Volleyball', 'Football', 'Badminton', 'Tennis', 'Swimming'];
const skillLevels = ['Casual', 'Novice', 'Elite'];

const puertoPrincesaBarangays = [
  'Brgy. San Pedro',
  'Brgy. Tiniguiban',
  'Brgy. Mandaragat',
  'Brgy. Bancao-Bancao',
  'Brgy. Macarascas',
  'Brgy. Bagong Bayan',
  'Brgy. Santa Lourdes',
  'Brgy. San Miguel',
  'Brgy. Mabuhay',
  'Brgy. Matahimik',
];

export function CreateGameScreen({ 
  onCreateGame, 
  gamesCreatedToday = 0,
  gamesCreatedThisWeek = 0
}: CreateGameScreenProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport: '',
    skillLevels: [] as string[],
    location: '',
    date: '',
    time: '',
    maxPlayers: '5',
  });
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [selectedPin, setSelectedPin] = useState({ x: 50, y: 50 });
  const [mapPins, setMapPins] = useState<Array<{ x: number; y: number; id: string }>>([]);

  const DAILY_LIMIT = 2;
  const WEEKLY_LIMIT = 10;

  const toggleSkillLevel = (level: string) => {
    setFormData(prev => ({
      ...prev,
      skillLevels: prev.skillLevels.includes(level)
        ? prev.skillLevels.filter(l => l !== level)
        : [...prev.skillLevels, level]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate skill levels selection
    if (formData.skillLevels.length === 0) {
      toast.error('Please select at least one skill level');
      return;
    }

    // Check daily and weekly limits
    if (gamesCreatedToday >= DAILY_LIMIT) {
      setShowLimitDialog(true);
      toast.error(`Daily limit reached! You can only create ${DAILY_LIMIT} games per day.`);
      return;
    }

    if (gamesCreatedThisWeek >= WEEKLY_LIMIT) {
      setShowLimitDialog(true);
      toast.error(`Weekly limit reached! You can only create ${WEEKLY_LIMIT} games per week.`);
      return;
    }

    // Request location permission before creating game
    setPendingFormData(formData);
    setShowLocationDialog(true);
  };

  const handleLocationPermission = (granted: boolean) => {
    setShowLocationDialog(false);
    if (granted && pendingFormData) {
      onCreateGame(pendingFormData);
    }
    setPendingFormData(null);
  };

  const getSkillLevelLabel = (selected: string[]) => {
    if (selected.length === 0) return 'Select skill levels';
    if (selected.length === 3) return 'All Levels';
    if (selected.length === 1) return selected[0];
    return `${selected.length} Levels`;
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl p-3">
              <Trophy className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-white text-2xl">Create Game</h1>
              <p className="text-white/80 text-sm">Organize a new match</p>
            </div>
          </div>
          <NotificationSystem unreadCount={3} />
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 -mt-6">
        {/* Game Creation Limits Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 mb-2">Game Creation Limits</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">Today: {gamesCreatedToday}/{DAILY_LIMIT}</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    gamesCreatedToday >= DAILY_LIMIT ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {gamesCreatedToday >= DAILY_LIMIT ? 'Limit Reached' : `${DAILY_LIMIT - gamesCreatedToday} left`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">This Week: {gamesCreatedThisWeek}/{WEEKLY_LIMIT}</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    gamesCreatedThisWeek >= WEEKLY_LIMIT ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {gamesCreatedThisWeek >= WEEKLY_LIMIT ? 'Limit Reached' : `${WEEKLY_LIMIT - gamesCreatedThisWeek} left`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">Game Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Morning Basketball"
                className="h-12 rounded-xl border-gray-200 bg-gray-50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your game, rules, what to bring, etc."
                className="min-h-[100px] rounded-xl border-gray-200 bg-gray-50 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Sport Type</Label>
              <Select value={formData.sport} onValueChange={(value) => setFormData({ ...formData, sport: value })}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center justify-between">
                <span>Skill Levels</span>
                <span className="text-xs font-normal text-gray-500">{formData.skillLevels.length} selected</span>
              </Label>
              <p className="text-xs text-gray-600 mb-3">Select one or more skill levels this game is for:</p>
              <div className="grid grid-cols-3 gap-2">
                {skillLevels.map((level) => {
                  const isSelected = formData.skillLevels.includes(level);
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleSkillLevel(level)}
                      className={`py-3 rounded-xl border-2 transition-all text-center font-semibold relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {level}
                      {isSelected && (
                        <Check className="w-4 h-4 absolute top-1 right-1 text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
              {formData.skillLevels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skillLevels.map((level) => (
                    <Badge key={level} className="bg-blue-100 text-blue-700 flex items-center gap-1">
                      {level}
                      <button
                        type="button"
                        onClick={() => toggleSkillLevel(level)}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Location</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Select barangay" />
                </SelectTrigger>
                <SelectContent>
                  {puertoPrincesaBarangays.map((barangay) => (
                    <SelectItem key={barangay} value={barangay}>
                      {barangay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.location && (
                <Button
                  type="button"
                  onClick={() => setShowMapDialog(true)}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Pin Exact Location on Map
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-gray-700">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers" className="text-gray-700">Max Players</Label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="maxPlayers"
                  type="number"
                  min="2"
                  max="20"
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
                  placeholder="5"
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Recommended: 5 for most sports</p>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formData.skillLevels.length === 0}
              >
                Create Game
              </Button>
              <p className="text-xs text-center text-gray-500">
                After game completion, you'll be able to rate players and earn rewards!
              </p>
            </div>
          </form>
        </div>
      </ScrollArea>

      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Game Creation Limit Reached</DialogTitle>
            <DialogDescription>
              You've reached your game creation limit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-900 mb-2">Daily Limit: {gamesCreatedToday}/2 games</p>
              <p className="text-sm text-orange-900">Weekly Limit: {gamesCreatedThisWeek}/10 games</p>
            </div>
            <p className="text-sm text-gray-600 text-center">
              These limits help prevent spam and ensure quality matches. Come back tomorrow to create more games!
            </p>
            <Button 
              onClick={() => setShowLimitDialog(false)}
              className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl"
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interactive Map Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Pin Game Location</DialogTitle>
            <DialogDescription>
              Click on the map to set the exact game location
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div 
              className="relative w-full h-80 bg-gray-200 rounded-2xl overflow-hidden cursor-crosshair border-2 border-blue-200 shadow-xl"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setSelectedPin({ x, y });
              }}
            >
              {/* Interactive Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50">
                {/* Grid pattern */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }} />
                
                {/* Decorative roads */}
                <div className="absolute top-0 left-1/3 w-12 h-full bg-gray-300 opacity-40 transform -skew-y-6" />
                <div className="absolute top-1/2 left-0 w-full h-10 bg-gray-300 opacity-40" />
                
                {/* Decorative areas (parks, buildings) */}
                <div className="absolute top-10 left-10 w-16 h-16 bg-green-400 opacity-30 rounded-full" />
                <div className="absolute bottom-20 right-16 w-20 h-20 bg-blue-400 opacity-20 rounded-lg" />
                <div className="absolute top-32 right-24 w-14 h-14 bg-orange-300 opacity-25 rounded" />
                
                {/* Mock nearby game pins */}
                {mapPins.map((pin) => (
                  <div
                    key={pin.id}
                    className="absolute w-6 h-6 -ml-3 -mt-6"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  >
                    <MapPin className="w-6 h-6 text-blue-500 fill-blue-100 opacity-60" />
                  </div>
                ))}
              </div>
              
              {/* Your location pin - larger and animated */}
              <div 
                className="absolute w-10 h-10 -ml-5 -mt-10 transition-all duration-300 z-10"
                style={{ 
                  left: `${selectedPin.x}%`, 
                  top: `${selectedPin.y}%`
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full opacity-30 animate-ping" />
                  <MapPin className="w-10 h-10 text-red-600 fill-red-200 drop-shadow-2xl filter animate-bounce" strokeWidth={2.5} />
                </div>
              </div>
              
              {/* Distance scale */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg border border-gray-200">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-12 h-0.5 bg-gray-900" />
                  <span className="text-gray-700">100m</span>
                </div>
              </div>
              
              {/* Compass */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200">
                <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-700 rotate-0">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">N</div>
                    <div className="w-6 h-6 border-2 border-blue-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-900">Selected Location</p>
                </div>
                <Badge className="bg-green-500 text-white">Pinned</Badge>
              </div>
              <p className="text-sm text-gray-700">
                📍 <span>{formData.location}</span>
              </p>
              <p className="text-xs text-gray-600">
                Coordinates: {selectedPin.x.toFixed(1)}%, {selectedPin.y.toFixed(1)}%
              </p>
            </div>

            <Button 
              onClick={() => {
                setShowMapDialog(false);
                // Add current pin to map pins if not already there
                const pinExists = mapPins.some(p => 
                  Math.abs(p.x - selectedPin.x) < 1 && Math.abs(p.y - selectedPin.y) < 1
                );
                if (!pinExists) {
                  setMapPins([...mapPins, { ...selectedPin, id: Date.now().toString() }]);
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl h-12"
            >
              Confirm Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Permission Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl" aria-describedby="location-permission-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location Permission
            </DialogTitle>
            <DialogDescription id="location-permission-description">
              SportsPlus needs access to your location to help players find your game and verify attendance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-sm text-blue-800">
                <strong>Why we need this:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Help players find your game location</li>
                <li>Verify game attendance accurately</li>
                <li>Show your game to nearby players</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleLocationPermission(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Not Now
              </Button>
              <Button
                onClick={() => handleLocationPermission(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl"
              >
                Allow Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}