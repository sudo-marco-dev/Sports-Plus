import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
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
import { OrgDashboard } from './OrgDashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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

const weeklyActivity = [
  { day: 'Mon', applications: 12 },
  { day: 'Tue', applications: 18 },
  { day: 'Wed', applications: 15 },
  { day: 'Thu', applications: 25 },
  { day: 'Fri', applications: 32 },
  { day: 'Sat', applications: 45 },
  { day: 'Sun', applications: 28 },
];

export function OrgPortal({ onBack, orgName = 'Rico Tan Sports' }: OrgPortalProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'events' | 'analytics' | 'settings'>('home');

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
                  onClick={() => setActiveTab('events')}
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

            {/* Performance Snapshot */}
            <div className="px-6">
              <Card className="rounded-3xl border-none shadow-xl shadow-gray-100 bg-white overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Performance</CardTitle>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-none">
                      +12% this week
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#9ca3af' }} 
                        />
                        <Tooltip 
                          cursor={{ fill: '#f9fafb' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="applications" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
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
        return <OrgDashboard onBack={() => setActiveTab('home')} orgName={orgName} isEmbedded={true} />;
      case 'analytics':
        return (
          <div className="p-6 space-y-6 pb-24 text-center py-20">
            <BarChart3 className="size-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold">Advanced Analytics</h2>
            <p className="text-gray-500">Coming soon for Premium Organizations</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 space-y-6 pb-24 text-center py-20">
            <Settings className="size-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold">Org Settings</h2>
            <p className="text-gray-500">Manage your organization profile and team members.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
      <ScrollArea className="flex-1">
        {renderContent()}
      </ScrollArea>

      {/* Organization Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
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
          
          <div className="relative -mt-10">
            <Button 
              onClick={() => { setActiveTab('events'); /* Logic to open creation tab could go here */ }}
              className="size-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-200 border-4 border-white flex items-center justify-center p-0"
            >
              <Plus className="size-8 text-white" />
            </Button>
          </div>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'analytics' ? 'text-purple-600' : 'text-gray-400'}`}
          >
            <BarChart3 className={`size-6 ${activeTab === 'analytics' ? 'fill-purple-50' : ''}`} />
            <span className="text-[10px] font-bold">Analytics</span>
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
    </div>
  );
}
