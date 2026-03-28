// ============================================================================
// SINGLE SOURCE OF TRUTH FOR ALL PROTOTYPE DATA
// ============================================================================

export interface Certificate {
  id: string;
  gameId: string;
  sport: string;
  gameName: string;
  venue: string;
  date: string;
  pointsEarned: number;
  playerName: string;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  accountType: 'player' | 'coach' | 'organization';
  isPWD: boolean;
  isMinor: boolean;
  totalPoints: number;
  sport: string;
  skillLevel: string;
  waiverAccepted: boolean;
  waiverTimestamp?: string;
  certificates: Certificate[];
}

export interface Venue {
  name: string;
  address: string;
  lat: number;
  lng: number;
  isPWDFriendly: boolean;
}

export interface Game {
  id: string;
  title: string;
  sport: string;
  hostId: string;
  players: string[];
  maxPlayers: number;
  teamFormat: string;
  skillLevel: string;
  date: string;
  time: string;
  venue: Venue;
  status: 'open' | 'full' | 'completed' | 'cancelled';
  isPWDWelcome: boolean;
}

export interface TeamMember {
  userId: string;
  role: 'captain' | 'member';
  points: number;
  gamesPlayed: number;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  captainId: string;
  coachId: string | null;
  members: TeamMember[];
  record: { wins: number; losses: number; draws: number };
  totalPoints: number;
}

export interface Schedule {
  id: string;
  sport: string;
  dayOfWeek: string;
  time: string;
  venue: string;
  recurring: boolean;
  spotsLeft: number;
  totalSpots: number;
  bookedBy: string[];
}

export interface TournamentParticipant {
  type: 'team' | 'solo';
  id: string;
}

export interface Tournament {
  id: string;
  name: string;
  orgId: string;
  sport: string;
  bracketType: 'single-elimination' | 'round-robin' | 'double-elimination';
  date: string;
  venue: string;
  participants: TournamentParticipant[];
  maxParticipants: number;
  status: 'open' | 'in-progress' | 'completed';
  hasPWDDivision: boolean;
  prizeDescription: string;
}

export interface Notification {
  id: string;
  toUserId: string;
  message: string;
  type: 'pwd_joined' | 'reminder' | 'certificate' | 'game_update' | 'team_invite' | 'tournament_update';
  timestamp: string;
  read: boolean;
}

