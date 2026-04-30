import React from 'react';
import { User, Building2, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { MobileContainer } from './MobileContainer';

export type UserRole = 'player' | 'organization' | 'coach';

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
    {
      id: 'coach' as UserRole,
      title: 'Coach/Scout',
      description: 'View public analytics and rankings or manage a team.',
      icon: <ShieldCheck className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <MobileContainer className="bg-slate-50">
      <div className="flex flex-col h-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">Choose Your Role</h1>
            <p className="text-slate-500 text-sm">Select how you'll use SportsPlus</p>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="flex-1 space-y-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className="w-full group text-left p-5 rounded-3xl bg-white border-2 border-transparent hover:border-purple-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  {role.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{role.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mt-1">{role.description}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center px-4">
          <p className="text-slate-400 text-xs leading-relaxed">
            By selecting a role, you agree to our Terms of Service and Privacy Policy. Roles can be adjusted later in account settings.
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}
