import { Trophy, ShieldCheck, Search, ChevronRight, UserPlus, LogIn, LineChart, PlayCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { MobileContainer } from './MobileContainer';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onScoutMode: () => void;
}

export function LandingPage({ onGetStarted, onSignIn, onScoutMode }: LandingPageProps) {

  const features = [
    {
      title: "Game Discovery",
      description: "Find and join local sports matches with ease. See exactly where they are on an interactive map.",
      icon: <Search className="w-8 h-8 text-blue-100" />,
      gradient: "from-blue-600 to-cyan-500"
    },
    {
      title: "Organization Tools",
      description: "Powerful tools for local entities to host events, manage teams, and handle tournaments.",
      icon: <ShieldCheck className="w-8 h-8 text-purple-100" />,
      gradient: "from-purple-600 to-pink-500"
    },
    {
      title: "Gamification",
      description: "Earn points, badges, and work your way up the leaderboards by being an active player.",
      icon: <Trophy className="w-8 h-8 text-yellow-100" />,
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <MobileContainer className="bg-slate-50 overflow-y-auto pb-8">
      {/* Hero Section */}
      <div className="relative pt-16 pb-14 px-6 flex flex-col items-center text-center bg-gradient-to-br from-blue-800 via-blue-700 to-teal-600 rounded-b-[40px] shadow-2xl overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/topography.png')] pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/20 rounded-b-[40px]"></div>
        
        <div className="relative z-10 w-full max-w-sm">
          <div className="w-22 h-22 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl transform transition-transform hover:rotate-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            SportsPlus
          </h1>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed font-medium drop-shadow-sm">
            Your community platform for finding, joining, and hosting local sports games.
          </p>
          
          <div className="space-y-4 w-full px-4">
            <button
              onClick={onGetStarted}
              className="w-full bg-white text-blue-800 font-bold text-lg py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-6 h-6" />
              Get Started
            </button>
            
            <button
              onClick={onSignIn}
              className="w-full bg-white/10 text-white border-2 border-white/40 font-bold text-lg py-4 rounded-2xl backdrop-blur-xl transition-all flex items-center justify-center gap-3 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-6 h-6" />
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Scout Mode Prompt */}
      <div className="mt-8 px-4 w-full max-w-sm mx-auto">
        <button 
          onClick={onScoutMode}
          className="w-full group bg-gradient-to-r from-emerald-500 to-teal-500 p-[2px] rounded-2xl shadow-lg transition-transform hover:scale-[1.02]"
        >
          <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
            <LineChart className="w-8 h-8 text-teal-600" />
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-teal-700 transition-colors">Scout Mode</h3>
              <p className="text-sm text-gray-500 mt-1">View live leaderboards & local top players</p>
            </div>
            <div className="mt-1 text-teal-600 text-sm font-bold flex items-center gap-1">
              Enter Scout Mode
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>

      {/* Features Showcase */}
      <div className="mt-8 px-4 w-full max-w-sm mx-auto flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Platform Features</h2>
        
        {features.map((feature, idx) => (
          <Card key={idx} className={`border-none rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${feature.gradient} transform transition-transform hover:scale-[1.02]`}>
            <CardContent className="p-5 flex items-start gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md shadow-inner">
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MobileContainer>
  );
}
