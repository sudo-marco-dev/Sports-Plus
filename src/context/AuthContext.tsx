import { createContext, useState, useContext, ReactNode } from 'react';
import { mockCurrentUser, mockNotifications, mockUsers, User, Notification } from '../data/mockData';

/**
 * AuthContext - Manages user authentication, profile state, notifications, and game-related points
 */

interface AuthContextType {
  // State
  currentUser: User;
  notifications: Notification[];
  unreadCount: number;

  // Actions
  updateUser: (partial: Partial<User>) => void;
  addPoints: (amount: number) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markAllRead: () => void;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize current user from mock data
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);

  // Initialize notifications filtered to current user
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications.filter((n) => n.toUserId === currentUser.id)
  );

  // Computed: unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  /**
   * Merge partial user data into current user state
   */
  const updateUser = (partial: Partial<User>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  /**
   * Add points to current user and update their state
   */
  const addPoints = (amount: number) => {
    // Organizations are excluded from point-earning
    if (currentUser.role === 'organization') return;
    updateUser({
      totalPoints: currentUser.totalPoints + amount,
    });
  };

  /**
   * Add a new notification to the array (prepend)
   * Generate a unique ID if not provided
   */
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n${Date.now()}`,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  /**
   * Mark all notifications as read
   */
  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({
        ...notif,
        read: true,
      }))
    );
  };

  /**
   * Switch to a different user (useful for demo/testing different account types)
   */
  const login = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      // Filter and reset notifications to the new user
      setNotifications(mockNotifications.filter((n) => n.toUserId === userId));
    }
  };

  /**
   * Reset authentication state (logout)
   */
  const logout = () => {
    setCurrentUser(mockCurrentUser);
    setNotifications(mockNotifications.filter((n) => n.toUserId === mockCurrentUser.id));
  };

  const value: AuthContextType = {
    currentUser,
    notifications,
    unreadCount,
    updateUser,
    addPoints,
    addNotification,
    markAllRead,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use the AuthContext
 * Throws error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
