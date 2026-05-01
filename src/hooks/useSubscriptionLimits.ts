import { useAuth } from '../context/AuthContext';
import { mockTournaments } from '../data/mockData';

const MAX_FREE_TOURNAMENTS = 1;

export function useSubscriptionLimits() {
  const { currentUser } = useAuth();

  // Premium users have no limits
  if (currentUser.subscriptionTier === 'PREMIUM') {
    return { 
      canCreate: true, 
      limit: null, 
      count: 0,
    };
  }

  // For FREE tier: count active (open or in-progress) tournaments
  // Match by orgId if available, otherwise count all open tournaments
  // as a fallback for demo scenarios where currentUser.id may not match orgId
  let activeTournamentsCount = mockTournaments.filter(
    (t) => t.orgId === currentUser.id && (t.status === 'open' || t.status === 'in-progress')
  ).length;

  // Demo fallback: if user is on org role but has no matching tournaments,
  // use all open tournaments to simulate limit (for presentation purposes)
  if (currentUser.role === 'organization' && activeTournamentsCount === 0) {
    activeTournamentsCount = mockTournaments.filter(
      (t) => t.status === 'open' || t.status === 'in-progress'
    ).length;
  }

  return {
    canCreate: activeTournamentsCount < MAX_FREE_TOURNAMENTS,
    limit: MAX_FREE_TOURNAMENTS,
    count: activeTournamentsCount,
  };
}
