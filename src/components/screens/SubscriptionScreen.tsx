import { Check, Star, Zap, Shield, Crown, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { toast } from 'sonner';
import { ProBadge } from '../ui/ProBadge';

interface SubscriptionScreenProps {
  onSelectTier: (tier: 'FREE' | 'PREMIUM') => void;
}

export function SubscriptionScreen({ onSelectTier }: SubscriptionScreenProps) {
  const handleSelect = (tier: 'FREE' | 'PREMIUM') => {
    if (tier === 'PREMIUM') {
      toast.success('Welcome to SportsPlus Premium!', {
        description: 'Subscription activated successfully.',
      });
    } else {
      toast.info('Continuing with Free plan', {
        description: 'You can upgrade anytime from your profile.',
      });
    }
    onSelectTier(tier);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center overflow-y-auto">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-16 pb-24 px-6 rounded-b-[3rem] shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl -ml-24 -mb-24" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center size-20 rounded-[2rem] bg-white/20 backdrop-blur-md mb-6 shadow-xl border border-white/30">
            <Trophy className="size-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Elevate Your Game</h1>
          <p className="text-blue-50/80 font-medium text-white max-w-[280px]">Choose the plan that fits your athletic journey.</p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 -mt-16 flex flex-col items-center pb-12">
        {/* Premium Card */}
        <Card className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 relative z-10 -mt-6 w-full border-none overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <ProBadge size="md" />
          </div>

          <div className="pt-6 pb-8">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Premium</h2>
            <div className="text-[#10b981] font-bold flex items-center gap-2 uppercase tracking-[0.15em] text-[10px]">
              <Zap className="size-4 fill-current" />
              The Ultimate Experience
            </div>
          </div>

          <div className="space-y-6 mb-10 w-full max-w-[280px] mx-auto">
            {[
              { icon: <Trophy className="size-5 text-[#10b981]" />, text: "Unlimited Tournaments", desc: "Join and host as many as you want" },
              { icon: <Star className="size-5 text-indigo-500" />, text: "Exclusive Pro Badge", desc: "Stand out in the community" },
              { icon: <Shield className="size-5 text-cyan-500" />, text: "Advanced Analytics", desc: "Deep dive into your performance" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-bold text-base leading-tight">{item.text}</p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => handleSelect('PREMIUM')}
            style={{ backgroundColor: '#10b981', color: 'white' }}
            className="w-full hover:bg-[#059669] font-bold py-4 rounded-full shadow-lg text-lg mt-6 transition-colors h-16 border-none"
          >
            Start Premium
          </Button>

        </Card>

        {/* Free Plan Path */}
        <button
          onClick={() => handleSelect('FREE')}
          className="block w-full text-center mt-6 py-3 text-base font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Continue with Free
        </button>

        <p className="mt-10 text-slate-400 text-[10px] text-center font-medium leading-relaxed max-w-[280px] opacity-70">
          By continuing, you agree to SportsPlus Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
