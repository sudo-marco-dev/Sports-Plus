import { Bell, Accessibility, Clock, Medal } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

/**
 * Compute relative time string from timestamp
 * e.g. "2 hours ago", "5 minutes ago"
 */
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const secondsAgo = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (secondsAgo < 60) {
    return 'now';
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(secondsAgo / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markAllRead } = useAuth();

  if (!isOpen) {
    return null;
  }

  // Sort notifications by timestamp descending (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pwd_joined':
        return <Accessibility className="w-4 h-4 text-purple-600" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'certificate':
        return <Medal className="w-4 h-4 text-yellow-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div
      className="absolute top-16 right-4 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 z-50 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {sortedNotifications.some((n) => !n.read) && (
          <Button
            onClick={() => {
              markAllRead();
            }}
            variant="ghost"
            size="sm"
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex gap-3 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                !notif.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{getRelativeTime(notif.timestamp)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
