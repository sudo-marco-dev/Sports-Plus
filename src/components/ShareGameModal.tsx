import { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface ShareGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (shareData: any) => void;
  gameData?: any;
}

export function ShareGameModal({
  isOpen,
  onClose,
  onShare,
  gameData,
}: ShareGameModalProps) {
  const [step, setStep] = useState(1);
  const [includeScore, setIncludeScore] = useState(false);
  const [includeMvp, setIncludeMvp] = useState(false);
  const [includePoints, setIncludePoints] = useState(false);
  const [includeVenue, setIncludeVenue] = useState(false);
  const [includeTeamStats, setIncludeTeamStats] = useState(false);
  const [caption, setCaption] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (
      !includeScore &&
      !includeMvp &&
      !includePoints &&
      !includeVenue &&
      !includeTeamStats
    ) {
      toast.error('Please select at least one item to share');
      return;
    }
    setStep(2);
  };

  const handleShare = () => {
    const shareData = {
      includeScore,
      includeMvp,
      includePoints,
      includeVenue,
      includeTeamStats,
      caption,
      photoAdded,
      sport: gameData?.sport || 'Basketball',
      score: gameData?.score || 'Team A 21 - Team B 15',
      mvp: gameData?.mvp || 'Player Name',
      points: gameData?.points || 100,
      venue: gameData?.venue || 'Sports Complex',
    };

    onShare(shareData);
    toast.success('Posted to your feed!');
    
    // Reset form
    setStep(1);
    setIncludeScore(false);
    setIncludeMvp(false);
    setIncludePoints(false);
    setIncludeVenue(false);
    setIncludeTeamStats(false);
    setCaption('');
    setPhotoAdded(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Share your game</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What do you want to share?</h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Checkbox
                    checked={includeScore}
                    onCheckedChange={setIncludeScore as any}
                  />
                  <span className="text-sm font-medium text-gray-700">Final Score</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Checkbox
                    checked={includeMvp}
                    onCheckedChange={setIncludeMvp as any}
                  />
                  <span className="text-sm font-medium text-gray-700">MVP</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Checkbox
                    checked={includePoints}
                    onCheckedChange={setIncludePoints as any}
                  />
                  <span className="text-sm font-medium text-gray-700">Points Earned</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Checkbox
                    checked={includeVenue}
                    onCheckedChange={setIncludeVenue as any}
                  />
                  <span className="text-sm font-medium text-gray-700">Venue & Date</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Checkbox
                    checked={includeTeamStats}
                    onCheckedChange={setIncludeTeamStats as any}
                  />
                  <span className="text-sm font-medium text-gray-700">Team Stats (W/L)</span>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Caption Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Add a caption
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full rounded-xl min-h-24 resize-none"
                />
              </div>

              {/* Photo Button */}
              <button
                onClick={() => setPhotoAdded(!photoAdded)}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2"
              >
                <Camera className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {photoAdded ? 'Photo Added ✓' : 'Add Photo'}
                </span>
              </button>

              {/* Preview */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  {includeScore && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">Score: </span>
                      <span className="text-gray-700">Team A 21 - Team B 15</span>
                    </div>
                  )}
                  {includeMvp && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">MVP: </span>
                      <span className="text-gray-700">Player Name</span>
                    </div>
                  )}
                  {includePoints && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">Points: </span>
                      <span className="text-gray-700">+100 pts</span>
                    </div>
                  )}
                  {includeVenue && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">Venue: </span>
                      <span className="text-gray-700">Sports Complex</span>
                    </div>
                  )}
                  {includeTeamStats && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">Record: </span>
                      <span className="text-gray-700">12W - 3L - 1D</span>
                    </div>
                  )}
                  {caption && (
                    <div className="text-sm italic text-gray-700 pt-2 border-t border-gray-200">
                      {caption}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-100">
          {step === 2 && (
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Back
            </Button>
          )}
          <Button
            onClick={step === 1 ? handleNext : handleShare}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl"
          >
            {step === 1 ? 'Next' : 'Share to Feed'}
          </Button>
        </div>
      </div>
    </div>
  );
}
