import { Star, Award, CheckCircle2, X, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface PlayerReview {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

interface MiniProfileCardProps {
  user: {
    name: string;
    username: string;
    userId: string;
    rating: number;
    isVerified: boolean;
    gamesPlayed: number;
    reliabilityScore?: number;
    achievements?: string[];
  };
  onClose: () => void;
  onViewFullProfile?: () => void;
}

// Mock reviews data
const mockReviews: PlayerReview[] = [
  {
    id: '1',
    reviewer: 'Carlos Reyes',
    rating: 5,
    comment: 'Great teammate! Very skilled and communicates well on the court.',
    date: 'Dec 10, 2024',
  },
  {
    id: '2',
    reviewer: 'Maria Santos',
    rating: 4,
    comment: 'Good player, shows up on time and plays fair.',
    date: 'Dec 8, 2024',
  },
  {
    id: '3',
    reviewer: 'Juan dela Cruz',
    rating: 5,
    comment: 'Excellent sportsmanship and always reliable!',
    date: 'Dec 5, 2024',
  },
  {
    id: '4',
    reviewer: 'Ana Lopez',
    rating: 4,
    comment: 'Solid player, would definitely team up again.',
    date: 'Dec 3, 2024',
  },
];

export function MiniProfileCard({ user, onClose, onViewFullProfile }: MiniProfileCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="size-4 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-t-2xl p-6 text-center flex-shrink-0">
          <Avatar className="size-20 border-4 border-white shadow-xl mx-auto">
            <AvatarFallback className="bg-blue-200 text-blue-700 text-2xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center justify-center gap-2 mt-3">
            <h3 className="text-white">{user.name}</h3>
            {user.isVerified && (
              <CheckCircle2 className="size-5 text-white" />
            )}
            {typeof user.pwdStatus === 'string' && user.pwdStatus !== '' && user.pwdStatus !== 'None' && (
              <div className="flex items-center gap-1 ml-2">
                <Badge className="bg-red-100 text-red-700">PWD</Badge>
                <span className="text-xs text-white">{user.pwdStatus === 'Other' && typeof user.pwdOther === 'string' && user.pwdOther ? user.pwdOther : user.pwdStatus}</span>
              </div>
            )}
          </div>
          <p className="text-white/80 text-sm mt-1">@{user.username}</p>
          <p className="text-white/60 text-xs mt-0.5">ID: {user.userId}</p>
          
          <div className="flex items-center justify-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mt-3 w-fit mx-auto">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white">{user.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-xl text-blue-900">{user.gamesPlayed}</p>
                <p className="text-xs text-blue-700 mt-1">Games Played</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-xl text-green-900">{user.reliabilityScore || 95}%</p>
                <p className="text-xs text-green-700 mt-1">Reliability</p>
              </div>
            </div>

            {/* Achievements */}
            {user.achievements && user.achievements.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="size-4 text-gray-600" />
                  <p className="text-sm text-gray-900">Recent Achievements</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {user.achievements.slice(0, 4).map((achievement, idx) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-700 text-xs">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Player Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="size-4 text-gray-600" />
                <p className="text-sm text-gray-900">Player Reviews</p>
                <Badge variant="outline" className="text-xs ml-auto">{mockReviews.length} reviews</Badge>
              </div>
              <div className="space-y-3">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{review.reviewer}</p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            {onViewFullProfile && (
              <Button
                onClick={onViewFullProfile}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl"
              >
                View Full Profile
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}