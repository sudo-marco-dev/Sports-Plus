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
  MapPin,
  Clock,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { OrgDashboard, mockLiveEvents } from './OrgDashboard';
import { EventCreationForm } from './EventCreationForm';

interface OrgPortalProps {
  onBack: () => void;
  orgName?: string;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

const eventStats = [
  { name: 'Basketball', value: 45 },
  { name: 'Volleyball', value: 25 },
  { name: 'Badminton', value: 20 },
  { name: 'Football', value: 10 },
];

export function OrgPortal({ onBack, orgName = 'Rico Tan Sports' }: OrgPortalProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'events' | 'settings' | 'create-event'>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 pb-32">
            {/* Welcome Section */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-500 text-sm">Welcome back, {orgName}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 relative">
                    <Bell className="size-5 text-gray-600" />
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </Button>
                  <Avatar className="h-10 w-10 border-2 border-purple-100">
                    <AvatarFallback className="bg-purple-600 text-white font-bold">RT</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button 
                  onClick={() => setActiveTab('create-event')}
                  className="h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 flex flex-col items-center justify-center gap-2 shadow-lg shadow-purple-200"
                >
                  <Plus className="size-6 text-white" />
                  <span className="font-semibold">Create Event</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-24 rounded-3xl border-2 border-purple-50 flex flex-col items-center justify-center gap-2 bg-white"
                >
                  <Users className="size-6 text-purple-600" />
                  <span className="font-semibold text-purple-700">Applicants</span>
                </Button>
              </div>
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
                        {i === 1 ? 'Metro Manila Cup' : 'Inclusive Open'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin className="size-3" /> QC Complex
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="size-3" /> 2:00 PM
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-purple-600">{i === 1 ? '18/24' : '12/16'}</p>
                      <p className="text-[9px] text-gray-400">Spots</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'events':
        return <OrgDashboard onBack={() => setActiveTab('home')} orgName={orgName} isEmbedded={true} onCreateEvent={() => setActiveTab('create-event')} />;

      case 'settings':
        return (
          <div className="space-y-6 pb-24 bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 pt-8 pb-12 px-6 rounded-b-[40px] text-white shadow-xl relative overflow-hidden">
              <h1 className="text-2xl font-bold">Org Settings</h1>
              <p className="text-purple-100 text-sm">Manage profile and team members</p>
            </div>
            
            <div className="px-6 space-y-4 -mt-6 relative z-10">
              <Card className="rounded-2xl border-none shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-gray-200">
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">RT</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{orgName}</h3>
                      <p className="text-xs text-gray-500">ricotansports@email.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">Edit</Button>
                </CardContent>
              </Card>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                {['Organization Details', 'Bank Accounts / Payouts', 'Team Members', 'Notification Preferences'].map((setting, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-700">{setting}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
              
              <Button onClick={onBack} variant="outline" className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl h-12 shadow-lg font-semibold mt-4 border-none">
                Sign Out Organization
              </Button>
            </div>
          </div>
        );
      case 'create-event':
        return null; // Handled as overlay
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col relative overflow-hidden">
      <ScrollArea className="flex-1">
        {renderContent()}
      </ScrollArea>

      {/* Full-Screen Explicit Create Event Overlay */}
      {activeTab === 'create-event' && (
        <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col">
          <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 pt-8 pb-12 px-6 rounded-b-[40px] text-white shadow-xl shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('home')}
                className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-xl text-white"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex-1">
                <h1 className="text-white text-2xl font-bold">Create Event</h1>
                <p className="text-purple-100 text-sm">Publish a new sports activity</p>
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
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-purple-600' : 'text-gray-400'}`}
            >
              <LayoutDashboard className={`size-6 ${activeTab === 'home' ? 'fill-purple-50' : ''}`} />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'events' ? 'text-purple-600' : 'text-gray-400'}`}
            >
              <Calendar className={`size-6 ${activeTab === 'events' ? 'fill-purple-50' : ''}`} />
              <span className="text-[10px] font-bold">Events</span>
            </button>


            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'settings' ? 'text-purple-600' : 'text-gray-400'}`}
            >
              <Settings className={`size-6 ${activeTab === 'settings' ? 'fill-purple-50' : ''}`} />
              <span className="text-[10px] font-bold">Settings</span>
            </button>
          </div>
          <div className="h-4 bg-white" /> {/* Safe area spacer */}
        </div>
      )}
    </div>
  );
}