// ============================================================================
// MOCK USERS (10 total)
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Marco Reyes',
    initials: 'MR',
    accountType: 'player',
    isPWD: false,
    isMinor: false,
    totalPoints: 1240,
    sport: 'Basketball',
    skillLevel: 'Competitive',
    waiverAccepted: true,
    waiverTimestamp: '2026-03-15T08:30:00.000Z',
    certificates: [],
  },
  {
    id: 'u2',
    name: 'Anika Santos',
    initials: 'AS',
    accountType: 'player',
    isPWD: true,
    isMinor: false,
    totalPoints: 980,
    sport: 'Badminton',
    skillLevel: 'Intermediate',
    waiverAccepted: true,
    certificates: [],
  },
  {
    id: 'u3',
    name: 'James Lim',
    initials: 'JL',
    accountType: 'coach',
    isPWD: false,
    isMinor: false,
    totalPoints: 0,
    sport: 'Basketball',
    skillLevel: 'N/A',
    waiverAccepted: true,
    certificates: [],
  },
  {
    id: 'u4',
    name: 'Carla Dizon',
    initials: 'CD',
    accountType: 'player',
    isPWD: false,
    isMinor: true,
    totalPoints: 520,
    sport: 'Volleyball',
    skillLevel: 'Beginner',
    waiverAccepted: false,
    certificates: [
      {
        id: 'cert1',
        gameId: 'g2',
        sport: 'Badminton',
        gameName: 'Pasig Badminton Clash',
        venue: 'Pasig Badminton Center',
        date: '2026-04-03',
        pointsEarned: 80,
        playerName: 'Carla Dizon',
      },
    ],
  },
  {
    id: 'u5',
    name: 'Rico Tan',
    initials: 'RT',
    accountType: 'organization',
    isPWD: false,
    isMinor: false,
    totalPoints: 0,
    sport: 'Multiple',
    skillLevel: 'N/A',
    waiverAccepted: true,
    certificates: [],
  },
  {
    id: 'u6',
    name: 'Juan dela Cruz',
    initials: 'JC',
    accountType: 'player',
    isPWD: false,
    isMinor: false,
    totalPoints: 850,
    sport: 'Basketball',
    skillLevel: 'Intermediate',
    waiverAccepted: true,
    certificates: [],
  },
  {
    id: 'u7',
    name: 'Maria Santos',
    initials: 'MS',
    accountType: 'player',
    isPWD: false,
    isMinor: false,
    totalPoints: 650,
    sport: 'Football',
    skillLevel: 'Beginner',
    waiverAccepted: true,
    certificates: [],
  },
  {
    id: 'u8',
    name: 'Carlos Reyes',
    initials: 'CR',
    accountType: 'player',
    isPWD: true,
    isMinor: false,
    totalPoints: 920,
    sport: 'Basketball',
    skillLevel: 'Intermediate',
    waiverAccepted: true,
    certificates: [],
  },
  {
    id: 'u9',
    name: 'Sofia Fernandez',
    initials: 'SF',
    accountType: 'player',
    isPWD: false,
    isMinor: false,
    totalPoints: 750,
    sport: 'Badminton',
    skillLevel: 'Intermediate',
    waiverAccepted: true,
    certificates: [],
  },
  {
    id: 'u10',
    name: 'David Lopez',
    initials: 'DL',
    accountType: 'player',
    isPWD: false,
    isMinor: true,
    totalPoints: 420,
    sport: 'Volleyball',
    skillLevel: 'Beginner',
    waiverAccepted: true,
    certificates: [],
  },
];

// ============================================================================
// MOCK GAMES (8 total)
// ============================================================================

