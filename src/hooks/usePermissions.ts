import { useAuth } from '../context/AuthContext';

/**
 * Permission flags derived from the current user's role.
 * Use this hook to gate features based on whether the user
 * is a player or an organization account.
 */
interface Permissions {
  /** Whether the user can join existing events/games as a participant */
  canJoinEvents: boolean;
  /** Whether the user can create/host events or games */
  canHostEvents: boolean;
  /** Whether the user is an organization account */
  isOrganization: boolean;
}

/**
 * usePermissions — role-based permission hook
 *
 * Organizations can host events but cannot join as participants
 * or earn points/appear on leaderboards.
 *
 * Players (including coaches) can both host and join events.
 */
export function usePermissions(): Permissions {
  const { currentUser } = useAuth();
  const isOrganization = currentUser.role === 'organization';

  return {
    canJoinEvents: !isOrganization,
    canHostEvents: true,
    isOrganization,
  };
}
