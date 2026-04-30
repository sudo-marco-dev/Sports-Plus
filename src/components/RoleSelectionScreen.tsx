import React from 'react';
import { User, Building2, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { MobileContainer } from './MobileContainer';

export type UserRole = 'player' | 'organization';

interface RoleSelectionScreenProps {
  onSelect: (role: UserRole) => void;
  onBack: () => void;
}

export function RoleSelectionScreen({ onSelect, onBack }: RoleSelectionScreenProps) {
  const roles = [
    {
      id: 'player' as UserRole,
      title: 'Player',
      description: 'Find games and climb the leaderboard.',
      icon: <User className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'organization' as UserRole,
      title: 'Organization',
      description: 'Host events and manage applicants.',
      icon: <Building2 className="w-8 h-8" />,
      color: 'from-purple-500 to-fuchsia-600',
    },
  ];

  return (
    <MobileContainer className="bg-gray-50">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header - Dynamic Gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-12 pb-16 px-10 rounded-b-[3rem] relative">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-white rounded-2xl p-2.5 shadow-lg shadow-blue-900/20">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">Choose Your Role</h1>
            <p className="text-white/80 font-medium">Select how you'll use SportsPlus</p>
          </div>
        </div>

        {/* Roles Grid - Card Section */}
        <div className="flex-1 px-6 -mt-8 flex flex-col justify-center gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className="w-full group text-left p-6 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  {role.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{role.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mt-1 font-medium">{role.description}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
        </div>

        <div className="py-8 text-center px-8">
          <p className="text-gray-400 text-xs leading-relaxed font-medium italic">
            By selecting a role, you agree to our Terms of Service and Privacy Policy. Roles can be adjusted later in account settings.
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}