export const mockGames: Game[] = [
  {
    id: 'g1',
    title: 'Taguig 3v3 Hoops',
    sport: 'Basketball',
    hostId: 'u6',
    players: ['u6', 'u8', 'u1'],
    maxPlayers: 6,
    teamFormat: '3v3',
    skillLevel: 'Intermediate',
    date: '2026-04-05',
    time: '4:00 PM',
    venue: {
      name: 'Taguig Sports Complex',
      address: 'Taguig City, Metro Manila',
      lat: 14.5243,
      lng: 121.0792,
      isPWDFriendly: true,
    },
    status: 'open',
    isPWDWelcome: true,
  },
  {
    id: 'g2',
    title: 'Pasig Badminton Clash',
    sport: 'Badminton',
    hostId: 'u2',
    players: ['u2', 'u9', 'u4', 'u1', 'u10'],
    maxPlayers: 5,
    teamFormat: '1v1',
    skillLevel: 'Beginner',
    date: '2026-04-05',
    time: '6:00 PM',
    venue: {
      name: 'Pasig Badminton Center',
      address: 'Pasig City, Metro Manila',
      lat: 14.5764,
      lng: 121.0851,
      isPWDFriendly: true,
    },
    status: 'full',
    isPWDWelcome: true,
  },
  {
    id: 'g3',
    title: 'QC Sunday Football',
    sport: 'Football',
    hostId: 'u3',
    players: ['u3', 'u1', 'u7', 'u10'],
    maxPlayers: 10,
    teamFormat: '5v5',
    skillLevel: 'Competitive',
    date: '2026-04-06',
    time: '7:00 AM',
    venue: {
      name: 'Ateneo Oval',
      address: 'Quezon City, Metro Manila',
      lat: 14.6396,
      lng: 121.0772,
      isPWDFriendly: false,
    },
    status: 'open',
    isPWDWelcome: false,
  },
  {
    id: 'g4',
    title: 'Makati Volleyball Night',
    sport: 'Volleyball',
    hostId: 'u4',
    players: ['u4', 'u10'],
    maxPlayers: 12,
    teamFormat: '6v6',
    skillLevel: 'Beginner',
    date: '2026-04-06',
    time: '7:00 PM',
    venue: {
      name: 'Makati Sports Center',
      address: 'Makati City, Metro Manila',
      lat: 14.5539,
      lng: 121.0158,
      isPWDFriendly: true,
    },
    status: 'open',
    isPWDWelcome: true,
  },
  {
    id: 'g5',
    title: 'Mandaluyong Tennis League',
    sport: 'Tennis',
    hostId: 'u1',
    players: ['u1', 'u9'],
    maxPlayers: 4,
    teamFormat: '1v1',
    skillLevel: 'Competitive',
    date: '2026-04-07',
    time: '5:30 PM',
    venue: {
      name: 'Mandaluyong Tennis Club',
      address: 'Mandaluyong City, Metro Manila',
      lat: 14.5729,
      lng: 121.0432,
      isPWDFriendly: false,
    },
    status: 'open',
    isPWDWelcome: false,
  },
  {
    id: 'g6',
    title: 'Eastwood Basketball Pickup',
    sport: 'Basketball',
    hostId: 'u8',
    players: ['u8', 'u6', 'u1', 'u3'],
    maxPlayers: 10,
    teamFormat: '5v5',
    skillLevel: 'Intermediate',
    date: '2026-04-08',
    time: '3:00 PM',
    venue: {
      name: 'Eastwood Basketball Court',
      address: 'Quezon City, Metro Manila',
      lat: 14.6359,
      lng: 121.0922,
      isPWDFriendly: true,
    },
    status: 'open',
    isPWDWelcome: true,
  },
  {
    id: 'g7',
    title: 'BGC Futsal Tournament',
    sport: 'Football',
    hostId: 'u5',
    players: ['u7', 'u1', 'u3'],
    maxPlayers: 10,
    teamFormat: '5v5',
    skillLevel: 'Beginner',
    date: '2026-04-09',
    time: '6:00 PM',
    venue: {
      name: 'BGC Futsal Arena',
      address: 'Bonifacio Global City, Metro Manila',
      lat: 14.5994,
      lng: 121.0437,
      isPWDFriendly: true,
    },
    status: 'open',
    isPWDWelcome: true,
  },
  {
    id: 'g8',
    title: 'Las Piñas Badminton Open',
    sport: 'Badminton',
    hostId: 'u9',
    players: ['u9', 'u2', 'u1'],
    maxPlayers: 8,
    teamFormat: 'doubles',
    skillLevel: 'Intermediate',
    date: '2026-04-10',
    time: '7:00 PM',
    venue: {
      name: 'Las Piñas Sports Complex',
      address: 'Las Piñas City, Metro Manila',
      lat: 14.3544,
      lng: 120.9844,
      isPWDFriendly: true,
    },
    status: 'open',
    isPWDWelcome: true,
  },
];

// ============================================================================
// MOCK TEAMS (4 total)
// ============================================================================

export const mockTeams: Team[] = [
  {
    id: 't1',
    name: 'Ballers PH',
    sport: 'Basketball',
    captainId: 'u1',
    coachId: 'u3',
    members: [
      { userId: 'u1', role: 'captain', points: 420, gamesPlayed: 12 },
      { userId: 'u6', role: 'member', points: 310, gamesPlayed: 10 },
      { userId: 'u8', role: 'member', points: 280, gamesPlayed: 9 },
    ],
    record: { wins: 8, losses: 3, draws: 1 },
    totalPoints: 1010,
  },
  {
    id: 't2',
    name: 'Smash Sisters',
    sport: 'Badminton',
    captainId: 'u2',
    coachId: null,
    members: [
      { userId: 'u2', role: 'captain', points: 390, gamesPlayed: 15 },
      { userId: 'u9', role: 'member', points: 260, gamesPlayed: 11 },
    ],
    record: { wins: 10, losses: 2, draws: 3 },
    totalPoints: 650,
  },
  {
    id: 't3',
    name: 'Kicks PH',
    sport: 'Football',
    captainId: 'u7',
    coachId: null,
    members: [
      { userId: 'u7', role: 'captain', points: 350, gamesPlayed: 14 },
      { userId: 'u1', role: 'member', points: 280, gamesPlayed: 10 },
      { userId: 'u10', role: 'member', points: 150, gamesPlayed: 8 },
    ],
    record: { wins: 6, losses: 5, draws: 2 },
    totalPoints: 780,
  },
  {
    id: 't4',
    name: 'Volley United',
    sport: 'Volleyball',
    captainId: 'u4',
    coachId: null,
    members: [
      { userId: 'u4', role: 'captain', points: 280, gamesPlayed: 11 },
      { userId: 'u10', role: 'member', points: 120, gamesPlayed: 7 },
    ],
    record: { wins: 5, losses: 3, draws: 1 },
    totalPoints: 400,
  },
];

