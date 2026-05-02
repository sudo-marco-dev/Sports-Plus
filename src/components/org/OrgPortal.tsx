import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Bell,
  Search,
  Plus,
  Users,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  MapPin,
  Clock,
  Activity,
  User,
  Mail,
  Shield,
  BellRing
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { OrgDashboard, mockLiveEvents } from './OrgDashboard';
import { EventCreationForm } from './EventCreationForm';

import { LimitReachedDialog } from '../ui/LimitReachedDialog';
import { useSubscriptionLimits } from '../../hooks/useSubscriptionLimits';

interface OrgPortalProps {
  onBack: () => void;
  orgName?: string;
  onUpgrade?: () => void;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

const eventStats = [
  { name: 'Basketball', value: 45 },
  { name: 'Volleyball', value: 25 },
  { name: 'Badminton', value: 20 },
  { name: 'Football', value: 10 },
];

export function OrgPortal({ onBack, orgName = 'Rico Tan Sports', onUpgrade }: OrgPortalProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'events' | 'settings' | 'create-event'>('home');
  const [settingsView, setSettingsView] = useState<'main' | 'details' | 'notifications'>('main');
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const { canCreate, count, limit } = useSubscriptionLimits();

  const handleCreateEventClick = () => {
    if (canCreate) {
      setActiveTab('create-event');
    } else {
      setShowLimitDialog(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 pb-32">
            {/* Welcome Section */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
                  <p className="text-gray-500 text-sm font-medium">Welcome back, {orgName}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 relative">
                    <Bell className="size-5 text-gray-600" />
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </Button>
                  <Avatar className="h-10 w-10 border-2 border-blue-100">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">RT</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Button
                  onClick={handleCreateEventClick}
                  className="h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  <Plus className="size-6 text-white" />
                  <span className="font-semibold">Create Event</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 rounded-3xl border-2 border-blue-50 flex flex-col items-center justify-center gap-2 bg-white"
                >
                  <Users className="size-6 text-blue-600" />
                  <span className="font-semibold text-blue-700">Applicants</span>
                </Button>
              </div>
              {limit && (
                <p className="text-xs font-medium text-amber-600 text-center mb-4">
                  Free Limit Reached ({count}/{limit})
                </p>
              )}
            </div>

            {/* Active Events Carousel-like List */}
            <div className="px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
                <button onClick={() => setActiveTab('events')} className="text-purple-600 text-sm font-bold flex items-center gap-1">
                  See All <ArrowRight className="size-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 border border-gray-50 shadow-sm flex items-center gap-4">
                    <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl">
                      {i === 1 ? '🏀' : '🏸'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {i === 1 ? 'Palawan Cup' : 'Inclusive Open'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin className="size-3" />  Ramon V. Mitra Sports Complex
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="size-3" /> 2:00 PM
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-blue-600">{i === 1 ? '18/24' : '12/16'}</p>
                      <p className="text-[9px] text-gray-400">Spots</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'events':
        return <OrgDashboard onBack={() => setActiveTab('home')} orgName={orgName} isEmbedded={true} onCreateEvent={handleCreateEventClick} onUpgrade={onUpgrade} />;

      case 'settings':
        if (settingsView === 'details') {
          return (
            <div className="space-y-6 pb-32 bg-gray-50 min-h-screen">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-12 pb-16 px-8 rounded-b-[3rem] text-white shadow-2xl shadow-blue-900/30 shrink-0 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSettingsView('main')}
                    className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-3xl font-black tracking-tight">Org Details</h1>
                </div>
              </div>

              <div className="px-6 space-y-4 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-500 ml-1">Organization Name</Label>
                    <div className="relative group">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                      <Input defaultValue={orgName} className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-500 ml-1">Official Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                      <Input defaultValue="ricotansports@email.com" className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-500 ml-1">Official Address</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                      <Input defaultValue="123 Sports Ave, Puerto Princesa City" className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all" />
                    </div>
                  </div>

                  <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-lg shadow-xl shadow-blue-200 mt-4">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          );
        }

        if (settingsView === 'notifications') {
          return (
            <div className="space-y-6 pb-32 bg-gray-50 min-h-screen">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-12 pb-16 px-8 rounded-b-[3rem] text-white shadow-2xl shadow-blue-900/30 shrink-0 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSettingsView('main')}
                    className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-3xl font-black tracking-tight">Preferences</h1>
                </div>
              </div>

              <div className="px-6 space-y-4 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
                  {[
                    { label: 'Push Notifications', icon: <BellRing className="w-5 h-5 text-blue-600" />, desc: 'Real-time updates on app' },
                    { label: 'Email Alerts', icon: <Mail className="w-5 h-5 text-green-600" />, desc: 'Weekly reports and summaries' },
                    { label: 'Applicant Updates', icon: <Users className="w-5 h-5 text-purple-600" />, desc: 'When new players apply' }
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gray-50">{pref.icon}</div>
                        <div>
                          <p className="font-bold text-gray-900">{pref.label}</p>
                          <p className="text-xs text-gray-500 font-medium">{pref.desc}</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={onBack}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl h-14 shadow-xl shadow-red-200 font-bold text-lg border-none mt-8"
                >
                  Sign Out Organization
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6 pb-32 bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-16 pb-20 px-8 rounded-b-[3rem] text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden">
              <h1 className="text-4xl font-black tracking-tighter">Org Settings</h1>
              <p className="text-blue-100 font-semibold tracking-tight">Manage profile and team members</p>
            </div>

            <div className="px-6 space-y-4 -mt-10 relative z-10">
              <Card className="rounded-[2rem] border-none shadow-xl shadow-gray-200/50">
                <CardContent className="p-6 flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-blue-50">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-black text-xl">RT</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{orgName}</h3>
                    <p className="text-xs text-gray-500 font-medium">ricotansports@email.com</p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                {['Organization Details', 'Notification Preferences'].map((setting, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSettingsView(idx === 0 ? 'details' : 'notifications')}
                    className="w-full flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all group"
                  >
                    <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{setting}</span>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'create-event':
        return null; // Handled as overlay
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col relative overflow-hidden">
      <ScrollArea className="flex-1">
        {renderContent()}
      </ScrollArea>

      {/* Full-Screen Explicit Create Event Overlay */}
      {activeTab === 'create-event' && (
        <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-16 pb-20 px-8 rounded-b-[3rem] text-white shadow-2xl shadow-blue-900/30 shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('home')}
                className="bg-white/10 hover:bg-white/20 transition-all p-3 rounded-2xl text-white border border-white/20 backdrop-blur-md shadow-lg"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex-1">
                <h1 className="text-white text-3xl font-black tracking-tight leading-none">Create Event</h1>
                <p className="text-blue-100 font-semibold tracking-tight mt-1">Publish a new sports activity</p>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 px-4 pt-6 -mt-8 z-10">
            <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100">
              <EventCreationForm onSubmit={() => {
                setActiveTab('events');
              }} />
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Organization Bottom Navigation */}
      {activeTab !== 'create-event' && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100 z-40">
          <div className="flex justify-around items-center h-20 px-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <LayoutDashboard className={`size-6 ${activeTab === 'home' ? 'fill-blue-50' : ''}`} />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'events' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Calendar className={`size-6 ${activeTab === 'events' ? 'fill-blue-50' : ''}`} />
              <span className="text-[10px] font-bold">Events</span>
            </button>


            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Settings className={`size-6 ${activeTab === 'settings' ? 'fill-blue-50' : ''}`} />
              <span className="text-[10px] font-bold">Settings</span>
            </button>
          </div>
          <div className="h-4 bg-white" /> {/* Safe area spacer */}
        </div>
      )}
      <LimitReachedDialog
        isOpen={showLimitDialog}
        onClose={() => setShowLimitDialog(false)}
        onUpgrade={onUpgrade || (() => { })}
      />
    </div>
  );
}
