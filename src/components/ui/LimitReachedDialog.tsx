import { Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';

interface LimitReachedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function LimitReachedDialog({ isOpen, onClose, onUpgrade }: LimitReachedDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[360px] mx-auto bg-white rounded-[2rem] p-6 md:p-8 flex flex-col items-center border-none shadow-2xl outline-none">
        <div className="flex flex-col items-center w-full">
          {/* Icon */}
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-[#10b981]">
            <Shield className="w-8 h-8" strokeWidth={2.5} />
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
            Tournament Limit Reached
          </h2>
          
          <p className="text-sm text-slate-500 text-center mb-8 px-2">
            Free accounts are limited to hosting 1 active tournament. Upgrade to Premium to host unlimited events and unlock advanced features.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <button
            onClick={() => {
              onUpgrade();
              onClose();
            }}
            style={{ backgroundColor: '#10b981', color: 'white' }}
            className="w-full !bg-[#10b981] hover:!bg-[#059669] !text-white font-bold py-4 rounded-full shadow-lg transition-colors text-lg"
          >
            Upgrade to Premium
          </button>
          
          <button
            onClick={onClose}
            className="mt-4 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors w-full text-center"
          >
            Maybe Later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