// ============================================================================
// MOCK SCHEDULES (5 recurring slots)
// ============================================================================

export const mockSchedules: Schedule[] = [
  {
    id: 's1',
    sport: 'Basketball',
    dayOfWeek: 'Saturday',
    time: '3:00 PM',
    venue: 'Taguig Sports Complex',
    recurring: true,
    spotsLeft: 2,
    totalSpots: 10,
    bookedBy: ['u1', 'u6', 'u7', 'u8', 'u9', 'u10', 'u4', 'u2'],
  },
  {
    id: 's2',
    sport: 'Badminton',
    dayOfWeek: 'Wednesday',
    time: '6:00 PM',
    venue: 'Pasig Badminton Center',
    recurring: true,
    spotsLeft: 5,
    totalSpots: 8,
    bookedBy: ['u2', 'u9'],
  },
  {
    id: 's3',
    sport: 'Football',
    dayOfWeek: 'Sunday',
    time: '7:00 AM',
    venue: 'Ateneo Oval',
    recurring: true,
    spotsLeft: 3,
    totalSpots: 10,
    bookedBy: ['u3', 'u1', 'u7', 'u10', 'u6', 'u8', 'u9'],
  },
  {
    id: 's4',
    sport: 'Volleyball',
    dayOfWeek: 'Friday',
    time: '7:00 PM',
    venue: 'Makati Sports Center',
    recurring: true,
    spotsLeft: 8,
    totalSpots: 12,
    bookedBy: ['u4', 'u10'],
  },
  {
    id: 's5',
    sport: 'Tennis',
    dayOfWeek: 'Tuesday',
    time: '5:30 PM',
    venue: 'Mandaluyong Tennis Club',
    recurring: true,
    spotsLeft: 1,
    totalSpots: 4,
    bookedBy: ['u1', 'u9', 'u2', 'u6'],
  },
];

// ============================================================================
// MOCK TOURNAMENTS (2 total)
// ============================================================================

export const mockTournaments: Tournament[] = [
  {
    id: 'tr1',
    name: 'Metro Manila Basketball Cup 2026',
    orgId: 'u5',
    sport: 'Basketball',
    bracketType: 'single-elimination',
    date: '2026-04-20',
    venue: 'Rizal Memorial Coliseum',
    participants: [
      { type: 'team', id: 't1' },
      { type: 'team', id: 't3' },
    ],
    maxParticipants: 8,
    status: 'open',
    hasPWDDivision: true,
    prizeDescription: 'Trophy + Digital Certificate',
  },
  {
    id: 'tr2',
    name: 'Inclusive Badminton Open',
    orgId: 'u5',
    sport: 'Badminton',
    bracketType: 'round-robin',
    date: '2026-04-27',
    venue: 'Pasig Badminton Center',
    participants: [
      { type: 'solo', id: 'u2' },
      { type: 'solo', id: 'u9' },
      { type: 'team', id: 't2' },
    ],
    maxParticipants: 16,
    status: 'open',
    hasPWDDivision: true,
    prizeDescription: 'Gold Medal + Digital Certificate',
  },
];

