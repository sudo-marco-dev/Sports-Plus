import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { AlertCircle } from 'lucide-react';

interface WaiverModalProps {
  onAccept: () => void;
  onCancel: () => void;
  isOpen: boolean;
  gameName?: string;
}

export function WaiverModal({ onAccept, onCancel, isOpen, gameName = 'this game' }: WaiverModalProps) {
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl min-h-[500px] max-w-md w-full p-6 flex flex-col overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Sports Activity Waiver</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {/* Waiver Body Text */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-gray-800 leading-relaxed">
              By joining <strong>{gameName}</strong>, I acknowledge that sports activities carry inherent physical risks including injury. I voluntarily assume all risks and release Sports Plus, game hosts, and other participants from liability. I confirm I am in adequate physical condition to participate.
            </p>
          </div>

          {/* Additional Information */}
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              <strong>Key Points:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>You assume full responsibility for any injuries</li>
              <li>You waive your right to sue Sports Plus or participants</li>
              <li>You confirm fitness to participate in this sport</li>
              <li>You will follow all safety guidelines provided</li>
            </ul>
          </div>
        </div>

        {/* Checkbox */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="waiver-agree"
              checked={waiverAccepted}
              onCheckedChange={(checked) => setWaiverAccepted(checked as boolean)}
              className="mt-1 h-5 w-5"
            />
            <label htmlFor="waiver-agree" className="text-sm text-gray-700 leading-relaxed cursor-pointer flex-1">
              I have read and agree to this waiver
            </label>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 text-center mb-4 bg-gray-50 rounded-lg p-2">
          <p>Acceptance logged: {currentDateTime}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <Button
            onClick={onAccept}
            disabled={!waiverAccepted}
            className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept & Join Game
          </Button>
          <button
            onClick={onCancel}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
