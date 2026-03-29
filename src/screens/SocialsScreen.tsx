import { useState } from 'react';
import { Heart, MessageCircle, MapPin, Edit, ArrowLeft } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { ShareGameModal } from '../components/ShareGameModal';

interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  sport: string;
  action: string;
  venue: string;
  score?: string;
  mvp?: string;
  points: number;
  caption?: string;
  photo?: string | null;
  likes: number;
  liked: boolean;
  comments: Array<{ user: string; text: string }>;
  timestamp: string;
  isCurrentUser: boolean;
}

const mockFeed: FeedPost[] = [
  {
    id: 'f1',
    userId: 'u6',
    userName: 'Rico Dela Cruz',
    userInitials: 'RD',
    sport: 'Basketball',
    action: 'just finished a game',
    venue: 'Taguig Sports Complex',
    score: 'Team A 21 - Team B 15',
    mvp: 'Marco Reyes',
    points: 100,
    caption: 'What a game! 🏀 We dominated the second half.',
    photo: null,
    likes: 14,
    liked: false,
    comments: [
      { user: 'Anika S.', text: 'GG!' },
      { user: 'James L.', text: 'MVP well deserved!' },
    ],
    timestamp: '2h ago',
    isCurrentUser: false,
  },
  {
    id: 'f2',
    userId: 'u1',
    userName: 'Marco Reyes',
    userInitials: 'MR',
    sport: 'Basketball',
    action: 'earned MVP',
    venue: 'Taguig Sports Complex',
    score: 'Team A 21 - Team B 15',
    mvp: 'Marco Reyes',
    points: 150,
    caption: null,
    photo: null,
    likes: 28,
    liked: true,
    comments: [],
    timestamp: '2h ago',
    isCurrentUser: true,
  },
  {
    id: 'f3',
    userId: 'u2',
    userName: 'Anika Santos',
    userInitials: 'AS',
    sport: 'Badminton',
    action: 'completed a match',
    venue: 'Pasig Badminton Center',
    score: '21-18, 21-15',
    mvp: null,
    points: 80,
    caption: 'Good match today despite the heat ☀️',
    photo: null,
    likes: 7,
    liked: false,
    comments: [],
    timestamp: '5h ago',
    isCurrentUser: false,
  },
  {
    id: 'f4',
    userId: 'u9',
    userName: 'Diego Lim',
    userInitials: 'DL',
    sport: 'Football',
    action: 'joined a team game',
    venue: 'Ateneo Oval',
    score: 'FC Pasig 3 - 1 QC United',
    mvp: 'Diego Lim',
    points: 90,
    caption: null,
    photo: null,
    likes: 19,
    liked: false,
    comments: [{ user: 'Marco R.', text: 'Bro that goal was insane!' }],
    timestamp: '1d ago',
    isCurrentUser: false,
  },
];

interface SocialsScreenProps {
  onBack?: () => void;
}

export function SocialsScreen({ onBack }: SocialsScreenProps) {
  const [feed, setFeed] = useState<FeedPost[]>(mockFeed);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedGameForShare, setSelectedGameForShare] = useState<any>(null);

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'Basketball':
        return 'bg-blue-100 text-blue-700';
      case 'Badminton':
        return 'bg-teal-100 text-teal-700';
      case 'Football':
        return 'bg-green-100 text-green-700';
      case 'Volleyball':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLike = (postId: string) => {
    setFeed(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  const handleSharePost = (shareData: any) => {
    const newPost: FeedPost = {
      id: `f${feed.length + 1}`,
      userId: 'u1',
      userName: 'You',
      userInitials: 'YO',
      sport: shareData.sport || 'Basketball',
      action: 'shared a game',
      venue: shareData.venue || 'Sports Complex',
      score: shareData.includeScore ? shareData.score : undefined,
      mvp: shareData.includeMvp ? shareData.mvp : undefined,
      points: shareData.includePoints ? shareData.points : 0,
      caption: shareData.caption || undefined,
      photo: null,
      likes: 0,
      liked: false,
      comments: [],
      timestamp: 'now',
      isCurrentUser: true,
    };

    setFeed(prev => [newPost, ...prev]);
    setShowShareModal(false);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-white text-2xl font-bold">Socials</h1>
            <p className="text-white/80 text-sm mt-1">Your sports community</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-white/90 text-sm bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg inline-flex">
          <MapPin className="w-4 h-4" />
          <span>Near Quezon City</span>
        </div>
      </div>

      {/* Feed */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          {feed.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
              {/* Top Row: Avatar, Name, Sport, Time */}
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xs font-bold">
                      {post.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{post.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={`text-xs ${getSportColor(post.sport)}`}>
                        {post.sport}
                      </Badge>
                      <span className="text-xs text-gray-500">{post.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Line */}
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{post.userName}</span> {post.action} at{' '}
                <span className="font-semibold">{post.venue}</span>
              </p>

              {/* Score Pill */}
              {post.score && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg px-3 py-2 text-center">
                  <span className="text-sm font-semibold text-gray-900">{post.score}</span>
                </div>
              )}

              {/* MVP Badge */}
              {post.mvp && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <span className="text-lg">👑</span>
                  <span className="text-sm font-semibold text-gray-900">MVP: {post.mvp}</span>
                </div>
              )}

              {/* Points Badge */}
              <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                +{post.points} pts
              </div>

              {/* Caption */}
              {post.caption && (
                <p className="text-sm text-gray-700 italic">{post.caption}</p>
              )}

              {/* Action Row: Likes, Comments */}
              <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-sm transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      post.liked ? 'fill-red-600 text-red-600' : 'text-gray-400 hover:text-red-600'
                    }`}
                  />
                  <span className="text-gray-600">{post.likes}</span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments === post.id && post.comments.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  {post.comments.map((comment, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                          {comment.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg px-3 py-2">
                          <p className="text-xs font-semibold text-gray-900">{comment.user}</p>
                          <p className="text-sm text-gray-700 mt-0.5">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setSelectedGameForShare(null);
          setShowShareModal(true);
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <Edit className="w-6 h-6" />
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <ShareGameModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleSharePost}
          gameData={selectedGameForShare}
        />
      )}
    </div>
  );
}