// ============================================================================
// MOCK NOTIFICATIONS (3 pre-existing)
// ============================================================================

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    toUserId: 'u6',
    message: 'Anika Santos (PWD) joined your game "Taguig 3v3 Hoops"',
    type: 'pwd_joined',
    timestamp: '2026-04-04T10:23:00',
    read: false,
  },
  {
    id: 'n2',
    toUserId: 'u1',
    message: 'Your game "QC Sunday Football" starts in 1 hour',
    type: 'reminder',
    timestamp: '2026-04-06T06:00:00',
    read: false,
  },
  {
    id: 'n3',
    toUserId: 'u4',
    message: 'You earned a Digital Certificate for "Pasig Badminton Clash"',
    type: 'certificate',
    timestamp: '2026-04-03T20:00:00',
    read: true,
  },
];

// ============================================================================
// CURRENT LOGGED IN USER
// ============================================================================

export const mockCurrentUser: User = mockUsers[0]; // Marco Reyes (u1)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a user by ID
 */
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

/**
 * Get a game by ID
 */
export function getGameById(id: string): Game | undefined {
  return mockGames.find((game) => game.id === id);
}

/**
 * Get a team by ID
 */
export function getTeamById(id: string): Team | undefined {
  return mockTeams.find((team) => team.id === id);
}

/**
 * Get all games where a specific user is a player
 */
export function getGamesByPlayer(userId: string): Game[] {
  return mockGames.filter((game) => game.players.includes(userId));
}

/**
 * Get all open games (not full or completed)
 */
export function getOpenGames(): Game[] {
  return mockGames.filter((game) => game.status === 'open');
}

/**
 * Get all PWD-friendly open games
 */
export function getPWDFriendlyOpenGames(): Game[] {
  return mockGames.filter((game) => game.status === 'open' && game.isPWDWelcome);
}

/**
 * Get games by sport
 */
export function getGamesBySport(sport: string): Game[] {
  return mockGames.filter((game) => game.sport === sport);
}

/**
 * Get games by skill level
 */
export function getGamesBySkillLevel(skillLevel: string): Game[] {
  return mockGames.filter((game) => game.skillLevel === skillLevel);
}

/**
 * Get teams by sport
 */
export function getTeamsBySport(sport: string): Team[] {
  return mockTeams.filter((team) => team.sport === sport);
}

/**
 * Get teams that user is a member of
 */
export function getUserTeams(userId: string): Team[] {
  return mockTeams.filter((team) =>
    team.members.some((member) => member.userId === userId)
  );
}

/**
 * Get tournaments by sport
 */
export function getTournamentsBySport(sport: string): Tournament[] {
  return mockTournaments.filter((tournament) => tournament.sport === sport);
}

/**
 * Get active (open) tournaments
 */
export function getActiveTournaments(): Tournament[] {
  return mockTournaments.filter((tournament) => tournament.status === 'open');
}

/**
 * Get unread notifications for a user
 */
export function getUnreadNotifications(userId: string): Notification[] {
  return mockNotifications.filter((notif) => notif.toUserId === userId && !notif.read);
}

/**
 * Get all notifications for a user
 */
export function getUserNotifications(userId: string): Notification[] {
  return mockNotifications.filter((notif) => notif.toUserId === userId);
}

/**
 * Get PWD users in the system
 */
export function getPWDUsers(): User[] {
  return mockUsers.filter((user) => user.isPWD);
}

/**
 * Get minor users in the system
 */
export function getMinorUsers(): User[] {
  return mockUsers.filter((user) => user.isMinor);
}

/**
 * Get leaderboard sorted by points
 */
export function getLeaderboard(): User[] {
  return [...mockUsers].sort((a, b) => b.totalPoints - a.totalPoints);
}

/**
 * Get game details with host info
 */
export function getGameDetailsWithHost(gameId: string) {
  const game = getGameById(gameId);
  if (!game) return null;
  const host = getUserById(game.hostId);
  return { ...game, hostInfo: host };
}

/**
 * Get team details with member info
 */
export function getTeamDetailsWithMembers(teamId: string) {
  const team = getTeamById(teamId);
  if (!team) return null;
  const memberInfos = team.members.map((member) => ({
    ...member,
    userInfo: getUserById(member.userId),
  }));
  return { ...team, memberDetails: memberInfos };
}
